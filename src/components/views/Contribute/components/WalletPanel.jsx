import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  paper: {
    margin: '20px 0',
  },
  root: {
    flexGrow: 1,
  },
  item: {
    textAlign: 'center'
  }
});

const WalletPanel = ({ classes, onClick }) => { return (
  <Paper className={classes.paper}>
    <Grid container spacing={16} justify="space-between"  className={classes.root}>
      <Grid item md={4} className={classes.item} onClick={onClick('metamask')}>
        <div className="wallet-logo">
          <img src="/img/metamask-logo.svg" width="90px" alt="Metamask logo" />
          <span><h6>MetaMask</h6></span>
        </div>
      </Grid>
      <Grid item md={4} className={classes.item}  onClick={onClick()}>
        <a className="wallet-logo" href="">
          <img src="/img/mycrypto-logo.png" width="90px" alt="My Crypto logo" />
          <span><h6>MyCrypto</h6></span>
        </a>
      </Grid>
      <Grid item md={4} className={classes.item} onClick={onClick()}>
        <a className="wallet-logo" href="">
          <img src="/img/myetherwallet-logo.png" width="90px" alt="My Ether Wallet logo" />
          <span><h6>MyEtherWallet</h6></span>
        </a>
      </Grid>
    </Grid>
  </Paper>
)};

WalletPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WalletPanel);
