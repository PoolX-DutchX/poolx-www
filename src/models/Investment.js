import BasicModel from './BasicModel';
import InvestmentService from '../services/Investment';
import UploadService from '../services/Uploads';
/**
 * The DApp Investment model
 */
class Investment extends BasicModel {
  static get CANCELED() {
    return 'Canceled';
  }
  static get PENDING() {
    return 'Pending';
  }
  static get ACTIVE() {
    return 'Active';
  }

  constructor(data) {
    super(data);

    this.poolAddress = data.poolAddress;
    this.amount = data.amount; // in Wei
    this.status = data.status || Investment.PENDING;
    // ToDo: currency, ether by default for now
  }

  toFeathers() {
    return {
      id: this.id,
      poolAddress: this.poolAddress,
      amount: this.amount,
      txHash: this.txHash,
      txTimestamp: this.txTimestamp,
      status: this.status,
      // investorAddress
    };
  }

  get isActive() {
    return this.status === Investment.ACTIVE;
  }

  /**
   * Save the campaign to feathers and blockchain if necessary
   *
   * @param afterCreate Callback function once a transaction is created
   * @param afterMined  Callback function once the transaction is mined and feathers updated
   */
  save(afterCreate, afterMined) {
    InvestmentService.save(this, this.owner.address, afterCreate, afterMined);
  }

  /**
   * Cancel the campaign in feathers and blockchain
   *
   * @param from        Either the owner or reviewer. Whoever is canceling the campaign
   * @param afterCreate Callback function once a transaction is created
   * @param afterMined  Callback function once the transaction is mined and feathers updated
   */
  cancel(from, afterCreate, afterMined) {
    InvestmentService.cancel(this, from, afterCreate, afterMined);
  }

  get status() {
    return this.myStatus;
  }

  set status(value) {
    this.checkValue(value, [Investment.PENDING, Investment.ACTIVE, Investment.CANCELED], 'status');
    this.myStatus = value;
    if (value === Investment.PENDING) this.myOrder = 1;
    else if (value === Investment.ACTIVE) this.myOrder = 2;
    else if (value === Investment.CANCELED) this.myOrder = 3;
    else this.myOrder = 4;
  }

  get amount() {
    return this.myAmount;
  }

  set amount(value) {
    this.checkType(value, ['string'], 'amount');
    this.myAmount = value;
  }

  get poolAddress() {
    return this.myPoolAddress;
  }

  set poolAddress(value) {
    this.checkType(value, ['undefined', 'string'], 'poolAddress');
    this.myPoolAddress = value;
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

export default Investment;
