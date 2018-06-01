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
import Investment from '../models/Investment';
import InvestmentService from '../services/Investment';

const paymentMethods = [
  {
    title: 'Metamask',
    value: 'metamask',
  },
  {
    title: 'MyEtherWallet',
    value: 'myEtherWallet',
  },
  {
    title: 'MyCrypto',
    value: 'myCrypto',
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

  componentDidMount() {
    // getNetwork().then(network => {
    //   const { liquidPledging } = network;
    //   const donate = liquidPledging.$contract.methods.donate(0, this.props.model.adminId);
    //   const data = donate.encodeABI();
    //   donate
    //     .estimateGas({
    //       from: '0x0000000000000000000000000000000000000000',
    //       value: 1,
    //     })
    //     .then(gasLimit =>
    //       this.setState({
    //         MEWurl: `https://www.myetherwallet.com/?to=${liquidPledging.$address.toUpperCase()}&gaslimit=${gasLimit}&data=${data}`,
    //       }),
    //     );
    //   this.setState({
    //     MEWurl: `https://www.myetherwallet.com/?to=${liquidPledging.$address.toUpperCase()}&gaslimit=550000&data=${data}`,
    //   });
    // });
  }

  openDialog() {
    this.refs.amountInput.resetValue();
    this.setState({
      modalVisible: true,
      amount: '',
      paymentMethod: '',
      formIsValid: false,
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

  mapInputs(inputs) {
    return {
      amount: utils.toWei(inputs.amount),
      paymentMethod: inputs.paymentMethod,
    };
  }

  submit(formData) {
    const { currentUser, model: { poolAddress } } = this.props;
    const { amount, paymentMethod } = formData;
    const investment = new Investment({ amount, poolAddress, owner: currentUser });
    this.setState({
      investment,
      isSaving: true,
    });

    this.contributeWithMetamask(investment);
    /*
      window.open(`${MEWurl}&value=${mewAmount}#send-transaction`, '_blank');
    */
    /*


    if (this.props.currentUser) {
      this.contributeWithMetamask(model);
      // this.setState({ isSaving: true });
    } else {
      React.swal({
        title: "You're almost there...",
        content: React.swal.msg(
          <p>
            It&#8217;s great to see that you want to donate, however, you first need to sign up (or
            sign in). Also make sure to transfer some Ether to your Giveth wallet before donating.<br />
            <br />
            Alternatively, you can donate with MyEtherWallet
          </p>,
        ),
        icon: 'info',
        buttons: ['Cancel', 'Sign up now!'],
      }).then(isConfirmed => {
        if (isConfirmed) this.props.history.push('/signup');
      });
    }

    */
  }

  contributeWithMyCrypto(model) {
    console.log(model);
    const { currentUser } = this.props;
    const { adminId } = this.props.model;
    const { gasPrice } = this.state;

    getNetwork().then(network => {
      const { givethBridge } = network;

      const to = givethBridge.$address;
      const value = model.amount;
      const gas = 25400;
      const data = currentUser.giverId
        ? givethBridge.$contract.methods.donate(currentUser.giverId, adminId).encodeABI()
        : givethBridge.$contract.methods.donateAndCreateGiver(currentUser.id, adminId).encodeABI();

      const query = `?to=${to}&value=${value}&gasLimit=${gas}&data=${data}&gasPrice=${gasPrice}`;
      this.setState({
        modalVisible: true,
      });

      React.swal({
        className: 'swal-huge',
        title: "You're almost there...",
        content: React.swal.msg(
          <div>
            <p>
              It&#8217;s great to see that you want to donate, however we don't support donating
              directly in the dapp yet. Use the followng information to donate via
              {/* <a target="_blank" href={`https://mycrypto.com/${query}#send-transaction`}> */}
              {/* MyCrypto */}
              {/* </a>, MyEtherWallet, etc. */}
              MyCrypto, MyEtherWallet, etc.
              {/* <a target="_blank" href={`https://myetherwallet.com/${query}#send-transaction`}> */}
              {/* MyEtherWallet, */}
              {/* </a>, etc. */}
            </p>
            <div className="alert alert-danger">
              <b style={{ color: '#e4000b' }}>NOTE: DO NOT SEND MAINNET ETHER.</b>
            </div>
            <div className="alert alert-danger">
              <b style={{ color: '#e4000b' }}>
                NOTE: You must choose the "Ropsten" network to send the tx
              </b>
            </div>
            <p>Use the following data to make your transaction:</p>
            <div className="container alert alert-info text-left">
              <div className="row">
                <div className="col-sm-2">
                  <b>to:</b>
                </div>
                <div className="col-sm-10" style={{ wordWrap: 'break-word' }}>
                  {to}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <b>value:</b>
                </div>
                <div className="col-sm-10" style={{ wordWrap: 'break-word' }}>
                  {value}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <b>gasLimit:</b>
                </div>
                <div className="col-sm-10" style={{ wordWrap: 'break-word' }}>
                  {gas}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <b>data:</b>
                </div>
                <div className="col-sm-10" style={{ wordWrap: 'break-word' }}>
                  {data}
                </div>
              </div>
            </div>
          </div>,
        ),
        icon: 'info',
        buttons: ['I changed my mind', 'Go to MyCrypto now!'],
      }).then(isConfirmed => {
        if (isConfirmed) window.open(`https://mycrypto.com/${query}#send-transaction`);
      });
    });
  }

  contributeWithMetamask(investment) {
    // console.log('typeof model.amount', typeof model.amount);
    // const amount = utils.toWei(model.amount);
    // const service = feathersClient.service('donations');
    const afterMined = url => {
      console.log('url', url);
      if (url) {
        const msg = (
          <p>
            Your Investment has been created!<br />
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
          Your Investment is pending....<br />
          <a href={url} target="_blank" rel="noopener noreferrer">
            View transaction
          </a>
        </p>
      );
      React.toast.info(msg);
      // history.push('/my-pools');
    };
    console.log('investment', investment);
    console.log('this.state', this.state);
    investment.save(afterCreate, afterMined);
    /*
    const donate = (etherScanUrl, txHash) => {
      const donation = {
        amount,
        txHash,
        status: 'pending',
      };

      if (this.props.type.toLowerCase() === 'dac') {
        Object.assign(donation, {
          delegate: this.props.model.adminId,
          delegateId: this.props.model.id,
          owner: this.props.currentUser.giverId || '0',
          ownerId: this.props.currentUser,
          ownerType: 'giver',
        });
      } else {
        Object.assign(donation, {
          owner: this.props.model.adminId,
          ownerId: this.props.model.id,
          ownerType: this.props.type.toLowerCase(),
        });
      }

      return service.create(donation).then(() => {
        this.setState({
          isSaving: false,
          amount: 10,
        });

        // For some reason (I suspect a rerender when donations are being fetched again)
        // the skylight dialog is sometimes gone and this throws error
        this.setState({ modalVisible: false });

        let msg;
        if (this.props.type === 'DAC') {
          msg = (
            <div>
              <p>
                Your donation is pending,
                <a href={`${etherScanUrl}tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                  {' '}
                  view the transaction here.
                </a>
                You have full control of this donation and
                <strong> can take it back at any time</strong>. You will also have a
                <strong> 3 day window</strong> to veto the use of these funds upon delegation by the
                DAC.
              </p>
              <p>
                Do make sure to
                <a href={this.props.communityUrl} target="_blank" rel="noopener noreferrer">
                  {' '}
                  join the Community
                </a>{' '}
                to follow the progress of this DAC.
              </p>
            </div>
          );
        } else {
          msg = (
            <div>
              <p>
                Your donation is pending,
                <a href={`${etherScanUrl}tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                  {' '}
                  view the transaction here.
                </a>
              </p>
              <p>
                Do make sure to
                <a href={this.props.communityUrl} target="_blank" rel="noopener noreferrer">
                  {' '}
                  join the Community
                </a>{' '}
                to follow the progress of this Campaign.
              </p>
            </div>
          );
        }

        React.swal({
          title: "You're awesome!",
          content: React.swal.msg(msg),
          icon: 'success',
        });
      });
    };
    */
    // let txHash;
    // let etherScanUrl;

    // Promise.all([getNetwork(), getWeb3()])
    //   .then(([network, web3]) => {
    //     const { tokenAddress, liquidPledgingAddress } = network;
    //     etherScanUrl = network.etherscan;
    //     const token = new MiniMeToken(web3, tokenAddress);
    //
    //     const giverId = this.props.currentUser.giverId || '0';
    //     const { adminId } = this.props.model;
    //
    //     const data = `0x${utils.padLeft(utils.toHex(giverId).substring(2), 16)}${utils.padLeft(
    //       utils.toHex(adminId).substring(2),
    //       16,
    //     )}`;
    //
    //     return token
    //       .approveAndCall(liquidPledgingAddress, amount, data, {
    //         from: this.props.currentUser.address,
    //         gas: 1000000,
    //       })
    //       .once('transactionHash', hash => {
    //         txHash = hash;
    //         // donate(etherScanUrl, txHash);
    //       });
    //   })
    //   .then(() => {
    //     React.toast.success(
    //       <p>
    //         Your donation has been confirmed!<br />
    //         <a href={`${etherScanUrl}tx/${txHash}`} target="_blank" rel="noopener noreferrer">
    //           View transaction
    //         </a>
    //       </p>,
    //     );
    //   })
    //   .catch(e => {
    //     console.error(e);
    //     displayTransactionError(txHash, etherScanUrl);
    //
    //     this.setState({ isSaving: false });
    //   });

    // Donate
    // confirmBlockchainTransaction(doDonate, () => this.setState({ isSaving: false }));
  }

  render() {
    const { type, model } = this.props;
    const { amount, gasPrice, formIsValid, isSaving, paymentMethod } = this.state;
    const style = {
      display: 'inline-block',
    };

    return (
      <span style={style}>
        <button className="btn btn-success" onClick={this.openDialog}>
          Donate
        </button>
        <SkyLightStateless
          isVisible={this.state.modalVisible}
          onCloseClicked={() => this.closeDialog()}
          onOverlayClicked={() => this.closeDialog()}
          title={`Support this ${type}!`}
        >
          <strong>
            Give Ether to support <em>{model.title}</em>
          </strong>

          {type === 'pool' && (
            <p>
              Participate: as long as the {type} owner does not reach its goal you can take it back
              any time.
            </p>
          )}

          <p>
            {/* Your wallet balance: <em>&#926;{wallet.getTokenBalance()}</em> */}
            {/* <br /> */}
            Gas price: <em>{utils.fromWei(gasPrice, 'gwei')} Gwei</em>
          </p>

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
