import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import Tooltip from '@material-ui/core/Tooltip';

import ChooseWalletDialog from '../../../ChooseWalletDialog';

class StepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      walletDialogOpen: false,
    };
    this.handleChooseWalletClick = this.handleChooseWalletClick.bind(this);
    this.handleWalletDialogClose = this.handleWalletDialogClose.bind(this);
  }
  handleChooseWalletClick() {
    this.setState({
      walletDialogOpen: true,
    });
  }
  handleWalletDialogClose(value) {
    if (!!value) {
      this.props.formik.setFieldValue('ownerAddress', value);
    }
    this.setState({ walletDialogOpen: false });
  }
  render() {
    const {
      pool = {},
      formik: { values, handleChange, handleBlur, touched, errors },
      currentUser,
      disabledFields = {},
    } = this.props; // formik props passed in from Wizard
    return (
      <div>
        <div className="row align-items-center">
          <div className="col">
            <Tooltip
              title="Wallet address permanently set on poolbase smart contract"
              placement="bottom-start"
            >
              <TextField
                id="ownerAddress"
                name="ownerAddress"
                label="Wallet address"
                value={values.ownerAddress}
                autoComplete="Off"
                spellCheck="false"
                placeholder="Your wallet address"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ownerAddress && !!errors.ownerAddress}
                helperText={touched.ownerAddress && errors.ownerAddress}
                margin="normal"
                disabled={disabledFields.ownerAddress}
                fullWidth
              />
            </Tooltip>
          </div>
          {this.props.currentUser &&
            !disabledFields.ownerAddress && (
              <div className="col-md-3">
                <Button
                  type="button"
                  color="primary"
                  size="small"
                  onClick={this.handleChooseWalletClick}
                >
                  Choose wallet
                </Button>
                <ChooseWalletDialog
                  wallets={currentUser.wallets}
                  selectedValue={values.ownerAddress}
                  open={this.state.walletDialogOpen}
                  onClose={this.handleWalletDialogClose}
                />
              </div>
            )}
        </div>
        <div className="row">
          <div className="col-md-3">
            <FormLabel className="spacer-top-40">Limits</FormLabel>
          </div>
          <div className="col-md-9">
            <div className="d-flex align-items-baseline">
              <Tooltip
                title="Requires blockchain transaction to change max pool allocation"
                placement="bottom-start"
              >
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
                  type="number"
                  margin="normal"
                  disabled={disabledFields.ownerAddress}
                  fullWidth
                />
              </Tooltip>
              <div style={{ marginLeft: '1rem' }}>
                <Link
                  to={{
                    pathname: `/pools/${pool.id}/update`,
                    hash: 'maxAllocation',
                  }}
                >
                  <Button type="submit" variant="outlined" size="small" color="primary">
                    Change
                  </Button>
                </Link>
              </div>
            </div>
            <div className="d-flex justify-content-between two-col-inner-padding">
              <TextField
                id="minContribution"
                label="Min contribution"
                placeholder="Ξther amount"
                value={values.minContribution}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.minContribution && !!errors.minContribution}
                helperText={touched.minContribution && errors.minContribution}
                inputProps={{
                  min: 0.01,
                  max: values.maxContribution,
                }}
                type="number"
                margin="normal"
                fullWidth
              />
              <TextField
                id="maxContribution"
                label="Max contribution"
                placeholder="Ξther amount"
                value={values.maxContribution}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.maxContribution && !!errors.maxContribution}
                helperText={touched.maxContribution && errors.maxContribution}
                inputProps={{
                  min: values.minContribution || 0.01,
                  max: values.maxAllocation,
                }}
                type="number"
                margin="normal"
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StepOne;
