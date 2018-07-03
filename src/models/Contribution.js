import BasicModel from './BasicModel';
import ContributionService from '../services/Contribution';
import {
  AWAITING_CONTRIBUTION_TX,
  CONTRIBUTION_TX_PENDING,
  CONTRIBUTION_COMPLETE,
  AWAITING_CLAIM_TX,
  CLAIM_TX_PENDING,
  CLAIM_COMPLETE,
} from '../constants';

class Contribution extends BasicModel {
  static get AWAITING_CONTRIBUTION_TX() {
    return AWAITING_CONTRIBUTION_TX;
  }
  static get CONTRIBUTION_TX_PENDING() {
    return CONTRIBUTION_TX_PENDING;
  }
  static get CONTRIBUTION_COMPLETE() {
    return CONTRIBUTION_COMPLETE;
  }
  static get AWAITING_CLAIM_TX() {
    return AWAITING_CLAIM_TX;
  }
  static get CLAIM_TX_PENDING() {
    return CLAIM_TX_PENDING;
  }
  static get CLAIM_COMPLETE() {
    return CLAIM_COMPLETE;
  }

  constructor(data) {
    super(data);

    this.pool = data.pool || '';
    this.wallet = data.wallet || '';
    this.amount = data.amount || 0; // in Ether
    this.status = data.status || Contribution.AWAITING_CONTRIBUTION_TX;
    // ToDo: currency, ether by default for now
  }

  toFeathers() {
    return {
      id: this.id,
      pool: this.pool,
      wallet: this.wallet,
      amount: this.amount,
      txHash: this.txHash,
      txTimestamp: this.txTimestamp,
      status: this.status,
    };
  }

  get isActive() {
    return this.status === Contribution.ACTIVE;
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
      Contribution.AWAITING_CONTRIBUTION_TX,
      Contribution.CONTRIBUTION_TX_PENDING,
      Contribution.CONTRIBUTION_COMPLETE,
      Contribution.AWAITING_CLAIM_TX,
      Contribution.CLAIM_TX_PENDING,
      Contribution.CLAIM_COMPLETE
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

  get wallet() {
    return this.myWallet;
  }

  set wallet(value) {
    this.checkType(value, ['undefined', 'string'], 'wallet');
    this.myWallet = value;
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
