import React from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

// TODO check token1ThresholdReached + token2ThresholdReached
const StepOne = ({
  formik: {
    values: { amount, isContributingToken2 },
    handleChange,
    handleBlur,
    touched,
    errors,
  },
}) => (
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
        (isContributingToken2 ? 'Token2' : 'Token1') + ' Contribution amount'
      }
      placeholder="Token amount"
      value={amount}
      autoComplete="Off"
      spellCheck="false"
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.amount && !!errors.amount}
      helperText={touched.amount && errors.amount}
      fullWidth
    />
  </div>
)

export default StepOne
