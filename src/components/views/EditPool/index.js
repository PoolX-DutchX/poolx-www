import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import Button from '@material-ui/core/Button';
import User from '../../../models/User';
import PoolService from '../../../services/Pool';
import Loader from '../../Loader';
import WalletAndLimits from './components/WalletAndLimits';
import FeesAndAdmins from './components/FeesAndAdmins';
import DestinationAndWhitelist from './components/DestinationAndWhitelist';
import NameAndDescription from './components/NameAndDescription';

import validationSchema from './validation/';

class EditPool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  async componentDidMount() {
    const poolId = this.props.match.params.poolId;
    try {
      const pool = await PoolService.getById(poolId);
      this.setState({ pool, isLoading: false });
    } catch (err) {
      console.log('err', err);
      this.setState({ isLoading: false });
    }

  }

  handleSubmit = (stuff) => {
    console.log('handleSubmit stuff', stuff);

    //check hasWhitelist
  }

  render() {
    const { isLoading, pool } = this.state;
    console.log('pool', pool);
    return (
      <div id="create-pool-view" className="container">
        {isLoading && <Loader className="fixed" />}

        {!isLoading && (
          <div>
          <Formik
            initialValues={{
              ...pool.toFeathers(),
              hasWhitelist: !!pool.whitelist.length
            }}
            enableReinitialize={false}
            validationSchema={validationSchema}
            onSubmit={this.handleSubmit}
            render={(formikProps) => {
              const { handleSubmit, isSubmitting } = formikProps;
              return (
                <form onSubmit={handleSubmit} noValidate>
                  <h2 className="spacer-top-50">Name & Description</h2>
                  <NameAndDescription formik={formikProps} currentUser={this.props.currentUser}/>
                  <h2 className="spacer-top-50">Wallet & Limits</h2>
                  <WalletAndLimits formik={formikProps}
                    currentUser={this.props.currentUser}
                    disabledFields={{
                      ownerAddress: true,
                      maxAllocation: true
                    }}
                    pool={pool}
                  />
                  <h2 className="spacer-top-50">Fees & Admins</h2>
                  <FeesAndAdmins formik={formikProps}
                    currentUser={this.props.currentUser}
                    disabledFields={{
                      fee: true,
                      feePayoutCurrency: true,
                      adminPayoutAddress: true,
                      admins: true
                    }}
                    pool={pool}
                  />
                  <h2 className="spacer-top-50">Destination & Whitelist</h2>
                  <DestinationAndWhitelist formik={formikProps} currentUser={this.props.currentUser} pool={pool}/>
                  <div className="d-flex justify-content-between spacer-top-50 spacer-bottom-50">
                    <div className="ml-auto">
                      <Button type="submit" variant="contained" size="large" color="primary" disabled={isSubmitting}>
                        Save
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            } />

          </div>
        )}
      </div>
    )

  }
}


EditPool.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
  match: PropTypes.shape({
    params: PropTypes.shape({
      poolId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

EditPool.defaultProps = {
  currentUser: undefined,
};

export default EditPool;
