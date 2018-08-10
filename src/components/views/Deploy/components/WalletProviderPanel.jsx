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

const WalletProviderPanel = ({ classes, selectProvider }) => { return (
  <div id="wallet-provider-panel">
    <div className="provider-wrap">
      <div className="wallet-logo" onClick={selectProvider('metamask')}>
        <img src="/img/metamask-logo.svg" width="90px" alt="Metamask logo" />
        <span><h6>MetaMask</h6></span>
      </div>
      <div className="wallet-logo" onClick={selectProvider('myCrypto')}>
        <img src="/img/mycrypto-logo.png" width="90px" alt="My Crypto logo" />
        <span><h6>MyCrypto</h6></span>
      </div>
      <div className="wallet-logo" onClick={selectProvider('myEtherWallet')}>
        <img src="/img/myetherwallet-logo.png" width="90px" alt="My Ether Wallet logo" />
        <span><h6>MyEtherWallet</h6></span>
      </div>
    </div>
  </div>
)};

WalletProviderPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WalletProviderPanel);
