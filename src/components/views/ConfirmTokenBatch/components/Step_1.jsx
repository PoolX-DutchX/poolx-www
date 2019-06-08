import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField'

class StepOne extends Component {
  render() {
    const { formik } = this.props // *** formik props passed in from MultistepForm parent component
    const { values, handleChange, handleBlur, touched, errors } = formik
    return (
      <div>
        <div className="row">
          <div className="col">
            <TextField
              id="tokenAddress"
              name="tokenAddress"
              label="Token Contract Address"
              placeholder="0x..."
              value={values.tokenAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.tokenAddress && !!errors.tokenAddress}
              helperText={touched.tokenAddress && errors.tokenAddress}
              autoComplete="Off"
              spellCheck="false"
              type="text"
              margin="normal"
              fullWidth
            />
          </div>
        </div>
      </div>
    )
  }
}

export default StepOne
