import BasicModel from './BasicModel';
import ContributionService from '../services/Contribution';

import {
  PENDING_CONFIRMATION,
  CONFIRMED,
  TOKENS_AVAILABLE,
  PENDING_CLAIM_TOKENS,
  TOKENS_CLAIMED,
} from '../constants';

class Contribution extends BasicModel {
  static get PENDING_CONFIRMATION() {
    return PENDING_CONFIRMATION;
  }
  static get CONFIRMED() {
    return CONFIRMED;
  }
  static get TOKENS_AVAILABLE() {
    return TOKENS_AVAILABLE;
  }
  static get PENDING_CLAIM_TOKENS() {
    return PENDING_CLAIM_TOKENS;
  }
  static get TOKENS_CLAIMED() {
    return TOKENS_CLAIMED;
  }

  constructor(data) {
    super(data);

    this.pool = data.pool || '';
    this.ownerWallet = data.ownerWallet || '';
    this.ownerId = data.ownerId || '';
    this.amount = data.amount || 0; // in Ether
    this.status = data.status || Contribution.PENDING_CONFIRMATION;
    // ToDo: currency, ether by default for now
  }

  toFeathers() {
    return {
      id: this.id,
      pool: this.pool,
      ownerWallet: this.ownerWallet,
      amount: this.amount,
      txHash: this.txHash,
      txTimestamp: this.txTimestamp,
      status: this.status,
    };
  }
  /**
   * Save the campaign to feathers and blockchain if necessary
   *
   * @param afterCreate Callback function once a transaction is created
   * @param afterMined  Callback function once the transaction is mined and feathers updated
   */
  save(afterCreate, afterMined) {
    ContributionService.save(this, this.owner.address, afterCreate, afterMined);
  }

  /**
   * Cancel the campaign in feathers and blockchain
   *
   * @param from        Either the owner or reviewer. Whoever is canceling the campaign
   * @param afterCreate Callback function once a transaction is created
   * @param afterMined  Callback function once the transaction is mined and feathers updated
   */
  cancel(from, afterCreate, afterMined) {
    ContributionService.cancel(this, from, afterCreate, afterMined);
  }

  get status() {
    return this.myStatus;
  }

  set status(value) {
    this.checkValue(value, [
      Contribution.PENDING_CONFIRMATION,
      Contribution.CONFIRMED,
      Contribution.TOKENS_AVAILABLE,
      Contribution.PENDING_CLAIM_TOKENS,
      Contribution.TOKENS_CLAIMED
    ], 'status');
    this.myStatus = value;
    // if (value === Contribution.PENDING) this.myOrder = 1;
    // else if (value === Contribution.ACTIVE) this.myOrder = 2;
    // else if (value === Contribution.CANCELED) this.myOrder = 3;
    // else this.myOrder = 4;
  }

  get amount() {
    return this.myAmount;
  }

  set amount(value) {
    this.checkType(value, ['number'], 'amount');
    this.myAmount = value;
  }

  get pool() {
    return this.myPool;
  }

  set pool(value) {
    this.checkType(value, ['object', 'string'], 'pool');
    this.myPool = value;
  }

  get poolAddress() {
    return this.myPoolAddress;
  }

  set poolAddress(value) {
    this.checkType(value, ['undefined', 'string'], 'poolAddress');
    this.myPoolAddress = value;
  }

  get ownerWallet() {
    return this.myOwnerWallet;
  }

  set ownerWallet(value) {
    this.checkType(value, ['undefined', 'string'], 'ownerWallet');
    this.myOwnerWallet = value;
  }

  get ownerId() {
    return this.myOwnerId;
  }

  set ownerId(value) {
    this.checkType(value, ['undefined', 'string'], 'ownerId');
    this.myOwnerId = value;
  }

  get txTimestamp() {
    return this.myTxTimeStamp;
  }

  set txTimestamp(value) {
    this.checkType(value, ['number'], 'txTimestamp');
    this.myTxTimeStamp = value;
  }

  get closeDate() {
    return this.myCloseDate;
  }

  set closeDate(value) {
    this.checkType(value, ['number'], 'closeDate');
    this.myCloseDate = value;
  }
}

export default Contribution;
