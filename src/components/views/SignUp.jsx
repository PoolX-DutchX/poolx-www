import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'formsy-react-components';

import { authenticateUser } from '../../lib/helpers';
import { feathersClient } from '../../lib/feathersClient';
import LoaderButton from '../LoaderButton';

/* global window */
/**
 * The SignUp view mapped to /sign-up
 */

class SignUp extends Component {
  constructor() {
    super();

    this.state = {
      isSaving: false,
      error: undefined,
      formIsValid: false,
      email: '',
      password: '',
      confirmedPassword: '',
    };

    this.submit = this.submit.bind(this);
    this.createAccount = this.createAccount.bind(this);
  }

  submit({ email, password }) {
    console.log('email', email);
    console.log('password', password);
    this.setState(
      {
        isSaving: true,
        error: undefined,
        email,
        password,
      },
      this.createAccount,
    );
  }

  createAccount() {
    const { email, password } = this.state;
    feathersClient
      .service('/users')
      .create({ email, password })
      .then(user => {
        return authenticateUser({ email, password });
      })
      .then(token => {
        return feathersClient.passport.verifyJWT(token);
      })
      .then(tokenPayload => {
        const { userId } = tokenPayload;
        this.setState({ isSaving: false });
        this.props.onSignIn(userId);
        React.toast.success(
          <p>
            Welcome to Poolbase! <br />
          </p>,
        );
        this.props.history.goBack();
      })
      .catch(err => {
        console.log('createAccount err', err);
        this.setState({
          isSaving: false,
          error:
            'There has been a problem creating your account. Please refresh the page and try again.',
        });
      });
  }

  toggleFormValid(state) {
    this.setState({ formIsValid: state });
  }

  render() {
    const { error, formIsValid, isSaving } = this.state;

    return (
      <div id="account-view" className="container-fluid page-layout">
        <div className="row">
          <div className="col-md-8 m-auto">
            <div>
              <div className="card">
                <center>
                  <div>
                    <h1>SignUp</h1>
                    <p>Please provide a username and password to create your account</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <Form
                      className="sign-up-form"
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
                          autoComplete="new-password"
                          id="password-input"
                          label="New Password"
                          type="password"
                          value={this.state.password}
                          placeholder="Choose a password"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <Input
                          name="password2"
                          id="password2-input"
                          autoComplete="new-password"
                          label="Confirm Wallet Password"
                          type="password"
                          value={this.state.confirmedPassword}
                          validations="equalsField:password"
                          validationErrors={{
                            equalsField: 'Passwords do not match.',
                          }}
                          placeholder="Retype password"
                          required
                        />
                      </div>

                      <LoaderButton
                        className="btn btn-success btn-block"
                        formNoValidate
                        type="submit"
                        disabled={isSaving || !formIsValid}
                        isLoading={isSaving}
                        loadingText="Creating your account..."
                      >
                        Sign up
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

SignUp.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default SignUp;
