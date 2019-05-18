import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'

class StepThree extends Component {
  render() {
    const { formik } = this.props // *** formik props passed in from MultistepForm parent component
    const { values, handleChange, handleBlur, touched, errors } = formik

    return (
      <div>
        <div className="col-md-8">
          <TextField
            id="token1Address"
            name="token1Address"
            label="Token1 address"
            value={values.token1Address}
            autoComplete="Off"
            spellCheck="false"
            placeholder="The Token1 address"
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.token1Address && !!errors.token1Address}
            helperText={touched.token1Address && errors.token1Address}
            margin="normal"
            fullWidth
          />
          <TextField
            id="token2Address"
            name="token2Address"
            label="Token2 address"
            value={values.token2Address}
            autoComplete="Off"
            spellCheck="false"
            placeholder="The Token2 address"
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.token2Address && !!errors.token2Address}
            helperText={touched.token2Address && errors.token2Address}
            margin="normal"
            fullWidth
          />
        </div>
      </div>
    )
  }
}

export default StepThree
