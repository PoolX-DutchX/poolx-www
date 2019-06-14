import React, { useContext } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

import { TokenBalancesContext } from '../TokenBalancesContext'
import get from 'lodash/get'

const StepOne = ({
  formik: {
    values: { amount, isContributingToken2 },
    handleChange,
    handleBlur,
    touched,
    errors,
  },
  isAuctionWithWeth,
  token1ThresholdReached,
  token2ThresholdReached
}) => {
  const [tokenBalances] = useContext(TokenBalancesContext)
  const token1Name = get(tokenBalances, 'token1Name', null)
  const token2Name = get(tokenBalances, 'token2Name', null)

  const getLabel = () => {
    const token1Label = isAuctionWithWeth ? token1Name || 'Weth' : token1Name || 'Token1'
    const tokenLabel = isContributingToken2 ? token2Name|| 'Token2' : token1Label
    const label =  isFieldDisabled() ? 'Contribution for this token has reached the contribution threshold' : `${tokenLabel} contribution amount`
    return label;
  }

  const isFieldDisabled = () => {
    return isContributingToken2 ? token2ThresholdReached : token1ThresholdReached
  }

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
        label={`Contribute ${token2Name || 'Token2'}`}
      />
      <TextField
        id="amount"
        name="amount"
        label={getLabel()}
        placeholder="Token amount"
        value={amount}
        autoComplete="Off"
        spellCheck="false"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.amount && !!errors.amount}
        helperText={touched.amount && errors.amount}
        fullWidth
        disabled={isFieldDisabled()}
      />
    </div>
  )
}

export default StepOne