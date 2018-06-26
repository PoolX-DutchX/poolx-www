import { feathersClient } from '../lib/feathersClient';
import User from '../models/User';

class UserService {
  /**
   * Get a User defined by ID
   *
   * @param id   ID of the user to be retrieved
   */
  static get(userId) {
    return new Promise((resolve, reject) => {
      feathersClient
        .service('users')
        .get(userId)
        .then(resp => {
          resolve(new User(resp.data));
        })
        .catch(reject);
    });
  }
}

export default UserService;
