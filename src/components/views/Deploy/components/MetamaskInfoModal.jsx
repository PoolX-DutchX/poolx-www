import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CheckIcon from '@material-ui/icons/CheckCircle'

import CircleStep from '../../../CircleStep'

class MetamaskInfoModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      metamask: {},
      wallet: {},
      network: {},
    }
  }
  handleOpen = ({ metamask, wallet, network }) => {
    this.setState({
      open: true,
      metamask,
      wallet,
      network,
    })
  }
  handleClose = () => {
    this.setState({
      open: false,
    })
  }

  getChecklist = () => {
    const { metamask, network, wallet } = this.state
    return [
      {
        checked: metamask.installed,
        itemText: (
          <span>
            Install{' '}
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Metamask Chrome Plugin
            </a>
          </span>
        ),
      },
      {
        checked: metamask.unlocked,
        itemText: <span>Unlock Metamask</span>,
      },
      {
        checked: network.selected,
        itemText: <span>Point Metamask to {network.value}</span>,
      },
      {
        checked: wallet.selected,
        itemText: (
          <span>
            Select your chosen wallet for this transaction:
            <div className="alert alert-info">{wallet.value}</div>
          </span>
        ),
      },
    ]
  }

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Your Metamask checklist
        </DialogTitle>
        <DialogContent>
          {this.getChecklist().map(({ itemText, checked }, index) => {
            return (
              <div className="row" key={index}>
                <div className="col">
                  <CircleStep step={index + 1} />
                  <span style={{ verticalAlign: 'text-bottom' }}>
                    {itemText}
                  </span>
                </div>
                <div className="col-1">
                  {checked ? (
                    <CheckIcon style={{ color: 'green' }} />
                  ) : (
                    <CheckIcon style={{ color: 'rgba(128, 128, 128, 0.5)' }} />
                  )}
                </div>
              </div>
            )
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default MetamaskInfoModal
