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
              id="sellPriceDenominator"
              name="sellPriceDenominator"
              label="Pool's sellPriceDenominator"
              value={values.sellPriceDenominator}
              autoComplete="Off"
              spellCheck="false"
              placeholder="The pool's sellPriceDenominator"
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.sellPriceDenominator && !!errors.sellPriceDenominator
              }
              helperText={
                touched.sellPriceDenominator && errors.sellPriceDenominator
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
