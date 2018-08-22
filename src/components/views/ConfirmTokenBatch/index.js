import React, { Component } from 'react';
import PropTypes from 'prop-types';

import User from '../../../models/User';
import Pool from '../../../models/Pool';
import PoolService from '../../../services/Pool';

import * as Yup from 'yup';

import MultiStepForm from '../../MultiStepForm';
import StepOne from './components/Step_1';

import Loader from '../../Loader';
import { history, isPoolAdmin } from '../../../lib/helpers';
import { isAuthenticated } from '../../../lib/middleware';
import { ethereumAddress } from '../../../lib/validators';

/**
 * View flow to confirm a token batch
 *
 * @param id       URL parameter which is an id of a pool object
 */

const Header = () => {
 return (
   <div>
     <h1 className="font-xl">Confirm token batch</h1>
   </div>
 )
}

class ConfirmTokenBatch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      pool: {}
    };
  }

  async componentDidMount() {
    const { currentUser, match: { params: { poolId }}} = this.props
    try {
      await isAuthenticated(currentUser);

      const pool = await PoolService.getById(poolId);
      // check status of pool & redirect if not appropriate
      if (!isPoolAdmin(pool, currentUser)) {
       history.replace(`/pools/${pool._id}`);
      };

      this.setState({
        isLoading: false,
        pool
      });

    } catch(err) {
      console.log('err', err);
      //oops something wrong
    }

  }

  render() {
    const { isLoading, pool: { tokenAddress }} = this.state;

    return (
      <div>
        {isLoading && <Loader className="fixed" />}
        { !isLoading && <MultiStepForm
            header={<Header/>}
            initialValues={{
              tokenAddress: tokenAddress || ''
            }}
            stepLabels={['Token address','Perform transaction']}
            onSubmit={({ tokenAddress}, actions) => {
              PoolService.patch(this.state.pool._id, {
                status: Pool.PENDING_TOKEN_BATCH,
                tokenAddress
              }).then(() => {
                history.push(`/pools/${this.state.pool._id}/pendingTx`);
              });
            }}
            validationSchemas={[
              Yup.object().shape({
                tokenAddress: ethereumAddress()
                  .required('Required')
                })
            ]}
          >
            <StepOne currentUser={this.props.currentUser}/>
          </MultiStepForm>
        }
      </div>
    );
  }
}

ConfirmTokenBatch.propTypes = {
  currentUser: PropTypes.instanceOf(User),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default ConfirmTokenBatch;
