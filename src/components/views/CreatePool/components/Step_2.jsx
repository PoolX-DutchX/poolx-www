import React, { Component } from 'react';

import { FieldArray } from 'formik';

import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import Pool from '../../../../models/Pool';

import PlusIcon from '../../../PlusIcon';
import AdminListItem from './AdminListItem';

class StepTwo extends Component {
  constructor(props) {
    super(props)
    this.state= {
      walletDialogOpen: false
    };
    this.handleChooseWalletClick = this.handleChooseWalletClick.bind(this);
    this.handleWalletDialogClose = this.handleWalletDialogClose.bind(this);
  }
  handleChooseWalletClick(){
    this.setState({
      walletDialogOpen: true
    });
  }
  handleWalletDialogClose(value){
    if (!!value) {
      this.props.formik.setFieldValue('ownerAddress', value);
    }
    this.setState({ walletDialogOpen: false });
  }
  render() {
    const {formik, disabledFields = {}} = this.props; // *** formik props passed in from MultistepForm parent component
    const {values, handleChange, handleBlur, touched, errors} = formik;
    return(
      <div>
        <div className="row">
          <div className="col-md-2">
            <TextField
              id="fee"
              name="fee"
              label="Pool fee"
              value={values.fee}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fee && !!errors.fee}
              helperText={
                touched.fee && errors.fee ?  errors.fee :
                !(touched.feePayoutCurrency && errors.feePayoutCurrency) &&
                <span>
                  <span>Your fee <span className="underline">{values.fee || 0}%</span> + </span>
                  <span>PB fee <span className="underline">0.4%</span>  = </span>
                  <span><strong><span className="underline">{(parseFloat(values.fee || 0) + 0.4).toFixed(2)}%</span> Total</strong></span>
                </span>
              }
              placeholder="% 0.0"
              InputProps={
                (values.fee || values.fee === 0) ? {
                  startAdornment: <InputAdornment position="start">% </InputAdornment>,
                  min:"0",
                  max:"100",
                  step:"0.1",
                } : {}
              }
              type= "number"
              margin="normal"
              style={{ whiteSpace: "nowrap"}}
              disabled={disabledFields.fee}
              fullWidth
            />
          </div>
          <div className="col-md-2">
            <FormControl fullWidth margin="normal">
              <InputLabel
                htmlFor="name-disabled"
                error={touched.feePayoutCurrency && !!errors.feePayoutCurrency}>
                  Currency
              </InputLabel>
              <Select
                value={values.feePayoutCurrency}
                onChange={handleChange}
                disabled={disabledFields.feePayoutCurrency}
                input={
                  <Input
                    name="feePayoutCurrency"
                    id="name-disabled"
                    error={touched.feePayoutCurrency && !!errors.feePayoutCurrency}
                  />
                }>
                <MenuItem value={Pool.CURRENCY_ETHER}>Ether</MenuItem>
                <MenuItem value={Pool.CURRENCY_TOKEN}>Token</MenuItem>
              </Select>
              <FormHelperText
                error={touched.feePayoutCurrency && !!errors.feePayoutCurrency}>
                {touched.feePayoutCurrency && errors.feePayoutCurrency}
              </FormHelperText>
            </FormControl>
          </div>
          <div className="col-md-8">
            <TextField
              id="adminPayoutAddress"
              name="adminPayoutAddress"
              label="Fee payout address"
              value={values.adminPayoutAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.adminPayoutAddress && !!errors.adminPayoutAddress}
              helperText={touched.adminPayoutAddress && errors.adminPayoutAddress}
              placeholder="Admin fee payout address"
              autoComplete="Off"
              spellCheck="false"
              type= "text"
              margin="normal"
              disabled={disabledFields.adminPayoutAddress}
              fullWidth
            />
          </div>
        </div>
        <FieldArray
            name="admins"
            render={(fieldArrayHelpers) => {
              return (
                <div className="spacer-top-40">
                  <div className="d-flex align-items-center">
                    <FormLabel >Admins</FormLabel>
                    {
                      !disabledFields.admins && values.admins && !values.admins.length &&
                        <Tooltip title="Add">
                          <div>
                            <IconButton aria-label="Add admin"
                              onClick={() => {
                                fieldArrayHelpers.push({address:'', name:''});
                              }}
                              disableRipple>
                                <PlusIcon color="#3f51b5" />
                            </IconButton>
                          </div>
                        </Tooltip>
                    }
                  </div>
                  {
                    values.admins && values.admins.map((admin, index) => {
                      return <AdminListItem
                        key={index}
                        admin={admin}
                        index={index}
                        formik={formik}
                        fieldArrayHelpers={fieldArrayHelpers}
                        disabledFields={disabledFields}
                      />
                    })
                  }
                </div>
              )
            }}
          />
      </div>
    )
  }
}

export default StepTwo;
