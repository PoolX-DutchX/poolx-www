import { feathersClient } from '../lib/feathersClient';
import Contribution from '../models/Contribution';

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
          owner: ownerId,
        },
      })
      .subscribe(resp => {
        const contributions = resp.data.map(contribution => new Contribution(contribution));
        onSuccess(contributions);
      }, onError);
  }

  /**
   * Get the user's Contributions made to a particular pool
   *
   * @param userId Id of user who made the contribution
   * @param pooId Id of the pool whose contribution was made to
   *
   */
  static subscribeUserContributionsByPoolId(userId, poolId, onSuccess, onError) {
    return feathersClient
      .service('contributions')
      .watch({ listStrategy: 'always' })
      .find({
        query: {
          owner: userId,
          pool: poolId,
          status: {
            $ne: Contribution.PENDING_CONFIRMATION,
          },
        },
      })
      .subscribe(resp => {
        const contributions = resp.data.map(contribution => new Contribution(contribution));
        onSuccess(contributions);
      }, onError);
  }
  /**
   * Get the user's Contributions made to a particular pool
   *
   * @param userId Id of user who made the contribution
   * @param pooId Id of the pool whose contribution was made to
   *
   */
  static getUserContributionsByPoolId(userId, poolId) {
    return feathersClient.service('contributions').find({
      query: {
        owner: userId,
        pool: poolId,
        status: {
          $ne: Contribution.PENDING_CONFIRMATION,
        },
      },
    });
  }

  /**
   * Update user's Contribution status for a particular contribution
   *
   * @param contributionId Id of contribution being updated
   * @param new status to update the contribution with
   *
   */
  static patch(contributionId, payload) {
    console.log('contributionId', contributionId);
    return feathersClient.service('contributions').patch(contributionId, payload);
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
  static cancel(campaign, from, afterCreate = () => {}, afterMined = () => {}) {}
}

export default ContributionService;
