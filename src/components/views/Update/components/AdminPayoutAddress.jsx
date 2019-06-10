import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField'

class AdminPayoutAddress extends Component {
  render() {
    const { formik } = this.props // *** formik props passed in from MultistepForm parent component
    const { values, handleChange, handleBlur, touched, errors } = formik
    return (
      <div>
        <div className="row">
          <div className="col">
            <TextField
              id="adminPayoutAddress"
              name="adminPayoutAddress"
              label="Fee payout address"
              value={values.adminPayoutAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.adminPayoutAddress && !!errors.adminPayoutAddress}
              helperText={
                touched.adminPayoutAddress && errors.adminPayoutAddress
              }
              placeholder="Admin fee payout address"
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

export default AdminPayoutAddress
