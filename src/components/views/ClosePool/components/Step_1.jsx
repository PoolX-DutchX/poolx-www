import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

class StepOne extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {formik, currentUser} = this.props; // *** formik props passed in from MultistepForm parent component
    const {values, handleChange, handleBlur, touched, errors, setFieldValue} = formik;
    return(
      <div>
        <div className="row">
          <div className="col">
            <TextField
              id="payoutAddress"
              name="payoutAddress"
              label="Destination Address"
              placeholder="0x..."
              value={values.payoutAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.payoutAddress && !!errors.payoutAddress}
              helperText={touched.payoutAddress && errors.payoutAddress}
              autoComplete="Off"
              spellCheck="false"
              type= "text"
              margin="normal"
              fullWidth
            />
            <TextField
              id="payoutTxData"
              name="payoutTxData"
              label="Transaction data"
              multiline
              rowsMax="6"
              value={values.payoutTxData}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.payoutTxData && !!errors.payoutTxData}
              helperText={''}
              autoComplete="Off"
              spellCheck="false"
              type= "text"
              margin="normal"
              fullWidth
            />
          </div>
        </div>
      </div>
    )
  }
}

export default StepOne;
