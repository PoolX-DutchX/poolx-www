import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import WalletProviderPanel from './WalletProviderPanel';
import DeployDataFields from './DeployDataFields';

import GasPricePanel from '../../../../components/GasPricePanel';


// import getNetwork from '../lib/blockchain/getNetwork';
// import { feathersClient } from '../lib/feathersClient';
// import { displayTransactionError, getGasPrice } from '../lib/helpers';
// import getWeb3 from '../lib/blockchain/getWeb3';
// import LoaderButton from './LoaderButton';
// import Contribution from '../models/Contribution';
// import ContributionService from '../services/Contribution';

// const felixPoolArtifact = require('../lib/blockchain/contracts/FelixPool.json');
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
class DeployStep extends React.Component {
  constructor(props) {
    super();
    const { wallet, toAddress, amount, txData, gasLimit } = props;

    this.state = {
      isSaving: false,
      wallet,
      toAddress,
      amount,
      txData,
      gasLimit,
      myEtherWalletUrl: `https://www.myetherwallet.com/?to=${toAddress.toUpperCase()}&gaslimit=${gasLimit}&data=${txData}&value=${amount}#send-transaction`,
      myCryptoUrl: `https://www.mycrypto.com/?to=${toAddress.toUpperCase()}&gasLimit=${gasLimit}&data=${txData}&value=${amount}#send-transaction`,

    };

    this.handleWalletProviderClick = this.handleWalletProviderClick.bind(this);
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
    const { wallet } = this.state;

    return (<div>
        <Typography variant="subheading" gutterBottom>
          To perform this operation, you need to send a transaction from:
        </Typography>
        <div className="alert alert-info" role="alert">
          {wallet}
        </div>
        <Typography variant="subheading" gutterBottom>
          Transact by way of these popular wallet providers:
        </Typography>
        <WalletProviderPanel onClick={this.handleWalletProviderClick}/>
        <Typography variant="subheading" gutterBottom>
          Or do so manually with the following data:
        </Typography>
        <DeployDataFields  data={ getDeployData(this.state) }/>
        <GasPricePanel/>
      </div>)
  }

}

DeployStep.propTypes = {
  wallet: PropTypes.string.isRequired,
  toAddress: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  txData: PropTypes.string.isRequired,
  gasLimit: PropTypes.number.isRequired
};
// DeployStep.defaultProps = { };

export default DeployStep;
