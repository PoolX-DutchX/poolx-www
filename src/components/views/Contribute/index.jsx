import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import User from '../../../models/User';

import MultiStepForm from '../../MultiStepForm';
import StepOne from './components/StepOne';

import Loader from '../../Loader';

import { checkEthereumAddress } from '../../../lib/validators';
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
    super(props);

    this.state = {
      isLoading: true,
      pool: {
        address: '0xc38e6069cf20f345f24070c52ef68fa2c9314d5b',
        minContribution: 40,
        maxContribution: 200},
    };
    Yup.addMethod(Yup.string, 'ethereumAddress', checkEthereumAddress)
  }

  componentDidMount() {
    const poolId = this.props.match.params.id;
    //ToDo: getPoolById
    this.setState({
      isLoading: false
    });
  }

  render() {
    const { isLoading, pool: { minContribution, maxContribution }  } = this.state;

    return (
      <div>
        {isLoading && <Loader className="fixed" />}
        { !isLoading && <MultiStepForm
            header={<Header/>}
            initialValues={{
              wallet: '',
              amount: '',
            }}
            stepLabels={['Contribution Details', 'Perform transaction']}
            onSubmit={(values, actions) => {
              console.log('submitting values', values);
              //   actions.setSubmitting(false);
            }}
            validationSchema={ Yup.object().shape({
              wallet: Yup.string()
                .ethereumAddress('Invalid ethereum address')
                .required('Required'),
              amount: Yup.number()
                .min(minContribution, `Must be more than Pool minimum contribution of ${minContribution}`)
                .max(maxContribution, `Must be less than Pool Maximum contribution of ${maxContribution}`)
                .required('Required')
              })}
          >
            <StepOne
              currentUser={this.props.currentUser}
              minContribution={minContribution}
              maxContribution={maxContribution}
            />
          </MultiStepForm>
        }
      </div>
    );
  }
}

Contribute.propTypes = {
  currentUser: PropTypes.instanceOf(User),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Contribute;
