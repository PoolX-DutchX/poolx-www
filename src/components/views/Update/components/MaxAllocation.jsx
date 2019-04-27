import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
// import InputAdornment from '@material-ui/core/InputAdornment';

class Fee extends Component {
  render() {
    const { formik } = this.props; // *** formik props passed in from MultistepForm parent component
    const { values, handleChange, handleBlur, touched, errors } = formik;
    return (
      <div>
        <div className="row">
          <div className="col">
            <TextField
              id="maxAllocation"
              label="Net max pool allocation"
              inputProps={{ style: { width: '100%' } }}
              placeholder="Ξther amount"
              value={values.maxAllocation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.maxAllocation && !!errors.maxAllocation}
              helperText={touched.maxAllocation && errors.maxAllocation}
              min="0"
              type="number"
              margin="normal"
              fullWidth
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Fee;
