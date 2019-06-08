import React, { Component } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import ChooseWalletDialog from '../../../ChooseWalletDialog'

class StepOne extends Component {
  constructor(props) {
    super(props)
    this.state = {
      walletDialogOpen: false,
    }
    this.handleChooseWalletClick = this.handleChooseWalletClick.bind(this)
    this.handleWalletDialogClose = this.handleWalletDialogClose.bind(this)
  }
  handleChooseWalletClick() {
    this.setState({
      walletDialogOpen: true,
    })
  }
  handleWalletDialogClose(value) {
    if (!!value) {
      this.props.formik.setFieldValue('ownerAddress', value)
    }
    this.setState({ walletDialogOpen: false })
  }
  render() {
    const {
      formik: { values, handleChange, handleBlur, touched, errors },
      currentUser,
    } = this.props // formik props passed in from Wizard
    return (
      <div>
        <div className="row align-items-center">
          <div className="col">
            <TextField
              id="ownerAddress"
              name="ownerAddress"
              label="Wallet address"
              value={values.ownerAddress}
              autoComplete="Off"
              spellCheck="false"
              placeholder="Your wallet address"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.ownerAddress && !!errors.ownerAddress}
              helperText={touched.ownerAddress && errors.ownerAddress}
              margin="normal"
              fullWidth
            />
          </div>
          {this.props.currentUser && (
            <div className="col-md-3">
              <Button
                type="button"
                color="primary"
                size="small"
                onClick={this.handleChooseWalletClick}
              >
                Choose wallet
              </Button>
              <ChooseWalletDialog
                wallets={currentUser.wallets}
                selectedValue={values.ownerAddress}
                open={this.state.walletDialogOpen}
                onClose={this.handleWalletDialogClose}
              />
            </div>
          )}
        </div>
        <TextField
          id="amount"
          name="amount"
          label="Contribution amount"
          placeholder="Ξther amount"
          value={values.amount}
          autoComplete="Off"
          spellCheck="false"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.amount && !!errors.amount}
          helperText={touched.amount && errors.amount}
          inputProps={{
            min: this.props.minContribution,
            type: 'number',
          }}
          fullWidth
        />
      </div>
    )
  }
}

export default StepOne
