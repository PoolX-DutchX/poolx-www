import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import { Form, Input } from 'formsy-react-components';

import { feathersClient } from '../../lib/feathersClient';
import Loader from '../Loader';
import LoaderButton from '../LoaderButton';
import AuthenticateForm from '../AuthenticateForm';
import { authenticateUser } from '../../lib/helpers';
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
      isSigningIn: false,
      formIsValid: false,
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

  submit({ email, password }) {
    console.log('email', email);
    console.log('password', password);

    this.setState(
      {
        isSigningIn: true,
        error: undefined,
      },
      () => {
        authenticateUser({ email, password })
          .then(token => {
            return feathersClient.passport.verifyJWT(token);
          })
          .then(tokenPayload => {
            const {userId} = tokenPayload;
            this.setState({isSigningIn: false});
            this.props.onSignIn(userId);
            React.toast.success(
              <p>
                Welcome back! <br />
              </p>,
            );
            this.props.history.goBack();
          })
          .catch(err => {
            this.setState({
              error: 'There was a problem signing into your account. Please refresh the page and try again.',
              isSigningIn: false,
            });
          });
      }
    );
  }

  toggleFormValid(state) {
    this.setState({ formIsValid: state });
  }

  render() {
    const { error, isLoading, isSigningIn, formIsValid } = this.state;

    if (isLoading) {
      return <Loader className="fixed" />;
    }

    return (
      <div id="account-view" className="container-fluid page-layout">
        <div className="row">
          <div className="col-md-8 m-auto">
            <div>
              <div className="card">
                <center>
                  <div>
                    <h1>SignIn</h1>
                    <p>
                      Please provide a username and password to sign in
                    </p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <Form
                      className="sign-in-form"
                      onSubmit={this.submit}
                      onValid={() => this.toggleFormValid(true)}
                      onInvalid={() => this.toggleFormValid(false)}
                      layout="vertical"
                    >
                      <div className="form-group">
                        <Input
                          name="email"
                          id="email-input"
                          label="Email"
                          type="text"
                          value={this.state.email}
                          placeholder="Your email"
                          required
                          autoFocus
                        />
                      </div>
                      <div className="form-group">
                        <Input
                          name="password"
                          autoComplete="password"
                          id="password-input"
                          label="Password"
                          type="password"
                          value={this.state.password}
                          placeholder="Your password"
                          required
                        />
                      </div>
                      <LoaderButton
                        className="btn btn-success btn-block"
                        formNoValidate
                        type="submit"
                        disabled={isSigningIn || !formIsValid}
                        isLoading={isSigningIn}
                        loadingText="Signing you in..."
                      >
                        Sign in
                      </LoaderButton>
                    </Form>
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
