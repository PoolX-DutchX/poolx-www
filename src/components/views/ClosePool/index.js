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
 )
}

class ClosePool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount() {
    const { currentUser, match: { params: { poolId }}} = this.props
    try {
      await isAuthenticated(currentUser);
      const pool = PoolService.getById(poolId);
       if (!isPoolAdmin(pool, currentUser)) {
         history.replace(`/pools/${pool._id}`);
       };

      if (pool.lockDestination === true && !!pool.pendingTx) {
        history.push(`/pools/${pool._id}/pendingTx`);
      } else {
        this.setState({
          isLoading: false,
          poolId
        });
      }
    } catch(err) {
      console.log('err', err);
      //oops something wrong
    }

  }

  render() {
    const { isLoading } = this.state;

    return (
      <div>
        {isLoading && <Loader className="fixed" />}
        { !isLoading && <MultiStepForm
            header={<Header/>}
            initialValues={{
              payoutAddress: '',
              payoutTxData: ''
            }}
            stepLabels={['Destination & Data','Perform transaction']}
            onSubmit={({ payoutAddress, payoutTxData}, actions) => {
              PoolService.patch(this.state.poolId, {
                status: Pool.PENDING_CLOSE_POOL,
                payoutAddress,
                payoutTxData
              }).then(() => {
                history.push(`/pools/${this.state.poolId}/pendingTx`);
              });
            }}
            validationSchemas={validationSchemas}
          >
            <StepOne currentUser={this.props.currentUser}/>
          </MultiStepForm>
        }
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
