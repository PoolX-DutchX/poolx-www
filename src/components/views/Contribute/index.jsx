import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as Yup from 'yup'

import User from '../../../models/User'
// import Contribution from '../../../models/Contribution';
// import ContributionService from '../../../services/Contribution';
// import PoolService from '../../../services/Pool';

import MultiStepForm from '../../MultiStepForm'
import StepOne from './components/Step_1'

import Loader from '../../Loader'

import { history } from '../../../lib/helpers'
import { feathersClient } from '../../../lib/feathersClient'
// import { isAuthenticated } from '../../../lib/middleware';
import { ethereumAddress } from '../../../lib/validators'
// import { isWhitelistedAddress } from '../../../lib/validators';

/**
 * View flow to create a Contribution
 *
 * @param id       URL parameter which is an id of a pool object
 */

const Header = () => {
  return (
    <div>
      <h1 className="font-xl">Contribute</h1>
      <p className="font-m">...And get in on some of the action</p>
    </div>
  )
}

class Contribute extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      pool: {},
    }

    // Yup.addMethod(Yup.string, 'whitelisted', isWhitelistedAddress);
  }

  render() {
    const {
      isLoading,
      pool: { minContribution, maxContribution },
    } = this.state

    return (
      <div>
        {isLoading && <Loader className="fixed" />}
        {!isLoading && (
          <MultiStepForm
            header={<Header />}
            initialValues={{
              ownerAddress: '',
              amount: '',
            }}
            stepLabels={['Contribution Details', 'Perform transaction']}
            onSubmit={({ ownerAddress, amount }) => {
              const { pool } = this.state
              console.log('this.state.pool.id', this.state.pool.id)
              console.log('ownerAddress', ownerAddress)
              console.log('amount', amount)
              feathersClient
                .service('contributions')
                .create({
                  ownerAddress,
                  amount,
                  pool: pool.id,
                  poolAddress: pool.contractAddress,
                })
                .then(contribution => {
                  history.push(`/contributions/${contribution._id}/pendingTx`)
                })
                .catch(err => {
                  console.log('Oops something went wrong', err)
                })
              // actions.setSubmitting(false);
            }}
            validationSchemas={[
              Yup.object().shape({
                ownerAddress: ethereumAddress()
                  // .whitelisted(this.state.pool, 'The address provided is not on pool whitelist. Please contract pool admin')
                  .required('Required'),
                amount: Yup.number()
                  .min(
                    minContribution,
                    `Must be more than Pool minimum contribution of ${minContribution} Ether`
                  )
                  .max(
                    maxContribution,
                    `Must be less than Pool Maximum contribution of ${maxContribution} Ether`
                  )
                  .required('Required'),
              }),
            ]}
          >
            <StepOne
              currentUser={this.props.currentUser}
              minContribution={minContribution}
              maxContribution={maxContribution}
            />
          </MultiStepForm>
        )}
      </div>
    )
  }
}

Contribute.propTypes = {
  currentUser: PropTypes.instanceOf(User),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export default Contribute
