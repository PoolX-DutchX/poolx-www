import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  paper: {
    margin: '1rem 0',
    padding: '1rem',
  },
  root: {
    flexGrow: 1,
  },
  item: {
    textAlign: 'center'
  }
});

const WalletProviderPanel = ({ classes, onClick }) => { return (
  <Paper id="wallet-provider-panel">
    <h2>Choose your wallet provider </h2>
    <div className="provider-wrap">
      <div className="wallet-logo">
        <img src="/img/metamask-logo.svg" width="90px" alt="Metamask logo" />
        <span><h6>MetaMask</h6></span>
      </div>
      <a className="wallet-logo" href="">
        <img src="/img/mycrypto-logo.png" width="90px" alt="My Crypto logo" />
        <span><h6>MyCrypto</h6></span>
      </a>
      <a className="wallet-logo" href="">
        <img src="/img/myetherwallet-logo.png" width="90px" alt="My Ether Wallet logo" />
        <span><h6>MyEtherWallet</h6></span>
      </a>
    </div>
  </Paper>
)};

WalletProviderPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WalletProviderPanel);
