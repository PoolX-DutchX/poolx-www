import React from 'react'
import TextField from '@material-ui/core/TextField'
import WithTooltip from '../../../WithTooltip'

const StepTwo = ({
  formik: {
    values: { initialClosingPrice },
    handleChange,
    handleBlur,
    touched,
    errors,
  },
}) => (
  <div>
    <div className="row">
      <div className="col-md-12">
        <WithTooltip title="When an auction for a given token pair begins, the initial price is set at twice the final closing price.  From this initial price, the price falls according to a decreasing function. During the auction bidders can submit their bid at any point in time at that current price (remember: the price function is decreasing). The bidders are guaranteed the minimum amount of tokens at the price point at which they took part. Bidders can submit bids until the auction closes (where bidVolume x price = sellVolume). Note that all bidders receive the same final and therefore lowest price. Bidders should therefore take part where the current price of the auction reflects their maximum willingness to pay. Since bidders will only pay the final market clearing price, which is either at their bid or lower, they have an economic incentive to submit the bid at their highest willingness to pay.">
          <TextField
            id="initialClosingPrice"
            label="Closing Price"
            value={initialClosingPrice}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.initialClosingPrice && !!errors.initialClosingPrice}
            helperText={
              touched.initialClosingPrice && errors.initialClosingPrice
            }
            inputProps={{
              min: '0',
              max: `${1e26}`,
              step: '0.1',
            }}
            type="number"
            margin="normal"
            fullWidth
          />
        </WithTooltip>
      </div>
    </div>
  </div>
)

export default StepTwo
