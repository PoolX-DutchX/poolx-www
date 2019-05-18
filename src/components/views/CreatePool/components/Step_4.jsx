import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField'

class StepFour extends Component {
  render() {
    const {
      formik: { values, handleChange, handleBlur, touched, errors },
    } = this.props // formik props passed in from Wizard
    return (
      <div>
        <div className="row">
          <div className="col">
            <TextField
              id="sellPriceNumerator"
              name="sellPriceNumerator"
              label="Pool's sellPriceNumerator"
              value={values.sellPriceNumerator}
              autoComplete="Off"
              spellCheck="false"
              placeholder="The pool's sellPriceNumerator"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.sellPriceNumerator && !!errors.sellPriceNumerator}
              helperText={
                touched.sellPriceNumerator && errors.sellPriceNumerator
              }
              margin="normal"
              fullWidth
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TextField
              id="sellPriceDenumerator"
              name="sellPriceDenumerator"
              label="Pool's sellPriceDenumerator"
              value={values.sellPriceDenumerator}
              autoComplete="Off"
              spellCheck="false"
              placeholder="The pool's sellPriceDenumerator"
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.sellPriceDenumerator && !!errors.sellPriceDenumerator
              }
              helperText={
                touched.sellPriceDenumerator && errors.sellPriceDenumerator
              }
              margin="normal"
              fullWidth
            />
          </div>
        </div>
      </div>
    )
  }
}

export default StepFour
