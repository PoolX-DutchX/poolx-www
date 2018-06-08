import React, { Component, createContext } from 'react';
import { history } from '../lib/helpers';
import PropTypes from 'prop-types';
import { feathersClient } from '../lib/feathersClient';

import GivethWallet from '../lib/blockchain/GivethWallet';
import getWeb3 from '../lib/blockchain/getWeb3';

import ErrorPopup from '../components/ErrorPopup';

// models
import User from '../models/User';

const Context = createContext();
const { Provider, Consumer } = Context;
export { Consumer };

// TO DO: This is the minimum transaction view required to:
// create a DAC / Campaign / Milestone / Profile
React.minimumWalletBalance = 0.02;

React.whitelist = {};

// Fetch whitelist
feathersClient
  .service('/whitelist')
  .find()
  .then(whitelist => {
    React.whitelist = whitelist;
  });

/**
 * This container holds the application and its routes.
 * It is also responsible for loading application persistent data.
 * As long as this component is mounted, the data will be persistent,
 * if passed as props to children.
 */
class UserProvider extends Component {
  constructor() {
    super();

    this.state = {
      web3: undefined,
      currentUser: undefined,
      userAddress: undefined,
      isLoading: true,
      hasError: false,
      wallet: undefined,
      walletLocked: true,
    };

    this.handleWalletChange = this.handleWalletChange.bind(this);
    this.onSignOut = this.onSignOut.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.unlockWallet = this.unlockWallet.bind(this);
    this.lockWallet = this.lockWallet.bind(this);
    this.walletUnlocked = this.walletUnlocked.bind(this);
    this.hideUnlockWalletModal = this.hideUnlockWalletModal.bind(this);

    // Making unlock wallet global
    React.unlockWallet = this.unlockWallet;
  }

  async componentWillMount() {
    try {
      const token = await feathersClient.passport.getJWT();
      if (token) {
        const tokenPayload = await feathersClient.passport.verifyJWT(token);
        console.log('tokenPayload', tokenPayload);
        const { userId } = tokenPayload;
        const user = userId && await UserProvider.getUserProfile(userId);

        if (!user) {
          feathersClient.logout();
          this.setState({ isLoading: false, hasError: false });
        } else {
          feathersClient.authenticate();
          console.log('user', user);
          console.log('user', new User(user));
          this.setState({ isLoading: false, hasError: false, currentUser: new User(user)});
        }
      } else {
        this.setState({ isLoading: false, hasError: false });
      }

    }  catch (err) {
      console.log('err', err);
      this.setState({ isLoading: false, hasError: false });
      history.push(`/`);
    }
  }

  async getUserAddress() {
    console.log('getting user address');
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];
      this.setState({
        userAddress
      });
    } catch(err) {
      console.log('err', err);
      // ToDo : flash oops something went wrong, check metamask
    }
  }

  static getUserProfile(userId) {
    console.log('getting user profile', userId);
    return feathersClient
      .service('/users')
      .get(userId)
      .then(user => user)
      .catch(err => {
        console.log('err on getUserProfile', err);
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

  handleWalletChange(wallet) {
    wallet.cacheKeystore();
    const address = wallet.getAddresses()[0];

    getWeb3().then(web3 => web3.setWallet(wallet));

    UserProvider.getUserProfile(address).then(user =>
      this.setState({
        wallet,
        currentUser: new User(user),
      }),
    );
  }

  unlockWallet(redirectAfter) {
    this.setState({ showUnlockWalletModal: true, redirectAfter });
  }

  lockWallet() {
    React.swal({
      title: 'Lock your wallet?',
      text: 'You will be redirected to the home page. Any changes you have made will be lost.',
      icon: 'warning',
      dangerMode: true,
      buttons: ['Cancel', 'Yes, lock wallet!'],
    }).then(isConfirmed => {
      if (isConfirmed) {
        this.state.wallet.lock();
        this.setState({ walletLocked: true });
      }
    });
  }

  walletUnlocked() {
    this.hideUnlockWalletModal();
    React.toast.success(
      <p>
        Your wallet has been unlocked.<br />
        Note that your wallet will <strong>auto-lock</strong> upon page refresh.
      </p>,
    );
    this.setState({ walletLocked: false });
  }

  hideUnlockWalletModal() {
    this.setState({ showUnlockWalletModal: false, redirectAfter: undefined });
  }

  render() {
    const {
      currentUser,
      userAddress,
      wallet,
      web3,
      isLoading,
      hasError,
      showUnlockWalletModal,
      redirectAfter,
      walletLocked,
    } = this.state;

    const {
      onSignIn,
      onSignOut,
      walletUnlocked,
      hideUnlockWalletModal,
      handleWalletChange,
      lockWallet,
    } = this;

    return (
      <Provider
        value={{
          state: {
            currentUser,
            userAddress,
            wallet,
            web3,
            isLoading,
            hasError,
            showUnlockWalletModal,
            redirectAfter,
            walletLocked,
          },
          actions: {
            onSignIn,
            onSignOut,
            walletUnlocked,
            lockWallet,
            hideUnlockWalletModal,
            handleWalletChange,
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
