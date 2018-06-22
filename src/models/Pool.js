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

  static get OPEN() {
    return 'Open';
  }
  static get ACTIVE() {
    return 'Active';
  }
  static get CURRENCY_ETHER() {
    return 'ether';
  }
  static get CURRENCY_TOKEN() {
    return 'token';
  }

  constructor(data) {
    super(data);
    this.wallet = data.wallet || '';
    this.cap = data.cap || '';
    this.totalInvested = data.totalInvested || '';
    this.minContribution = data.minContribution || '';
    this.maxContribution = data.maxContribution || '';
    this.fee = data.fee || '0.0';
    this.feePayoutCurrency = data.feePayoutCurrency || Pool.CURRENCY_ETHER;
    this.adminAddresses = data.adminAddresses || [];
    this.destinationAddress = data.destinationAddress || '';
    this.destinationData = data.destinationData || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.status = data.status || Pool.PENDING;
    this.address = data.address || '';
  }

  toFeathers() {
    return {
      id: this.id,
      wallet: this.wallet,
      cap: this.cap,
      totalInvested: this.totalInvested,
      minContribution: this.minContribution,
      maxContribution: this.maxContribution,
      fee: this.fee,
      feePayoutCurrency: this.feePayoutCurrency,
      adminAddresses: this.adminAddresses,
      destinationAddress: this.destinationAddress,
      destinationData: this.destinationData,
      name: this.name,
      description: this.description,
      status: this.status,
      txHash: this.txHash,
      address: this.address,
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
    this.checkValue(value, [Pool.PENDING, Pool.OPEN, Pool.ACTIVE, Pool.CANCELED], 'status');
    this.myStatus = value;
    if (value === Pool.PENDING) this.myOrder = 1;
    else if (value === Pool.OPEN) this.myOrder = 2;
    else if (value === Pool.ACTIVE) this.myOrder = 3;
    else if (value === Pool.CANCELED) this.myOrder = 4;
    else this.myOrder = 5;
  }

  get wallet() {
    return this.myWallet;
  }

  set wallet(value) {
    this.checkType(value, ['undefined', 'string'], 'wallet');
    this.myWallet = value;
  }

  get address() {
    return this.myAddress;
  }

  set address(value) {
    this.checkType(value, ['undefined', 'string'], 'address');
    this.myAddress = value;
  }

  get cap() {
    return this.myCap;
  }

  set cap(value) {
    console.log('value', value);
    this.checkType(value, ['undefined','string'], 'cap');
    this.myCap = value;
  }

  get totalInvested() {
    return this.myTotalInvested;
  }

  set totalInvested(value) {
    console.log('value', value);
    this.checkType(value, ['undefined','string'], 'totalInvested');
    this.myTotalInvested = value;
  }

  get minContribution() {
    return this.myMinContribution;
  }

  set minContribution(value) {
    this.checkType(value, ['undefined','string'], 'minContribution');
    this.myMinContribution = value;
  }

  get maxContribution() {
    return this.myMaxContribution;
  }

  set maxContribution(value) {
    this.checkType(value, ['undefined','string'], 'maxContribution');
    this.myMaxContribution = value;
  }

  get fee() {
    return this.myFee;
  }

  set fee(value) {
    this.checkType(value, ['string'], 'fee');
    this.myFee = value;
  }

  get feePayoutCurrency() {
    return this.myFeePayoutCurrency;
  }

  set feePayoutCurrency(value) {
    this.checkValue(value, [Pool.CURRENCY_ETHER, Pool.CURRENCY_TOKEN], 'feePayoutCurrency');
    this.myFeePayoutCurrency = value;
  }

  get adminAddresses() {
    return this.myAdminAddresses;
  }

  set adminAddresses(value) {
    this.checkType(value, ['object', 'array'], 'adminAddresses');
    this.myAdminAddresses = value;
  }

  get destinationAddress() {
    return this.myDestinationAddress;
  }

  set destinationAddress(value) {
    this.checkType(value, ['undefined', 'string'], 'destinationAddress');
    this.myDestinationAddress = value;
  }

  get destinationData() {
    return this.myDestinationData;
  }

  set destinationData(value) {
    this.checkType(value, ['undefined', 'string'], 'destinationData');
    this.myDestinationData = value;
  }
}

export default Pool;
