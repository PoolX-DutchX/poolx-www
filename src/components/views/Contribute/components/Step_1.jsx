import React, { Component } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

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
      this.props.formik.setFieldValue('isContributingToken2', value)
    }
    this.setState({ walletDialogOpen: false })
  }

  render() {
    const {
      formik: {
        values: { amount, isContributingToken2 },
        handleChange,
        handleBlur,
        touched,
        errors,
      },
    } = this.props // formik props passed in from Wizard

    // TODO check token1ThresholdReached + token2ThresholdReached

    return (
      <div>
        <FormControlLabel
          control={
            <Checkbox
              id="isContributingToken2"
              color="primary"
              checked={isContributingToken2}
              value="isContributingToken2"
              onChange={handleChange}
            />
          }
          label="Contribute Token2"
        />
        <TextField
          id="amount"
          name="amount"
          label={
            (isContributingToken2 ? 'Token2' : 'Token1') +
            ' Contribution amount'
          }
          placeholder="Token amount"
          value={amount}
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
