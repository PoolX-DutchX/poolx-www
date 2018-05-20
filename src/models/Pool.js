import BasicModel from './BasicModel';
import PoolService from '../services/Pool';
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

    // this.threshold = data.threshold || 0;
    // this.closeDate = data.closeDate || 0;
    // this.tokenConversionRate = data.tokenConversionRate || 0;
    // this.status = data.status || Pool.PENDING;
    //
    // this.title: this.title;
    // this.description: this.description;
    // this.tokenUrl: this.tokenUrl;
    // this.tokenName: this.tokenName;
    // this.tokenSymbol: this.tokenSymbo;
  }

  toFeathers() {
    return {
      id: this.id,
      threshold: this.threshold,
      closeDate: this.closeDate,
      tokenConversionRate: this.tokenConversionRate,
      status: this.status,
      address: this.address,
      txHash: this.txHash,
      image: this.image,
      title: this.title,
      description: this.description,
      tokenUrl: this.tokenUrl,
      tokenName: this.tokenName,
      tokenSymbol: this.tokenSymbol
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

  get tokenName() {
    return this.myTokenName;
  }

  set tokenName(value) {
    this.checkType(value, ['string'], 'tokenName');
    this.myTokenName = value;
  }

  get tokenSymbol() {
    return this.myTokenSymbol;
  }

  set tokenSymbol(value) {
    this.checkType(value, ['string'], 'tokenSymbol');
    this.myTokenSymbol = value;
  }

  get tokenUrl() {
    return this.myTokenUrl;
  }

  set tokenUrl(value) {
    this.checkType(value, ['string'], 'tokenUrl');
    this.myTokenUrl = value;
  }

  // get contractAddress() {
  //   return this.myContractAddress;
  // }
  //
  // set contractAddress(value) {
  //   this.checkType(value, ['string', 'undefined'], 'contractAddress');
  //   this.myContractAddress = value;
  // }
  //
  // get txHash() {
  //   return this.myTxHash;
  // }
  //
  // set txHash(value) {
  //   this.checkType(value, ['string', 'undefined'], 'txHash');
  //   this.myTxHash = value;
  // }

}

export default Pool;
