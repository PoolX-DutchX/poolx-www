import BasicModel from './BasicModel'
import PoolService from '../services/Pool'
import {
  PENDING_DEPLOYMENT,
  ACTIVE,
  PENDING_CLOSE_POOL,
  CLOSED,
  PENDING_TOKEN_BATCH,
  PAYOUT_ENABLED,
  PENDING_ENABLE_REFUNDS,
  REFUNDS_ENABLED,
  PAUSED,
} from '../constants'

class Pool extends BasicModel {
  static get PENDING_DEPLOYMENT() {
    return PENDING_DEPLOYMENT
  }
  static get ACTIVE() {
    return ACTIVE
  }
  static get PENDING_CLOSE_POOL() {
    return PENDING_CLOSE_POOL
  }
  static get CLOSED() {
    return CLOSED
  }
  static get PENDING_TOKEN_BATCH() {
    return PENDING_TOKEN_BATCH
  }
  static get PAYOUT_ENABLED() {
    return PAYOUT_ENABLED
  }
  static get PENDING_ENABLE_REFUNDS() {
    return PENDING_ENABLE_REFUNDS
  }
  static get REFUNDS_ENABLED() {
    return REFUNDS_ENABLED
  }
  static get PAUSED() {
    return PAUSED
  }
  static get CURRENCY_ETHER() {
    return 'ether'
  }
  static get CURRENCY_TOKEN() {
    return 'token'
  }

  constructor(data) {
    super(data)

    this.maxAllocation = data.maxAllocation || 0
    this.fee = data.fee || 0.0
    this.feePayoutCurrency = data.feePayoutCurrency || Pool.CURRENCY_ETHER
    this.lockPayoutAddress = data.lockPayoutAddress || false
    this.payoutAddress = data.payoutAddress || ''
    this.payoutTxData = data.payoutTxData || '' // in case payout wallet is a contract
    this.admins = data.admins || []
    this.adminPayoutAddress = data.adminPayoutAddress || ''

    this.name = data.name || ''
    this.description = data.description || ''
    this.status = data.status || Pool.PENDING_DEPLOYMENT
    this.minContribution = data.minContribution || 0
    this.maxContribution = data.maxContribution || 0
    this.whitelist = data.whitelist || []
    this.poolbaseFee = data.poolbaseFee || 0

    this.contractAddress = data.contractAddress || ''

    this.netInvested = data.netInvested || 0
    this.grossInvested = data.grossInvested || 0
    this.contributionCount = data.contributionCount || 0
    this.tokenBalance = data.tokenBalance || ''
  }

  toFeathers() {
    return {
      ...super.toFeathers(),
      maxAllocation: this.maxAllocation,
      fee: this.fee,
      feePayoutCurrency: this.feePayoutCurrency,
      lockPayoutAddress: this.lockPayoutAddress,
      payoutAddress: this.payoutAddress,
      payoutTxData: this.payoutTxData,
      adminPayoutAddress: this.adminPayoutAddress,
      admins: this.admins,
      poolbaseFee: this.poolbaseFee,
      name: this.name,
      description: this.description,
      minContribution: this.minContribution,
      maxContribution: this.maxContribution,
      whitelist: this.whitelist,
      //status, contractAddress set on backend
    }
  }

  get isActive() {
    return this.status === Pool.ACTIVE
  }

  /**
   * Save the campaign to feathers and blockchain if necessary
   *
   */
  save() {
    return PoolService.save(this)
  }
  //
  // /**
  //  * Cancel the campaign in feathers and blockchain
  //  *
  //  * @param from        Either the owner or reviewer. Whoever is canceling the campaign
  //  * @param afterCreate Callback function once a transaction is created
  //  * @param afterMined  Callback function once the transaction is mined and feathers updated
  //  */
  // cancel(from, afterCreate, afterMined) {
  //   PoolService.cancel(this, from, afterCreate, afterMined);
  // }

  get status() {
    return this.myStatus
  }

  set status(value) {
    this.checkValue(
      value,
      [
        Pool.PENDING_DEPLOYMENT,
        Pool.ACTIVE,
        Pool.PENDING_CLOSE_POOL,
        Pool.CLOSED,
        Pool.PENDING_TOKEN_BATCH,
        Pool.PAYOUT_ENABLED,
        Pool.PENDING_ENABLE_REFUNDS,
        Pool.REFUNDS_ENABLED,
        Pool.PAUSED,
      ],
      'status'
    )
    this.myStatus = value
    // if (value === Pool.PENDING) this.myOrder = 1;
    // else if (value === Pool.ACTIVE) this.myOrder = 2;
    // else if (value === Pool.CLOSED) this.myOrder = 3;
    // else if (value === Pool.CANCELED) this.myOrder = 4;
    // else this.myOrder = 5;
  }

