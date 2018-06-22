import BasicModel from './BasicModel';
import ContributionService from '../services/Contribution';
import UploadService from '../services/Uploads';
/**
 * The DApp Contribution model
 */
class Contribution extends BasicModel {
  static get CANCELLED() {
    return 'Cancelled';
  }
  static get FAILED() {
    return 'Failed';
  }
  static get PENDING() {
    return 'Pending';
  }
  static get CONFIRMED() {
    return 'Confirmed';
  }

  constructor(data) {
    super(data);

    this.poolAddress = data.poolAddress || '';
    this.wallet = data.wallet || '';
    this.amount = data.amount || 0; // in Ether
    this.status = data.status || Contribution.PENDING;
    // ToDo: currency, ether by default for now
  }

  toFeathers() {
    return {
      id: this.id,
      poolAddress: this.poolAddress,
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
    this.checkValue(value, [Contribution.PENDING, Contribution.ACTIVE, Contribution.CANCELED], 'status');
    this.myStatus = value;
    if (value === Contribution.PENDING) this.myOrder = 1;
    else if (value === Contribution.ACTIVE) this.myOrder = 2;
    else if (value === Contribution.CANCELED) this.myOrder = 3;
    else this.myOrder = 4;
  }

  get amount() {
    return this.myAmount;
  }

  set amount(value) {
    this.checkType(value, ['number'], 'amount');
    this.myAmount = value;
  }

  get poolAddress() {
    return this.myPoolAddress;
  }

  set poolAddress(value) {
    this.checkType(value, ['undefined', 'string'], 'poolAddress');
    this.myPoolAddress = value;
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
