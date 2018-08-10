import React from 'react';
import PropTypes from 'prop-types';

import { utils } from 'web3';
import { feathersClient } from '../../../lib/feathersClient';

import WalletProviderPanel from './components/WalletProviderPanel';
import PendingTxFields from './components/PendingTxFields';
import MetamaskInfoModal from './components/MetamaskInfoModal';
import PendingTxFieldsModal from './components/PendingTxFieldsModal';

import { copyToClipboard } from '../../../lib/helpers';
import WithTooltip from '../../WithTooltip';
import GasPricePanel from '../../GasPricePanel';
import CircleStep from '../../CircleStep';

import Loader from '../../Loader';
import getWeb3 from '../../../lib/blockchain/getWeb3';
import { history } from '../../../lib/helpers';

import config from '../../../configuration';

import { getNetwork, isMetamaskInstalled } from '../../../lib/blockchain/utils';
// import { feathersClient } from '../lib/feathersClient';
// import { displayTransactionError, getGasPrice } from '../lib/helpers';
// import LoaderButton from './LoaderButton';
// import Contribution from '../models/Contribution';
// import ContributionService from '../services/Contribution';

// const felixPoolArtifact = require('../lib/blockchain/contracts/FelixPool.json');

class Deploy extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      showModal: false,
      pendingTx: {}
    };
    this.handleWalletProviderClick = this.handleWalletProviderClick.bind(this);
    this.transactWithMetamask = this.transactWithMetamask.bind(this);
    this.metamaskModalRef = React.createRef();
    this.pendingTxFieldsModalRef = React.createRef();
  }
  async componentDidMount() {

    const { match: { params: { resourceId }}} = this.props;
    try {
      const resource = await feathersClient //either pool or contribution
        .service(this.props.service)
        .get(resourceId);

      const { ownerAddress, pendingTx } = resource;

      if (!pendingTx) {
        if (this.props.service === 'pools') {
          history.replace(`/pools/${resourceId}`);
        }

        if (this.props.service === 'contributions') {
          history.replace(`/pools/${resource.poolId}`);
        }

      }
      const { toAddress, amount, gasLimit, txData } = pendingTx;

      this.myEtherWalletUrl = `https://www.myetherwallet.com/?to=${toAddress.toUpperCase()}&gaslimit=${gasLimit}&data=${txData}&value=${amount}#send-transaction`,
      this.myCryptoUrl = `https://www.mycrypto.com/?to=${toAddress.toUpperCase()}&gasLimit=${gasLimit}&data=${txData}&value=${amount}#send-transaction`,

      this.setState({
        ownerAddress,
        pendingTx,
        isLoading: false
      });

    } catch(err) {
      // oops something went wrong, try again later
      console.log('err', err);
    }
  }

  // const { abi, bytecode } = felixPoolArtifact;
  // const {model: { poolAddress }} = this.props;
  //
  // const web3 = await getWeb3();
  // const contract = new web3.eth.Contract(abi, poolAddress);
  // const deposit = contract.methods.deposit();
  //
  // const txData = deposit.encodeABI();
  // const gasLimit = await deposit.estimateGas({
  //     from: '0x0000000000000000000000000000000000000000',
  //     value: 1,
  //   });
  //
  // this.setState({
  //   gasLimit,
  //   txData,
  //   myEtherWalletUrl: `https://www.myetherwallet.com/?to=${poolAddress.toUpperCase()}&gaslimit=${gasLimit}&data=${txData}`,
  //   myCryptoUrl: `https://www.mycrypto.com/?to=${poolAddress.toUpperCase()}&gasLimit=${gasLimit}&data=${txData}`,
  // });

  async transactWithMetamask() {
    const { ownerAddress } = this.state;
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const currentNetwork = await getNetwork();

    const metamaskInstalled = isMetamaskInstalled();
    const metamaskUnlocked = !!accounts[0];
    const isCorrectNetwork = (config.networkName === 'ganache') ? true : (currentNetwork.id === config.networkId);
    const correctNetwork = await getNetwork(config.networkId);
    const isCorrectWallet = (accounts[0] && accounts[0].toLowerCase() === ownerAddress.toLowerCase());

    if (
      !metamaskInstalled ||
      !metamaskUnlocked ||
      !isCorrectNetwork ||
      !isCorrectWallet
    ) {
      this.metamaskModalRef.current.handleOpen({
        metamask: {installed: metamaskInstalled, unlocked: metamaskUnlocked},
        network:{selected: isCorrectNetwork, value: correctNetwork.name},
        wallet: {selected: isCorrectWallet, value: ownerAddress},
      });
      return;
    }

    this.pendingTxFieldsModalRef.current.handleOpen();

    const { toAddress, amount, gasLimit, data } = this.state.pendingTx;
    web3.eth.sendTransaction(
      {
        from: accounts[0],
        to: toAddress,
        gas: gasLimit,
        value: amount,
        data
      }
    )
    .then((stuff) => {
      console.log('stuff', stuff);
    })
    .catch(err => {
      console.log('err', err);
    });
    // toast when transaction is confirmed etc. with etherscan link

  }
  handleWalletProviderClick(walletProvider) {
    return () => {
        switch (walletProvider) {
          case 'metamask':
            this.transactWithMetamask();
            break;
          case 'myCrypto':
            this.pendingTxFieldsModalRef.current.handleOpen();
            window.open(this.myCryptoUrl, '_blank');
            break;
          case 'myEtherWallet':
            this.pendingTxFieldsModalRef.current.handleOpen();
            window.open(this.myEtherWalletUrl, '_blank');
            break;
          default:
            break;
        }
    }
  }

  render() {
    const { ownerAddress, pendingTx, isLoading, showModal } = this.state;

    return (
      <React.Fragment>
        {isLoading && <Loader className="fixed" />}
        <MetamaskInfoModal ref={this.metamaskModalRef} />
        <PendingTxFieldsModal ref={this.pendingTxFieldsModalRef} pendingTx={pendingTx} wallet={ownerAddress}/>
        { !isLoading &&
          <div className="container deploy-page">
            <h1>
              Congrats, you're almost there!
            </h1>
            <p className="sub-heading">
              Perform your 'Claim token' transaction on the 'Nexo Pool'
            </p>
            <div className="row">
              <h4 className="col-md-4">
                <CircleStep step={1}/>
                Your chosen wallet:
              </h4>
              <span className="col-md-8 alert alert-info required-wallet-alert" role="alert">
                {ownerAddress}
              </span>
            </div>
            <hr/>
            <div className="row">
              <h4 className="col-md-4">
                <CircleStep step={2}/>
                Suggested gas prices:
              </h4>
              <div className="col-md-8">
                <GasPricePanel/>
              </div>
            </div>
            <hr/>
            <div className="row">
              <h4 className="col-md-4">
                <CircleStep step={3}/>
                Transact via provider:
              </h4>
              <div className="col-md-8">
                <WalletProviderPanel selectProvider={this.handleWalletProviderClick}/>
                <hr/>
                <h5 className="manual-transaction-header">
                  Or, transact manually...
                </h5>
                <PendingTxFields  pendingTx={pendingTx}/>
              </div>
            </div>
          </div>
        }
      </React.Fragment>
    )
  }
}

Deploy.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userAddress: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Deploy;
