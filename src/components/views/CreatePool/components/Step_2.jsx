import React from 'react'
import TextField from '@material-ui/core/TextField'

const StepTwo = ({
  formik: { values: { initialClosingPrice }, handleChange, handleBlur, touched, errors },
}) => (
  <div>
    <div className="row">
      <div className="col-md-12">
        <TextField
          id="initialClosingPrice"
          label="Token1 / Token 2 Initial Closing Price"
          value={initialClosingPrice}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.initialClosingPrice && !!errors.initialClosingPrice}
          helperText={touched.initialClosingPrice && errors.initialClosingPrice}
          inputProps={{
            min: '0',
            max: `${1e26}`,
            step: '0.1',
          }}
          type="number"
          margin="normal"
          fullWidth
        />
      </div>
    </div>
  </div>
)

export default StepTwo
