import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';

import { history } from '../lib/helpers';
import { feathersClient } from '../lib/feathersClient';
// import getWeb3 from '../lib/blockchain/getWeb3';
import ErrorPopup from '../components/ErrorPopup';

// models
import User from '../models/User';

const Context = createContext();
const { Provider, Consumer } = Context;
export { Consumer };

/**
 * This container will hold the application and its routes.
 * It is also responsible for loading application persistent data.
 * As long as this component is mounted, the data will be persistent,
 * if passed as props to children.
 */
class UserProvider extends Component {
  constructor() {
    super();

    this.state = {
      currentUser: undefined,
      isLoading: true,
      hasError: false,
    };

    this.onSignOut = this.onSignOut.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  async componentDidMount() {
    try {
      const token = await feathersClient.passport.getJWT();
      if (token) {
        const tokenPayload = await feathersClient.passport.verifyJWT(token);
        const { userId } = tokenPayload;

        if (userId) {
          await feathersClient.authenticate();
          const user = await UserProvider.getUserProfile(userId);
          this.setState({ isLoading: false, hasError: false, currentUser: new User(user) });
        } else {
          feathersClient.logout();
          this.setState({ isLoading: false, hasError: false });
        }
      } else {
        this.setState({ isLoading: false, hasError: false });
      }
    } catch (err) {
      console.log('Passport err:', err);
      this.setState({ isLoading: false, hasError: false });
      history.push(`/`);
    }
  }

  // async getMetamaskAddress() {
  //   try {
  //     const web3 = await getWeb3();
  //     const accounts = await web3.eth.getAccounts();
  //     const userAddress = accounts[0];
  //     this.setState({
  //       userAddress
  //     });
  //   } catch(err) {
  //     console.log('err', err);
  //     // ToDo : flash oops something went wrong, check metamask
  //   }
  // }

  static getUserProfile(userId) {
    console.log('getting user profile', userId);
    return feathersClient
      .service('/users')
      .get(userId)
      .then(user => user)
      .catch(err => {
        console.log('err on getUserProfile', err);
        React.toast.error(err.message);
        ErrorPopup(
          'Something went wrong with getting user profile. Please try again after refresh.',
          err,
        );
      });
  }

  onSignOut() {
    feathersClient.logout();
    this.setState({ currentUser: undefined });
    history.push('/');
  }

  async onSignIn(userId) {
    console.log('triggering onSignin');
    const user = await UserProvider.getUserProfile(userId);
    this.setState({ currentUser: new User(user) });
  }

  render() {
    const { currentUser, isLoading, hasError } = this.state;

    const { onSignIn, onSignOut } = this;

    return (
      <Provider
        value={{
          state: {
            currentUser,
            isLoading,
            hasError,
          },
          actions: {
            onSignIn,
            onSignOut,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

UserProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default UserProvider;
