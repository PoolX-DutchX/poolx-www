import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


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
  // paper: {
  //   height: 140,
  //   width: 100,
  // },
  // control: {
  //   padding: theme.spacing.unit * 2,
  // },
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
// export default WalletPanel;

//
// <Table>
//   <TableBody>
//     <TableRow>
//       <TableCell component="th" scope="row">
//         <img src="/img/metamask-logo.svg" width="90px" alt="Metamask logo" />
//         <span><h6>MetaMask</h6></span>
//       </TableCell>
//       <TableCell component="th" scope="row">
//         <a class="wallet-logo" href="">
//           <img src="/img/mycrypto-logo.png" width="90px" alt="My Crypto logo" />
//           <span><h6>MyCrypto</h6></span>
//         </a>
//       </TableCell>
//       <TableCell component="th" scope="row">
//         <a class="wallet-logo" href="">
//           <img src="/img/myetherwallet-logo.png" width="90px" alt="My Ether Wallet logo" />
//           <span><h6>MyEtherWallet</h6></span>
//         </a>
//       </TableCell>
//     </TableRow>
//   </TableBody>
// </Table>
