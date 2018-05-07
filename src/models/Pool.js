import BasicModel from './BasicModel';
import CampaignService from '../services/Campaign';
import UploadService from '../services/Uploads';
/**
 * The DApp Pool model
 */
class Pool extends BasicModel {
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

    this.threshold = data.threshold;
    this.closeDate = data.closeDate;
    this.tokenConversionRate = data.tokenConversionRate;
    this.status = data.status || Pool.PENDING;
    this.address;
  }

  toFeathers() {
    return {
      id: this.id,
      threshold: this.threshold,
      closeDate: this.closeDate,
      tokenConversionRate: this.tokenConversionRate,
      status: this.status
    };
  }

  get isActive() {
    return this.status === Pool.ACTIVE;
  }

  /**
   * Save the campaign to feathers and blockchain if necessary
   *
   * @param afterCreate Callback function once a transaction is created
   * @param afterMined  Callback function once the transaction is mined and feathers updated
   */
  save(afterCreate, afterMined) {
    PoolService.save(this, this.owner.address, afterCreate, afterMined);
  }

  /**
   * Cancel the campaign in feathers and blockchain
   *
   * @param from        Either the owner or reviewer. Whoever is canceling the campaign
   * @param afterCreate Callback function once a transaction is created
   * @param afterMined  Callback function once the transaction is mined and feathers updated
   */
  cancel(from, afterCreate, afterMined) {
    PoolService.cancel(this, from, afterCreate, afterMined);
  }

  get address() {
    return this.myAddress;
  }

  set address(value) {
    this.checkType(value, ['string'], 'address');
    this.myAddress = value;
  }

  get status() {
    return this.myStatus;
  }

  set status(value) {
    this.checkValue(value, [Pool.PENDING, Pool.ACTIVE, Pool.CANCELED], 'status');
    this.myStatus = value;
    if (value === Pool.PENDING) this.myOrder = 1;
    else if (value === Pool.ACTIVE) this.myOrder = 2;
    else if (value === Pool.CANCELED) this.myOrder = 3;
    else this.myOrder = 4;
  }

  get threshold() {
    return this.myThreshold;
  }

  set threshold(value) {
    this.checkType(value, ['number'], 'threshold');
    this.myThreshold = value;
  }

  get closeDate() {
    return this.myCloseDate;
  }

  set closeDate(value) {
    this.checkType(value, ['number'], 'closeDate');
    this.myCloseDate = value;
  }

  get tokenConversionRate() {
    return this.myTokenConversionRate;
  }

  set tokenConversionRate(value) {
    this.checkType(value, ['number'], 'tokenConversionRate');
    this.myTokenConversionRate = value;
  }

}

export default Pool;
