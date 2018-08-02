import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';

import ChooseWalletDialog from '../../../ChooseWalletDialog';

class StepFour extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {formik: { values, handleChange, handleBlur, touched, errors }} = this.props; // formik props passed in from Wizard
    return(
      <div>
        <div className="row">
          <div className="col">
            <TextField
              id="name"
              name="name"
              label="Pool name"
              value={values.name}
              autoComplete="Off"
              spellCheck="false"
              placeholder="Your pool's name"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              margin="normal"
              fullWidth
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TextField
              id="description"
              name="description"
              label="Pool description"
              value={values.description}
              multiline
              rowsMax="7"
              rows="4"
              autoComplete="Off"
              spellCheck="false"
              placeholder="Say a few words about your pool"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && !!errors.description}
              helperText={touched.description && errors.description}
              margin="normal"
              fullWidth
            />
          </div>
        </div>
      </div>
    )
  }
}

export default StepFour;
