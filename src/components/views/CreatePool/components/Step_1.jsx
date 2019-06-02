import React from 'react'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormLabel from '@material-ui/core/FormLabel'

const StepOne = ({
  formik: {
    values: { token1, token2, willUseWeth },
    handleChange,
    handleBlur,
    touched,
    errors,
  }, // formik props passed in from Wizard
}) => (
  <div>
    <FormControlLabel
      control={
        <Checkbox
          id="willUseWeth"
          color="primary"
          checked={willUseWeth}
          value="willUseWeth"
          onChange={handleChange}
        />
      }
      label="Use Wrapped ETH (WETH) for Token Pair"
    />

    <div className="row">
      <div className="col-md-3">
        <FormLabel className="spacer-top-40">Token Pair</FormLabel>
      </div>
      <div className="col-md-9">
        <div className="d-flex justify-content-between two-col-inner-padding">
          <TextField
            id="token1"
            label="Token 1"
            placeholder="ERC20 Token"
            value={token1}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.token1 && !!errors.token1}
            helperText={touched.token1 && errors.token1}
            autoComplete="Off"
            type="text"
            margin="normal"
            fullWidth
          />

          {!willUseWeth && (
            <TextField
              id="token2"
              label="Token 2"
              placeholder="0xc778417E063141139Fce010982780140Aa0cD5Ab"
              value={token2}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.token2 && !!errors.token2}
              helperText={touched.token2 && errors.token2}
              autoComplete="Off"
              type="text"
              margin="normal"
              fullWidth
            />
          )}
        </div>
      </div>
    </div>
  </div>
)

export default StepOne
