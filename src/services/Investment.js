// import { LPPCampaign } from 'lpp-campaign';
import getNetwork from '../lib/blockchain/getNetwork';
import getWeb3 from '../lib/blockchain/getWeb3';
import contract from 'truffle-contract';
import { feathersClient } from '../lib/feathersClient';
import { getGasPrice } from '../lib/helpers';
import Investment from '../models/Investment';
import generateClass from 'eth-contract-class';
import ErrorPopup from '../components/ErrorPopup';

const felixPoolArtifact = require('../lib/blockchain/contracts/FelixPool.json');

class InvestmentService {
  /**
   * Get a Investment defined by ID
   *
   * @param id   ID of the Investment to be retrieved
   */
  static get(address) {
    return new Promise((resolve, reject) => {
      feathersClient
        .service('investments')
        .find({ query: { address } })
        .then(resp => {
          resolve(new Investment(resp.data[0]));
        })
        .catch(reject);
    });
  }

  /**
   * Lazy-load Investments by subscribing to Investments listener
   *
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static subscribe(onSuccess, onError) {
    return feathersClient
      .service('investments')
      .watch({ listStrategy: 'always' })
      .find({
        query: {
          status: Investment.ACTIVE,
          $limit: 200,
        },
      })
      .subscribe(resp => {
        const newResp = Object.assign({}, resp, {
          data: resp.data.map(c => new Investment(c)),
        });
        onSuccess(newResp);
      }, onError);
  }

  /**
   * Get the user's Investments
   *
   * @param userAddress Address of the user whose Campaign list should be retrieved
   * @param onSuccess   Callback function once response is obtained successfully
   * @param onError     Callback function if error is encountered
   */
  static getUserInvestments(userAddress, onSuccess, onError) {
    return feathersClient
      .service('investments')
      .watch({ listStrategy: 'always' })
      .find({
        query: {
          investorAddress: userAddress,
        },
      })
      .subscribe(
        resp =>
          onSuccess(
            resp.data.map(investment => new Investment(investment)).sort(Investment.compare),
          ),
        onError,
      );
  }

  /**
   * Save new Campaign to the blockchain or update existing one in feathers
   * TODO: Handle error states properly
   *
   * @param investment    Campaign object to be saved
   * @param from        Address of the user creating the Campaign
   * @param afterCreate Callback to be triggered after the Campaign is created in feathers
   * @param afterMined  Callback to be triggered after the transaction is mined
   */
  static save(investment, from, afterCreate = () => {}, afterMined = () => {}) {
    console.log('investment', investment);
    console.log('from', from);
    if (investment.id) {
      feathersClient
        .service('investment')
        .patch(investment.id, investment.toFeathers())
        .then(() => afterMined());
    } else {
      let txHash;
      let etherScanUrl;
      Promise.all([getNetwork(), getWeb3(), getGasPrice()])
        .then(([network, web3, gasPrice]) => {
          // const { lppCampaignFactory } = network;
          etherScanUrl = network.etherscan;

          const { abi, bytecode } = felixPoolArtifact;
          const { amount, poolAddress } = investment;
          console.log('investment', investment);
          console.log('abi', !!abi);
          console.log('amount', amount);
          console.log('poolAddress', poolAddress);
          console.log('from', from);
          const contract = new web3.eth.Contract(abi, poolAddress, { from });
          contract.methods
            .deposit()
            .send({
              from,
              gas: 1500000,
              gasPrice,
              value: amount,
            })
            .once('transactionHash', txHash => {
              investment.txHash = txHash;
              afterCreate(`${etherScanUrl}tx/${txHash}`);

              feathersClient
                .service('investments')
                .create(investment.toFeathers())
                .then((result) => {
                  investment.id = result._id;
                });
            })
            .once('confirmation', (confirmationNumber, receipt) => {
              console.log('confirmationNumber', confirmationNumber);
              afterMined(`${etherScanUrl}tx/${txHash}`)
            })
            .catch(err => {
              console.log('err', err);
              ErrorPopup(
                'Something went wrong with the transaction. Is your wallet unlocked?',
                `${etherScanUrl}tx/${txHash}`,
              );
            });
        })
        .catch(err => {
          ErrorPopup(
            'Something went wrong with the transaction. Is your wallet unlocked?',
            `${etherScanUrl}tx/${txHash} => ${JSON.stringify(err, null, 2)}`,
          );
        });
    }
  }

  /**
   * Cancel Campaign in the blockchain and update it in feathers
   * TODO: Handle error states properly
   *
   * @param campaign    Campaign to be cancelled
   * @param from        Address of the user cancelling the Campaign
   * @param afterCreate Callback to be triggered after the Campaign is cancelled in feathers
   * @param afterMined  Callback to be triggered after the transaction is mined
   */
  static cancel(campaign, from, afterCreate = () => {}, afterMined = () => {}) {
    let txHash;
    let etherScanUrl;
    // Promise.all([getNetwork(), getWeb3(), getGasPrice()])
    //   .then(([network, web3, gasPrice]) => {
    //     const lppCampaign = new LPPCampaign(web3, campaign.pluginAddress);
    //     etherScanUrl = network.etherscan;
    //
    //     lppCampaign
    //       .cancelCampaign({ from, gasPrice, $extraGas: 100000 })
    //       .once('transactionHash', hash => {
    //         txHash = hash;
    //         feathersClient
    //           .service('/campaigns')
    //           .patch(campaign.id, {
    //             status: Campaign.CANCELED,
    //             mined: false,
    //             txHash,
    //           })
    //           .then(afterCreate(`${etherScanUrl}tx/${txHash}`))
    //           .catch(err => {
    //             ErrorPopup('Something went wrong with updating campaign', err);
    //           });
    //       })
    //       .then(() => afterMined(`${etherScanUrl}tx/${txHash}`))
    //       .catch(err => {
    //         ErrorPopup(
    //           'Something went wrong with cancelling your campaign',
    //           `${etherScanUrl}tx/${txHash} => ${JSON.stringify(err, null, 2)}`,
    //         );
    //       });
    //   })
    //   .catch(err => {
    //     ErrorPopup(
    //       'Something went wrong with cancelling your campaign',
    //       `${etherScanUrl}tx/${txHash} => ${JSON.stringify(err, null, 2)}`,
    //     );
    //   });
  }
}

export default InvestmentService;
