import getWeb3 from '../lib/blockchain/getWeb3';
import { feathersClient } from '../lib/feathersClient';
import { getGasPrice } from '../lib/helpers';
import Contribution from '../models/Contribution';
import ErrorPopup from '../components/ErrorPopup';

const felixPoolArtifact = require('../lib/blockchain/contracts/FelixPool.json');

class ContributionService {
  /**
   * Get a Contribution defined by ID
   *
   * @param id   ID of the Contribution to be retrieved
   */
  static get(ownerWallet) {
    return new Promise((resolve, reject) => {
      feathersClient
        .service('contributions')
        .find({ query: { ownerWallet: ownerWallet } })
        .then(resp => {
          resolve(new Contribution(resp.data[0]));
        })
        .catch(reject);
    });
  }

  /**
   * Lazy-load Contributions by subscribing to Contributions listener
   *
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static subscribe(onSuccess, onError) {
    return feathersClient
      .service('contributions')
      .watch({ listStrategy: 'always' })
      .find({
        query: {
          status: Contribution.ACTIVE,
          $limit: 200,
        },
      })
      .subscribe(resp => {
        const newResp = Object.assign({}, resp, {
          data: resp.data.map(c => new Contribution(c)),
        });
        onSuccess(newResp);
      }, onError);
  }

  /**
   * Get the user's Contributions
   *
   * @param userAddress Address of the user whose Campaign list should be retrieved
   * @param onSuccess   Callback function once response is obtained successfully
   * @param onError     Callback function if error is encountered
   */
  static getUserContributions(ownerId, onSuccess, onError) {
    return feathersClient
      .service('contributions')
      .watch({ listStrategy: 'always' })
      .find({
        query: {
          ownerId
        },
      })
      .subscribe(
        resp => onSuccess(
          resp.data.map(contribution => new Contribution(contribution))
        ),
        onError,
      );
  }

  /**
   * Get the user's Contributions made to a particular pool
   *
   * @param userId Id of user who made the contribution
   * @param pooId Id of the pool whose contribution was made to
   *
   */
  static getUserContributionsByPoolId(userId, poolId) {
    return feathersClient
      .service('contributions')
      .find({
        query: {
          ownerId: userId,
          pool: poolId
        },
      });
  }

  /**
   * Save new Campaign to the blockchain or update existing one in feathers
   * TODO: Handle error states properly
   *
   * @param contribution    Campaign object to be saved
   * @param from        Address of the user creating the Campaign
   * @param afterCreate Callback to be triggered after the Campaign is created in feathers
   * @param afterMined  Callback to be triggered after the transaction is mined
   */
  static save(contribution, from, afterCreate = () => {}, afterMined = () => {}) {
    console.log('contribution', contribution);
    console.log('from', from);
    if (contribution.id) {
      feathersClient
        .service('contribution')
        .patch(contribution.id, contribution.toFeathers())
        .then(() => afterMined());
    } else {
      // let txHash;
      // let etherScanUrl;
      // Promise.all([getNetwork(), getWeb3(), getGasPrice()])
      //   .then(([network, web3, gasPrice]) => {
      //     // const { lppCampaignFactory } = network;
      //     etherScanUrl = network.etherscan;
      //
      //     const { abi } = felixPoolArtifact;
      //     const { amount, pool } = contribution;
      //     const contract = new web3.eth.Contract(abi, pool.address, { from });
      //     contract.methods
      //       .deposit()
      //       .send({
      //         from,
      //         gas: 1500000,
      //         gasPrice,
      //         value: amount,
      //       })
      //       .once('transactionHash', txHash => {
      //         contribution.txHash = txHash;
      //         afterCreate(`${etherScanUrl}tx/${txHash}`);
      //
      //         feathersClient
      //           .service('contributions')
      //           .create(contribution.toFeathers())
      //           .then((result) => {
      //             contribution.id = result._id;
      //           });
      //       })
      //       .once('confirmation', (confirmationNumber, receipt) => {
      //         console.log('confirmationNumber', confirmationNumber);
      //         afterMined(`${etherScanUrl}tx/${txHash}`)
      //       })
      //       .catch(err => {
      //         console.log('err', err);
      //         ErrorPopup(
      //           'Something went wrong with the transaction. Is your wallet unlocked?',
      //           `${etherScanUrl}tx/${txHash}`,
      //         );
      //       });
      //   })
      //   .catch(err => {
      //     ErrorPopup(
      //       'Something went wrong with the transaction. Is your wallet unlocked?',
      //       `${etherScanUrl}tx/${txHash} => ${JSON.stringify(err, null, 2)}`,
      //     );
      //   });
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

  }
}

export default ContributionService;
