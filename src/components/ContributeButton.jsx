/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { SkyLightStateless } from 'react-skylight';
import { utils } from 'web3';
import { MiniMeToken } from 'minimetoken';
import { Form, Input } from 'formsy-react-components';
import SelectFormsy from './SelectFormsy';

import getNetwork from '../lib/blockchain/getNetwork';
import { feathersClient } from '../lib/feathersClient';
import { confirmBlockchainTransaction } from '../lib/middleware';
import User from '../models/User';
import { displayTransactionError, getGasPrice } from '../lib/helpers';
import GivethWallet from '../lib/blockchain/GivethWallet';
import getWeb3 from '../lib/blockchain/getWeb3';
import LoaderButton from './LoaderButton';
import Contribution from '../models/Contribution';
import ContributionService from '../services/Contribution';

const felixPoolArtifact = require('../lib/blockchain/contracts/FelixPool.json');

const METAMASK = 'metamask';
const MY_ETHER_WALLET = 'myEtherWallet';
const MY_CRYPTO = 'myCrypto';

const paymentMethods = [
  {
    title: 'Metamask',
    value: METAMASK,
  },
  {
    title: 'MyEtherWallet',
    value: MY_ETHER_WALLET,
  },
  {
    title: 'MyCrypto',
    value: MY_CRYPTO,
  },
];

class ContributeButton extends React.Component {
  constructor() {
    super();

    this.state = {
      isSaving: false,
      formIsValid: false,
      amount: '',
      paymentMethod: '',
      modalVisible: false,
      // gasPrice: utils.toWei('4', 'gwei'),
      gasPrice: utils.toWei('10', 'gwei'),
    };

    this.submit = this.submit.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.contributeWithMetamask = this.contributeWithMetamask.bind(this);
  }

  async componentDidMount() {
    const { abi, bytecode } = felixPoolArtifact;
    const {model: { poolAddress }} = this.props;

    const web3 = await getWeb3();
    const contract = new web3.eth.Contract(abi, poolAddress);
    const deposit = contract.methods.deposit();

    const txData = deposit.encodeABI();
    const gasLimit = await deposit.estimateGas({
        from: '0x0000000000000000000000000000000000000000',
        value: 1,
      });

    this.setState({
      gasLimit,
      txData,
      myEtherWalletUrl: `https://www.myetherwallet.com/?to=${poolAddress.toUpperCase()}&gaslimit=${gasLimit}&data=${txData}`,
      myCryptoUrl: `https://www.mycrypto.com/?to=${poolAddress.toUpperCase()}&gasLimit=${gasLimit}&data=${txData}`,
    });
  }

  openDialog() {

    const { currentUser } = this.props;

    if (!currentUser) {
      React.swal({
        title: "You're almost there...",
        content: React.swal.msg(
          <p>
            Thanks for showing interest in this pool, however, you first need to sign up (or
            sign in). Also make sure to transfer some Ether to your wallet before contributing to a pool.<br />
          </p>,
        ),
        icon: 'info',
        buttons: ['Cancel', 'Sign up now!'],
      }).then(isConfirmed => {
        if (isConfirmed) this.props.history.push('/signup');
      });
      return;
    }

    this.refs.amountInput.resetValue();
    this.setState({
      modalVisible: true,
      amount: '',
      paymentMethod: '',
      formIsValid: false,
      isSaving: false,
    });
  }

  closeDialog() {
    this.setState({
      modalVisible: false,
      amount: '',
      paymentMethod: '',
      formIsValid: false,
    });
  }

  toggleFormValid(state) {
    this.setState({ formIsValid: state });
  }

  mapInputs({amount, paymentMethod}) {
    return { amount, paymentMethod};
  }

