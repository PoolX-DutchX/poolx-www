import React from 'react';
import PropTypes from 'prop-types';

import { utils } from 'web3';

import WalletProviderPanel from './Contribute/components/WalletProviderPanel';
import DeployDataFields from './Contribute/components/DeployDataFields';

import { copyToClipboard } from '../../lib/helpers';
import WithTooltip from '../WithTooltip';
import GasPricePanel from '../GasPricePanel';
import CircleStep from '../CircleStep';

// import getNetwork from '../lib/blockchain/getNetwork';
// import { feathersClient } from '../lib/feathersClient';
// import { displayTransactionError, getGasPrice } from '../lib/helpers';
// import getWeb3 from '../lib/blockchain/getWeb3';
// import LoaderButton from './LoaderButton';
// import Contribution from '../models/Contribution';
// import ContributionService from '../services/Contribution';

// const felixPoolArtifact = require('../lib/blockchain/contracts/FelixPool.json');

class Deploy extends React.Component {
  constructor(props) {
    super();
    const { amount } = props;

    //temporary
    const wallet = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';
    const txData = '0x_transactionData';
    const gasLimit = '200000';
    const gasPrices = {}
    const poolFactoryAddress = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';

    this.state = {
      isSaving: false,
      toAddress: poolFactoryAddress,
      amount: amount || 0,
      wallet,
      gasPrices,
      gasLimit,
      txData,
      myEtherWalletUrl: `https://www.myetherwallet.com/?to=${poolFactoryAddress.toUpperCase()}&gaslimit=${gasLimit}&data=${txData}&value=${amount}#send-transaction`,
      myCryptoUrl: `https://www.mycrypto.com/?to=${poolFactoryAddress.toUpperCase()}&gasLimit=${gasLimit}&data=${txData}&value=${amount}#send-transaction`,

    };

    this.handleWalletProviderClick = this.handleWalletProviderClick.bind(this);
  }
  async componentWillMount() {
    //get Contribution
  }
  async componentDidMount() {

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
}

  handleWalletProviderClick(walletProvider) {
    return (event) => {
        console.log('walletProvider', walletProvider);
        console.log('event', event);
    }
    // window.open(`${this.state.myEtherWalletUrl}&value=${amount}#send-transaction`, '_blank');
    // window.open(`${this.state.myCryptoUrl}&value=${amount}#send-transaction`, '_blank');
  }

  render() {
    // const { pool: { wallet } } = this.props;
    const { wallet, toAddress, amount, gasLimit, txData, gasPrices } = this.state;

    return (<div className="container deploy-page">
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
            {wallet}
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
            <WalletProviderPanel onClick={this.handleWalletProviderClick}/>
            <hr/>
            <h5 className="manual-transaction-header">
              Or, transact manually...
            </h5>
            <DeployDataFields  data={ getDeployData(this.state) }/>
          </div>
        </div>
      </div>)
  }
}


export default Deploy;



const getDeployData = ({ toAddress, amount, gasLimit, txData }) => {
  return [
    {
      value: toAddress,
      label: 'To Address'
    },
    {
      value: amount,
      label: 'Amount to Send'
    },
    {
      value: gasLimit,
      label: 'Gas Limit'
    },
    {
      value: txData,
      label: 'Transaction Data'
    },
  ];
}
