import React from 'react';
import PropTypes from 'prop-types';

import { feathersClient } from '../../../lib/feathersClient';

import WalletProviderPanel from './components/WalletProviderPanel';
import PendingTxFields from './components/PendingTxFields';
import MetamaskInfoModal from './components/MetamaskInfoModal';
import PendingTxFieldsModal from './components/PendingTxFieldsModal';

import GasPricePanel from '../../GasPricePanel';
import CircleStep from '../../CircleStep';

import Loader from '../../Loader';
import getWeb3 from '../../../lib/blockchain/getWeb3';
import { history } from '../../../lib/helpers';

import config from '../../../configuration';
import {getEtherscanTxLink} from '../../../constants';
import { getNetwork, isMetamaskInstalled } from '../../../lib/blockchain/utils';

class Deploy extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      pendingTx: {}
    };
    this.handleWalletProviderClick = this.handleWalletProviderClick.bind(this);
    this.transactWithMetamask = this.transactWithMetamask.bind(this);
    this.metamaskModalRef = React.createRef();
    this.pendingTxFieldsModalRef = React.createRef();
  }
  async componentDidMount() {

    const { match: { params: { poolId, contributionId }}} = this.props;

    const resourceId = poolId || contributionId;

    const serviceName = poolId ? 'pools' : 'contributions';

    try {
      const resource = await feathersClient //either pool or contribution
        .service(serviceName)
        .get(resourceId);

      this.poolId = poolId ? poolId : resource.pool._id;

      const { ownerAddress, pendingTx } = resource;

      if (!pendingTx) {
        const redirectPath = poolId ? `/pools/${resourceId}` : `/pools/${resource.pool._id}`;
        history.replace(redirectPath);
        return;
      }

      const { toAddress, amount, gasLimit, txData } = pendingTx;

      this.myEtherWalletUrl = `https://www.myetherwallet.com/?to=${toAddress.toUpperCase()}&gaslimit=${gasLimit}&data=${txData}&value=${amount}#send-transaction`;
      this.myCryptoUrl = `https://www.mycrypto.com/?to=${toAddress.toUpperCase()}&gasLimit=${gasLimit}&data=${txData}&value=${amount}#send-transaction`;

      this.setState({
        ownerAddress,
        pendingTx,
        isLoading: false,
      });

    } catch(err) {
      // oops something went wrong, try again later
      console.log('err', err);
    }
  }

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
    .on('transactionHash', (txHash) => {
      React.toast.success(
        <p>
          Your MetaMask transaction submitted! <br />
          <a href={getEtherscanTxLink(txHash)} target="_blank" rel="noopener noreferrer">View on etherscan</a>
        </p>,
      );
      history.push(`/pools/${this.poolId}`);
    })
    .on('confirmation', (confirmationNumber, receipt ) => {
      if (confirmationNumber === 5) {
        React.toast.success(
          <p>
            Your transaction has been mined! <br />
            <a href={getEtherscanTxLink(receipt.transactionHash)} target="_blank" rel="noopener noreferrer">View on etherscan</a>
          </p>,
        );
      }
    })
    .on('error', (err, receipt) => {
      React.toast.error(
        <p>
          Oops something went wrong! <br />
          {
            receipt &&
            <span>
              It Looks like you've ran out of gas,
              <a href={getEtherscanTxLink(receipt.transactionHash)} target="_blank" rel="noopener noreferrer">view on etherscan</a>
              and try again.
            </span>
          }
        </p>,
      );
    })
    .catch(err => {
      console.log('err', err);
    });

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
    const { ownerAddress, pendingTx, isLoading } = this.state;

    return (
      <React.Fragment>
        {isLoading && <Loader className="fixed" />}
        <MetamaskInfoModal ref={this.metamaskModalRef} />
        <PendingTxFieldsModal ref={this.pendingTxFieldsModalRef} pendingTx={pendingTx} wallet={ownerAddress} poolId={this.poolId}/>
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