  submit(formData) {
    const { currentUser, model: { poolAddress } } = this.props;
    const { amount, paymentMethod } = formData;
    const contribution = new Contribution({ amount: utils.toWei(amount), poolAddress, owner: currentUser });

    this.setState({
      contribution,
      isSaving: true,
    });

    this.closeDialog();
    React.swal({
      className: 'swal-huge',
      title: "You're almost there...",
      content: React.swal.msg(
        <div>
          <div className="alert alert-danger">
            <b style={{ color: '#e4000b' }}>
              NOTE: For Poolbase Beta, you must choose the "Rinkeby" network to send the tx
            </b>
          </div>
          <p>Use the following data to make your transaction:</p>
          <div className="container alert alert-info text-left">
            <div className="row">
              <div className="col-sm-2">
                <b>to:</b>
              </div>
              <div className="col-sm-10" style={{ wordWrap: 'break-word' }}>
                {contribution.poolAddress}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <b>value:</b>
              </div>
              <div className="col-sm-10" style={{ wordWrap: 'break-word' }}>
              {amount}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <b>gasLimit:</b>
              </div>
              <div className="col-sm-10" style={{ wordWrap: 'break-word' }}>
                {this.state.gasLimit}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <b>data:</b>
              </div>
              <div className="col-sm-10" style={{ wordWrap: 'break-word' }}>
                {this.state.txData}
              </div>
            </div>
          </div>
        </div>
      ),
      icon: 'info',
      buttons: ['Got it!'],
    });

    if (paymentMethod === METAMASK) {
      this.contributeWithMetamask(contribution);
    } else if (paymentMethod === MY_ETHER_WALLET) {
        window.open(`${this.state.myEtherWalletUrl}&value=${amount}#send-transaction`, '_blank');
    } else if (paymentMethod === MY_CRYPTO){
      window.open(`${this.state.myCryptoUrl}&value=${amount}#send-transaction`, '_blank');
    }


  }

  contributeWithMetamask(contribution) {
    const afterMined = url => {
      console.log('url', url);
      if (url) {
        const msg = (
          <p>
            Your Contribution has been created!<br />
            <a href={url} target="_blank" rel="noopener noreferrer">
              View transaction
            </a>
          </p>
        );
        React.toast.success(msg);
        // history.push(`/pools/${this.state.pool.address}`);
      }
    };

    const afterCreate = url => {
      const msg = (
        <p>
          Your Contribution is pending....<br />
          <a href={url} target="_blank" rel="noopener noreferrer">
            View transaction
          </a>
        </p>
      );
      React.toast.info(msg);
      // history.push('/my-pools');
    };

    contribution.save(afterCreate, afterMined);
  }

  render() {
    const { type, model } = this.props;
    const { amount, gasPrice, formIsValid, isSaving, paymentMethod, gasLimit, txData } = this.state;
    const style = {
      display: 'inline-block',
    };

    return (
      <span style={style}>
        <button className="btn btn-success" onClick={this.openDialog}>
          Contribute
        </button>
        <SkyLightStateless
          isVisible={this.state.modalVisible}
          onCloseClicked={() => this.closeDialog()}
          onOverlayClicked={() => this.closeDialog()}
          title={`Contribute to this ${type}!`}
        >
          <strong>
            Send Ether to contribute to <em>{model.title}</em>
          </strong>

          <Form
            onSubmit={this.submit}
            mapping={inputs => this.mapInputs(inputs)}
            onValid={() => this.toggleFormValid(true)}
            onInvalid={() => this.toggleFormValid(false)}
            layout="vertical"
          >
            <div className="form-group">
              <Input
                name="amount"
                ref="amountInput"
                id="amount-input"
                label="How much Ξ do you want to add to this pool?"
                type="number"
                value={amount}
                onChange={(name, amount) => {
                  this.setState({amount})
                }}
                placeholder="1"
                validations={{
                  // lessThan: wallet.getTokenBalance() - 0.5,
                  greaterThan: 0.009,
                }}
                validationErrors={{
                  greaterThan: 'Minimum value must be at least Ξ0.01',
                  // lessThan:
                  // 'This donation exceeds your Giveth wallet balance. Please top up your wallet or donate with MyEtherWallet.',
                }}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <SelectFormsy
                name="paymentMethod"
                id="payment-method-select"
                label="Select how you want to contribute"
                helpText=""
                value={paymentMethod}
                cta="--- Select how you want to contribute ---"
                options={paymentMethods}
                required
              />
            </div>

            <LoaderButton
              className="btn btn-success"
              formNoValidate
              type="submit"
              disabled={isSaving || !formIsValid}
              isLoading={isSaving}
              loadingText="Saving..."
            >
              Contribute
            </LoaderButton>
          </Form>
        </SkyLightStateless>
      </span>
    );
  }
}

ContributeButton.propTypes = {
  type: PropTypes.string.isRequired,
  model: PropTypes.shape({
    adminId: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
  communityUrl: PropTypes.string,
};

ContributeButton.defaultProps = {
  communityUrl: '',
  currentUser: undefined,
};

export default ContributeButton;
