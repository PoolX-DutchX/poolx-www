// import { LPPCampaign } from 'lpp-campaign';
import getNetwork from '../lib/blockchain/getNetwork';
import getWeb3 from '../lib/blockchain/getWeb3';
import { feathersClient } from '../lib/feathersClient';
import { getGasPrice } from '../lib/helpers';
import Pool from '../models/Pool';
import ErrorPopup from '../components/ErrorPopup';

const felixPoolArtifact = require('../lib/blockchain/contracts/FelixPool.json');

class PoolService {
  /**
   * Get a Pool defined by ID
   *
   * @param id   ID of the Pool to be retrieved
   */
  static getById(poolId) {
    return new Promise((resolve, reject) => {
      feathersClient
        .service('pools')
        .find(poolId)
        .then(resp => {
          resolve(new Pool(resp.data[0]));
        })
        .catch(reject);
    });
  }

  /**
   * Get a Pool defined by ID
   *
   * @param ownerId   ID of the Pool to be retrieved
   */
  static getByOwnerId(ownerId) {
    return new Promise((resolve, reject) => {
      feathersClient
        .service('pools')
        .find({
          query: {
            owner: ownerId
          }
        })
        .then(({ data: pools }) => {
          resolve( pools.map(pool => {
            console.log('pool', pool);
            console.log('new Pool(pool)', new Pool(pool));
            return new Pool(pool)
          }));
        })
        .catch(reject);
    });
  }

  /**
   * Lazy-load Pools by subscribing to Pools listener
   *
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static subscribe(onSuccess, onError) {
    return feathersClient
      .service('pools')
      .watch({ listStrategy: 'always' })
      .find({
        query: {
          status: Pool.ACTIVE,
          $limit: 200,
        },
      })
      .subscribe(resp => {
        const newResp = Object.assign({}, resp, {
          data: resp.data.map(c => new Pool(c)),
        });
        onSuccess(newResp);
      }, onError);
  }

  /**
   * Get the user's Pools
   *
   * @param userAddress Address of the user whose Campaign list should be retrieved
   * @param onSuccess   Callback function once response is obtained successfully
   * @param onError     Callback function if error is encountered
   */
  static getUserPools(userAddress, onSuccess, onError) {
    return feathersClient
      .service('pools')
      .watch({ listStrategy: 'always' })
      .find({
        query: {
          ownerWallet: userAddress,
        },
      })
      .subscribe(
        resp => onSuccess(resp.data.map(pool => new Pool(pool)).sort(Pool.compare)),
        onError,
      );
  }

  /**
   * Get list of user's wallets that are in Pool whitelist
   *
   * @param userId Id of the user whose addressess will be checked if in whitelist
   * @param poolId Id of the pool whose whitelist will be checked
   *
   */
  static getWhitelistedAddressesByUser(poolId, userId) {
    return feathersClient
      .service('pools')
      .get(poolId, {
        query: {
          userWhitelisted: userId,
        },
      });
  }

  /**
   * Save new Pool to the blockchain or update existing one in feathers
   * TODO: Handle error states properly
   *
   * @param pool    Campaign object to be saved
   * @param from        Address of the user creating the Campaign
   * @param afterCreate Callback to be triggered after the Campaign is created in feathers
   * @param afterMined  Callback to be triggered after the transaction is mined
   */
  static save(pool) {
    console.log('pool.toFeathers()', pool.toFeathers());
    if (pool.id) {
      return feathersClient
        .service('pools')
        .patch(pool.id, pool.toFeathers())
    } else {
      return feathersClient
        .service('pools')
        .create(pool.toFeathers())
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
    // let txHash;
    // let etherScanUrl;
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

export default PoolService;