  get contractAddress() {
    return this.myContractAddress
  }

  set contractAddress(value) {
    this.checkType(value, ['undefined', 'string'], 'contractAddress')
    this.myContractAddress = value
  }

  get name() {
    return this.myName
  }

  set name(value) {
    this.checkType(value, ['string'], 'name')
    this.myName = value
  }

  get description() {
    return this.myDescription
  }

  set description(value) {
    this.checkType(value, ['string'], 'description')
    this.myDescription = value
  }

  get maxAllocation() {
    return this.myMaxAllocation
  }

  set maxAllocation(value) {
    this.checkType(value, ['undefined', 'number'], 'maxAllocation')
    this.myMaxAllocation = value
  }

  get minContribution() {
    return this.myMinContribution
  }

  set minContribution(value) {
    this.checkType(value, ['undefined', 'number'], 'minContribution')
    this.myMinContribution = value
  }

  get maxContribution() {
    return this.myMaxContribution
  }

  set maxContribution(value) {
    this.checkType(value, ['undefined', 'number'], 'maxContribution')
    this.myMaxContribution = value
  }

  get contributionCount() {
    return this.myContributionCount
  }

  set contributionCount(value) {
    this.checkType(value, ['undefined', 'number'], 'contributionCount')
    this.myContributionCount = value
  }

  get tokenBalance() {
    return this.myTokenBalance
  }

  set tokenBalance(value) {
    this.checkType(value, ['undefined', 'string'], 'tokenBalance')
    this.myTokenBalance = value
  }

  get netInvested() {
    return this.myNetInvested
  }

  set netInvested(value) {
    this.checkType(value, ['undefined', 'number'], 'netInvested')
    this.myNetInvested = value
  }

  get grossInvested() {
    return this.myGrossInvested
  }

  set grossInvested(value) {
    this.checkType(value, ['undefined', 'number'], 'grossInvested')
    this.myGrossInvested = value
  }

  get fee() {
    return this.myFee
  }

  set fee(value) {
    this.checkType(value, ['undefined', 'number'], 'fee')
    this.myFee = value
  }

  get feePayoutCurrency() {
    return this.myFeePayoutCurrency
  }

  set feePayoutCurrency(value) {
    this.checkValue(
      value,
      [Pool.CURRENCY_ETHER, Pool.CURRENCY_TOKEN],
      'feePayoutCurrency'
    )
    this.myFeePayoutCurrency = value
  }

  get admins() {
    return this.myAdmins
  }

  set admins(value) {
    this.checkType(value, ['object', 'array'], 'admins')
    this.myAdmins = value
  }

  get adminPayoutAddress() {
    return this.myAdminPayoutAddress
  }

  set adminPayoutAddress(value) {
    this.checkType(value, ['undefined', 'string'], 'adminPayoutAddress')
    this.myAdminPayoutAddress = value
  }

  get lockPayoutAddress() {
    return this.myLockPayoutAddress
  }

  set lockPayoutAddress(value) {
    this.checkType(value, ['undefined', 'boolean'], 'lockPayoutAddress')
    this.myLockPayoutAddress = value
  }

  get payoutAddress() {
    return this.myPayoutAddress
  }

  set payoutAddress(value) {
    this.checkType(value, ['undefined', 'string'], 'payoutAddress')
    this.myPayoutAddress = value
  }

  get payoutTxData() {
    return this.myPayoutTxData
  }

  set payoutTxData(value) {
    this.checkType(value, ['undefined', 'string'], 'payoutTxData')
    this.myPayoutTxData = value
  }

  get poolbaseFee() {
    return this.myPoolXFee
  }

  set poolbaseFee(value) {
    this.checkType(value, ['undefined', 'number'], 'poolbaseFee')
    this.myPoolXFee = value
  }

  get whitelist() {
    return this.myWhitelist
  }

  set whitelist(value) {
    this.checkType(value, ['object', 'array'], 'whitelist')
    this.myWhitelist = value
  }
}

export default Pool
