import Model from './Model';

/**
 * The DApp User model
 *
 * @attribute address     Ethereum address of the user
 * @attribute avatar      URL to user avatar
 * @attribute commitTime
 * @attribute email       Email address of the user
 * @attribute giverId     Giver ID used for querying donations
 * @attribute linkedin    Link to the linkedin profile
 * @attribute name        Name of the user
 */
class User extends Model {
  constructor({ _id, name, email, wallets, avatar, linkedin }) {
    super();
    this.id = _id;
    this.name = name;
    this.email = email;
    this.wallets = wallets || [];
    this.avatar = avatar;
    this.linkedin = linkedin;
  }

  get id() {
    return this.myId;
  }

  set id(value) {
    this.checkType(value, ['undefined', 'string'], 'id');
    this.myId = value;
  }

  get wallets() {
    return this.myWallets;
  }

  set wallets(value) {
    this.checkType(value, ['object', 'array'], 'wallets');
    this.myWallets = value;
  }

  get avatar() {
    return this.myAvatar;
  }

  set avatar(value) {
    this.checkType(value, ['undefined', 'string'], 'avatar');
    this.myAvatar = value;
  }

  get commitTime() {
    return this.myCommitTime;
  }

  set commitTime(value) {
    this.checkType(value, ['undefined', 'string'], 'commitTime');
    this.myCommitTime = value;
  }

  get email() {
    return this.myEmail;
  }

  set email(value) {
    this.checkType(value, ['undefined', 'string'], 'email');
    this.myEmail = value;
  }

  get giverId() {
    return this.myGiverId;
  }

  set giverId(value) {
    this.checkType(value, ['undefined', 'string', 'number'], 'giverId');
    this.myGiverId = value;
  }

  get linkedin() {
    return this.myLinkedIn;
  }

  set linkedin(value) {
    this.checkType(value, ['undefined', 'string'], 'linkedin');
    this.myLinkedIn = value;
  }

  get name() {
    return this.myName;
  }

  set name(value) {
    this.checkType(value, ['undefined', 'string'], 'name');
    this.myName = value;
  }
}

export default User;
