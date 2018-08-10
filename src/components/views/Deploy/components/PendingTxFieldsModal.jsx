import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { history } from '../../../../lib/helpers';

import PendingTxFields from './PendingTxFields';

class PendingTxFieldsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }
  }
  handleOpen = () => {
    this.setState({
      open: true,
    });
  }
  handleClose = redirect => () => {
    this.setState({
      open: false
    }, () => {
      redirect();
    });
  };

  render() {
    const { pendingTx, wallet, poolId } = this.props;
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Your transaction data</DialogTitle>
        <DialogContent>
          <div className="alert alert-info">
            {wallet}
          </div>
          <PendingTxFields pendingTx={pendingTx}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose(() => { history.push('/dashboard')})} color="primary" autoFocus>
            View Dashboard
          </Button>
          <Button onClick={this.handleClose(() => { history.push(`/pools/${poolId}`)})} color="primary" autoFocus>
            View pool
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default PendingTxFieldsModal;
