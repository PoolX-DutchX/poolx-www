import React, { Component } from 'react';
import PropTypes from 'prop-types';

import User from '../../../models/User';
import Pool from '../../../models/Pool';
import PoolService from '../../../services/Pool';

import MultiStepForm from '../../MultiStepForm';
import StepOne from './components/Step_1';

import validationSchemas from './validation/';

import Loader from '../../Loader';
import { history, isPoolAdmin } from '../../../lib/helpers';
import { isAuthenticated } from '../../../lib/middleware';
/**
 * View flow to create a Contribution
 *
 * @param id       URL parameter which is an id of a pool object
 */

const Header = () => {
  return (
    <div>
      <h1 className="font-xl">Send Payout</h1>
    </div>
  );
};

class ClosePool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      pool: {},
    };
  }

  async componentDidMount() {
    const { currentUser, match: { params: { poolId } } } = this.props;
    try {
      // await isAuthenticated(currentUser);

      const pool = await PoolService.getById(poolId);
      console.log('pool', pool);
      console.log('currentUser', currentUser);

      if (!isPoolAdmin(pool, currentUser)) {
        history.replace(`/pools/${pool._id}`);
      }

      this.setState({
        isLoading: false,
        pool,
      });
    } catch (err) {
      console.log('err', err);
      //oops something wrong
    }
  }

  render() {
    console.log('this.state.pool', this.state.pool);
    const { isLoading, pool: { lockPayoutAddress, payoutAddress, payoutTxData } } = this.state;
    console.log('lockPayoutAddress', lockPayoutAddress);
    console.log('payoutAddress', payoutAddress);
    console.log('payoutTxData', payoutTxData);
    const initialValues = {
      lockPayoutAddress: lockPayoutAddress,
      payoutAddress: payoutAddress || '',
      payoutTxData: payoutTxData || '',
    };
    return (
      <div>
        {isLoading && <Loader className="fixed" />}
        {!isLoading && (
          <MultiStepForm
            header={<Header />}
            initialValues={initialValues}
            stepLabels={['Destination & Data', 'Perform transaction']}
            onSubmit={({ payoutAddress, payoutTxData }, actions) => {
              console.log('payoutAddress', payoutAddress);
              console.log('payoutTxData', payoutTxData);
              PoolService.patch(this.state.pool.id, {
                status: Pool.PENDING_CLOSE_POOL,
                payoutAddress,
                payoutTxData,
              }).then(() => {
                history.push(`/pools/${this.state.pool.id}/pendingTx`);
              });
            }}
            validationSchemas={validationSchemas}
          >
            <StepOne currentUser={this.props.currentUser} />
          </MultiStepForm>
        )}
      </div>
    );
  }
}

ClosePool.propTypes = {
  currentUser: PropTypes.instanceOf(User),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default ClosePool;
