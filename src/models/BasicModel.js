import Model from './Model';

/**
 * The Pool and Contribution base model containing basic common interface
 */
class BasicModel extends Model {
  /**
   * Compares two campaigns
   *
   * @param a First campaign
   * @param b Second campaign
   *
   * @return 1  if a > b
   *         -1 if a < b
   *         0  if a = b
   */
  static compare(a, b) {
    if (a.myOrder > b.myOrder) return 1;
    if (a.myOrder < b.myOrder) return -1;
    return 0;
  }

  constructor({
    _id,
    owner,
    ownerAddress,
    transactions,
    createdAt,
  }) {
    super();

    this.id = _id;
    this.owner = owner;
    this.ownerAddress = ownerAddress;
    this.transactions = transactions || [];
    this.createdAt = createdAt;
    this.myOrder = -1;
  }

  toFeathers() {
    return {
      ownerAddress: this.ownerAddress,
    }
  }

  get id() {
    return this.myId;
  }

  set id(value) {
    this.checkType(value, ['undefined', 'string'], 'id');
    this.myId = value;
  }

  get owner() {
    return this.myOwner;
  }

  set owner(value) {
    this.checkType(value, ['undefined', 'object'], 'owner');
    this.myOwner = value;
  }

  get ownerAddress() {
    return this.myOwnerAddress;
  }

  set ownerAddress(value) {
    this.checkType(value, ['undefined', 'string'], 'ownerAddress');
    this.myOwnerAddress = value;
  }

  get transactions() {
    return this.myTransactions;
  }

  set transactions(value) {
    this.checkType(value, ['object', 'array'], 'transactions');
    this.myTransactions = value;
  }

  get createdAt() {
    return this.myCreatedAt;
  }

  set createdAt(value) {
    this.checkType(value, ['undefined','string'], 'createdAt');
    this.myCreatedAt = value;
  }

}

export default BasicModel;
