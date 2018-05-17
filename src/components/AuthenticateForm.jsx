import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'formsy-react-components';

import LoaderButton from '../components/LoaderButton';

/**
 * Simple form with only a button for authenticating user based on signature.
 * Any children will be displayed after the unlock button
 */
class AuthenticateForm extends Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  submit(model) {
    this.props.submit();
  }

  render() {
    const { error, label, buttonText, authenticating } = this.props;

    return (
      <span id="account-view">
        {error && <div className="alert alert-danger">{error}</div>}

        <Form
          className="unlock-wallet-form"
          onSubmit={this.submit}
          layout="vertical"
        >
          <LoaderButton
            className="btn btn-success"
            formNoValidate
            type="submit"
            disabled={authenticating}
            isLoading={authenticating}
            loadingText="Authenticating your wallet..."
          >
            <i className="fa fa-unlock" />
            {buttonText}
          </LoaderButton>

          {this.props.children}
        </Form>
      </span>
    );
  }
}

export default AuthenticateForm;

AuthenticateForm.propTypes = {
  submit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  authenticating: PropTypes.bool.isRequired,
  children: PropTypes.element,
};

AuthenticateForm.defaultProps = {
  error: '',
  children: <span />,
};
