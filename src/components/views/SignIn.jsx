import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

import { feathersClient } from '../../lib/feathersClient';
import Loader from '../Loader';
import AuthenticateForm from '../AuthenticateForm';
import { authenticate, authenticateAddress } from '../../lib/helpers';
import GivethWallet from '../../lib/blockchain/GivethWallet';

/* global window */
/**
 * The SignIn view mapped to /sign-in
 */
class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      error: undefined,
      address: undefined,
      isSigninIn: false,
    };

    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.handleProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleProps(nextProps);
  }

  handleProps(props) {
    // if (!props.cachedWallet) {
    //   this.props.history.push('/change-account');
    // } else if (props.wallet && (!this.state.address || props.wallet !== this.props.wallet)) {
      this.setState(
        {
          address: props.userAddress,
        },
        () => this.fetchUserProfile(),
      );
    // }
  }

  fetchUserProfile() {
    feathersClient
      .service('users')
      .get(this.state.address)
      .then(resp => {
        this.setState(
          Object.assign({}, resp, {
            isLoading: false,
          }),
        );
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
      });
  }

  submit() {
    this.setState(
      {
        isSigninIn: true,
        error: undefined,
      },
      () => {
        function loadWallet() {
          authenticateAddress(this.state.address)
            .then(token => {
              console.log('token', token);
              this.props.onSignIn();
              return feathersClient.passport.verifyJWT(token);
            })
            .then(() => {
              React.toast.success(
                <p>
                  Welcome back! <br />
                </p>,
              );
              this.props.history.goBack();
            })
            .catch(err => {
              this.setState({
                error:
                  err.type && err.type === 'FeathersError'
                    ? 'authentication error'
                    : 'Error authenticating account.',
                isSigninIn: false,
              });
            });
        }

        // web3 blocks all rendering, so we need to request an animation frame
        window.requestAnimationFrame(loadWallet.bind(this));
      }
    );
  }

  render() {
    const { avatar, name, address, error, isLoading, isSigninIn } = this.state;

    if (isLoading) {
      return <Loader className="fixed" />;
    }

    console.log('avatar', avatar);
    console.log('name', name);
    console.log('address', address);

    return (
      <div id="account-view" className="container-fluid page-layout">
        <div className="row">
          <div className="col-md-8 m-auto">
            <div>
              <div className="card">
                <center>
                  {avatar && <Avatar size={100} src={avatar} round />}

                  {name && (
                    <h1>
                      Welcome back<br />
                      <strong>{name}!</strong>
                    </h1>
                  )}
                  {name && <p className="small">Your address: {address}</p>}

                  {address &&
                    !name && (
                      <div>
                        <h1>Welcome back</h1>
                        <strong>{address}</strong>
                      </div>
                    )}

                  <div className="spacer-top">
                    <AuthenticateForm
                      submit={this.submit}
                      label="Sign in by way of Metamask confirming your identity"
                      error={error}
                      buttonText="Sign in"
                      authenticating={isSigninIn}
                    >
                    </AuthenticateForm>
                  </div>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignIn.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  // userAddress: PropTypes.string.isRequired,
  onSignIn: PropTypes.func.isRequired,
};

export default SignIn;
