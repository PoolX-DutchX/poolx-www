import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'

class StepOne extends Component {
  render() {
    const { formik } = this.props // *** formik props passed in from MultistepForm parent component
    const { values, handleChange, handleBlur, touched, errors } = formik

    return (
      <div>
        <div className="col-md-8">
          <TextField
            id="dutchXAddress"
            name="dutchXAddress"
            label="DutchX address"
            value={values.dutchXAddress}
            autoComplete="Off"
            spellCheck="false"
            placeholder="The DutchX address"
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.dutchXAddress && !!errors.dutchXAddress}
            helperText={touched.dutchXAddress && errors.dutchXAddress}
            margin="normal"
            fullWidth
          />
        </div>
      </div>
    )
  }
}

export default StepOne
