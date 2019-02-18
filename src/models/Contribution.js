import BasicModel from './BasicModel'
import ContributionService from '../services/Contribution'

import {
  PENDING_CONFIRMATION,
  CONFIRMED,
  TOKENS_AVAILABLE,
  PENDING_CLAIM_TOKENS,
  TOKENS_CLAIMED,
  REFUND_AVAILABLE,
  PENDING_REFUND,
  REFUND_RECEIVED,
  PAUSED,
} from '../constants'

class Contribution extends BasicModel {
  static get PENDING_CONFIRMATION() {
    return PENDING_CONFIRMATION
  }
  static get CONFIRMED() {
    return CONFIRMED
  }
  static get TOKENS_AVAILABLE() {
    return TOKENS_AVAILABLE
  }
  static get PENDING_CLAIM_TOKENS() {
    return PENDING_CLAIM_TOKENS
  }
  static get TOKENS_CLAIMED() {
    return TOKENS_CLAIMED
  }
  static get REFUND_AVAILABLE() {
    return REFUND_AVAILABLE
  }
  static get PENDING_REFUND() {
    return PENDING_REFUND
  }
  static get REFUND_RECEIVED() {
    return REFUND_RECEIVED
  }
  static get PAUSED() {
    return PAUSED
  }

  constructor(data) {
    super(data)
    this.pool = data.pool || ''
    this.poolAddress = data.poolAddress || ''
    this.amount = data.amount || 0 // in Ether
    this.status = data.status || Contribution.PENDING_CONFIRMATION
    this.tokenAmountClaimed = data.tokenAmountClaimed || 0
    this.owner = data.owner || ''
    // ToDo: currency, ether by default for now
    // ToDo: network - or place in seperate DB ??
  }

  toFeathers() {
    return {
      id: this.id,
      pool: this.pool,
      poolAddress: this.poolAddress,
      amount: this.amount,
      status: this.status,
      owner: this.owner,
      ownerAddress: this.ownerAddress,
    }
  }

  /**
   * Cancel the campaign in feathers and blockchain
   *
   * @param from        Either the owner or reviewer. Whoever is canceling the campaign
   * @param afterCreate Callback function once a transaction is created
   * @param afterMined  Callback function once the transaction is mined and feathers updated
   */
  cancel(from, afterCreate, afterMined) {
    ContributionService.cancel(this, from, afterCreate, afterMined)
  }

  get status() {
    return this.myStatus
  }

  set status(value) {
    this.checkValue(
      value,
      [
        Contribution.PENDING_CONFIRMATION,
        Contribution.CONFIRMED,
        Contribution.TOKENS_AVAILABLE,
        Contribution.PENDING_CLAIM_TOKENS,
        Contribution.TOKENS_CLAIMED,
        Contribution.REFUND_AVAILABLE,
        Contribution.PENDING_REFUND,
        Contribution.REFUND_RECEIVED,
        Contribution.PAUSED,
      ],
      'status'
    )
    this.myStatus = value
    // if (value === Contribution.PENDING) this.myOrder = 1;
    // else if (value === Contribution.ACTIVE) this.myOrder = 2;
    // else if (value === Contribution.CANCELED) this.myOrder = 3;
    // else this.myOrder = 4;
  }

  get amount() {
    return this.myAmount
  }

  set amount(value) {
    this.checkType(value, ['number'], 'amount')
    this.myAmount = value
  }

  get tokenAmountClaimed() {
    return this.myTokenAmountClaimed
  }

  set tokenAmountClaimed(value) {
    this.checkType(value, ['number'], 'tokenAmountClaimed')
    this.myTokenAmountClaimed = value
  }

  get pool() {
    return this.myPool
  }

  set pool(value) {
    this.checkType(value, ['object', 'string'], 'pool')
    this.myPool = value
  }

  get poolAddress() {
    return this.myPoolAddress
  }

  set poolAddress(value) {
    this.checkType(value, ['string'], 'poolAddress')
    this.myPoolAddress = value
  }
}

export default Contribution
