import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

class Fee extends Component {
  render() {
    const { formik } = this.props // *** formik props passed in from MultistepForm parent component
    const { values, handleChange, handleBlur, touched, errors } = formik
    return (
      <div>
        <div className="row">
          <div className="col">
            <TextField
              id="fee"
              name="fee"
              label="Pool fee"
              value={values.fee}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fee && !!errors.fee}
              helperText={
                touched.fee && errors.fee
                  ? errors.fee
                  : !(
                      touched.feePayoutCurrency && errors.feePayoutCurrency
                    ) && (
                      <span>
                        <span>
                          Your fee{' '}
                          <span className="underline">{values.fee || 0}%</span>{' '}
                          +{' '}
                        </span>
                        <span>
                          PB fee <span className="underline">0.4%</span> ={' '}
                        </span>
                        <span>
                          <strong>
                            <span className="underline">
                              {(parseFloat(values.fee || 0) + 0.4).toFixed(2)}%
                            </span>{' '}
                            Total
                          </strong>
                        </span>
                      </span>
                    )
              }
              placeholder="% 0.0"
              InputProps={
                values.fee || values.fee === 0
                  ? {
                      startAdornment: (
                        <InputAdornment position="start">% </InputAdornment>
                      ),
                      min: '0',
                      max: '100',
                      step: '0.1',
                    }
                  : {}
              }
              type="number"
              margin="normal"
              style={{ whiteSpace: 'nowrap' }}
              fullWidth
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Fee
