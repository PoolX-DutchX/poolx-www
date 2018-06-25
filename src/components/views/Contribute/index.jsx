import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { utils } from 'web3';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { history } from '../../../lib/helpers';
import { feathersClient } from '../../../lib/feathersClient';
import { confirmBlockchainTransaction } from '../../../lib/middleware';



import User from '../../../models/User';
import PoolService from '../../../services/Pool';
import Contribution from '../../../models/Contribution';

import DeployStep from '../CreatePool/components/DeployStep';

import ErrorPopup from '../../ErrorPopup';
import Loader from '../../Loader';

function getSteps() {
  return ['Contribution Details', 'Perform transaction'];
}

function totalSteps() {
  return getSteps().length;
};

function checkEthereumAddress(message) {
  return this.test({
      message,
      name: 'ethereumAddress',
      exclusive: true,
      test(value) {
        return (value == null) || utils.isAddress(value);
      },
    });
};

// `addMethod` doesn't do anything special it's
// equivalent to: yup.date.protoype.format = parseDateFromFormats
Yup.addMethod(Yup.string, 'ethereumAddress', checkEthereumAddress)

/**
 * View to create a Pool
 *
 * @param id       URL parameter which is an id of a pool object
 */
class Contribute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isSaving: false,
      formIsValid: false,
      activeStep: 0,
      completed: {},
      pool: {}
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    PoolService.get(this.props.match.params.poolId)
      .then(pool => {
        console.log('pool', pool);
        this.setState({
          isLoading: false,
          pool
        });
      })
      .catch(() => err => {
        this.setState({ isLoading: false });
        console.log('err', err);
        ErrorPopup(
          'There has been a problem loading the Pool. Please refresh the page and try again.',
          err,
        );
      });
  }

  submitViaMetamask() {
    this.setState({ isSaving: true });

    const afterMined = url => {
      console.log('url', url);
      if (url) {
        const msg = (
          <p>
            Your Pool has been created!<br />
            <a href={url} target="_blank" rel="noopener noreferrer">
              View transaction
            </a>
          </p>
        );
        React.toast.success(msg);
        history.push(`/pools/${this.state.pool.address}`);
      } else {
        if (this.mounted) this.setState({ isSaving: false });
        React.toast.success('Your Pool has been updated!');
        history.push(`/pools/${this.state.pool.address}`);
      }
    };

    const afterCreate = url => {
      if (this.mounted) this.setState({ isSaving: false });
      const msg = (
        <p>
          Your Pool is pending....<br />
          <a href={url} target="_blank" rel="noopener noreferrer">
            View transaction
          </a>
        </p>
      );
      React.toast.info(msg);
      // history.push('/my-pools');
    };

    // Save the pool
    confirmBlockchainTransaction(
      () => this.state.pool.save(afterCreate, afterMined),
      () => this.setState({ isSaving: false }),
    );
  }

  submit(pool) {
    // console.log('pool', pool);
  }

  toggleFormValid(state) {
    this.setState({ formIsValid: state });
  }

  completedSteps() {
    return Object.keys(this.state.completed).length;
  }

  isLastStep() {
    return this.state.activeStep === this.totalSteps() - 1;
  }

  allStepsCompleted() {
    return this.completedSteps() === this.totalSteps();
  }


  async handleNext() {
    console.log('this.state.activeStep', this.state.activeStep);
    console.log('totalSteps()', totalSteps());
    if (this.state.activeStep === totalSteps() - 2 ) { //check validation
      // TODO: Put new Contribution on Redis cache
    }

    this.setState({
     activeStep: this.state.activeStep + 1,
    });
  };

  handleBack() {
   this.setState({
     activeStep: this.state.activeStep - 1,
   });
  };

  handleStep(step) {
   return () => {
      this.setState({
        activeStep: step,
      });
    }
  };

  handleReset() {
     this.setState({
       activeStep: 0,
     });
   };

   handleChange(key) {
    return (event) => {
      console.log('key', key);
      console.log('event.target.value', event.target.value);
       // this.setState({
       //   activeStep: step,
       // });
     }
   };

  render() {
    const { isLoading } = this.state;

    const steps = getSteps();
    const { activeStep, pool: { minContribution: min, maxContribution: max } } = this.state;

    return (
      <div id="create-pool-view">
        {isLoading && <Loader className="fixed" />}
        {!isLoading && (
          <div>
            <div className="header">
              <div className="row">
                <section className="col-8 offset-2">
                  <h1 className="font-xl">Contribute</h1>
                  <p className="font-m">...And get in on some of the action</p>
                </section>
              </div>
            </div>
            <div className="container main-wrap">
              <div className="row">
                <div className="col-md-8">
                  {
                    this.state.activeStep === 0 &&
                    <div>
                      <Formik
                        initialValues={{
                          wallet: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
                          amount: 16,
                        }}
                        onSubmit={async(
                          { wallet, amount },
                          { setSubmitting, setErrors /* setValues and other goodies */ }
                        ) => {
                          const contribution = new Contribution({ wallet, amount, poolAddress: this.state.pool.address });

                          const result = await feathersClient
                            .service('contributions')
                            .create(contribution.toFeathers());

                          const { poolAddress, txData, gasLimit } = result;

                          this.setState({
                            deployData: {
                              wallet,
                              toAddress: poolAddress,
                              amount,
                              txData,
                              gasLimit
                            }
                          });

                          this.handleNext()
                        }}
                        validationSchema={ Yup.object().shape({
                          wallet: Yup.string()
                            .ethereumAddress('Invalid ethereum address')
                            .required('Required'),
                          amount: Yup.number()
                            .min(min, `Must be more than Pool minimum contribution of ${min}`)
                            .max(max, `Must be less than Pool Maximum contribution of ${max}`)
                            .required('Required')
                          })
                        }
                        render={({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting,
                        }) => (
                          <form onSubmit={handleSubmit}>
                            <TextField
                              id="wallet"
                              name="wallet"
                              label="Wallet address"
                              value={values.wallet}
                              autoComplete="Off"
                              spellCheck="false"
                              placeholder="Your wallet address"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.wallet && !!errors.wallet}
                              helperText={touched.wallet && errors.wallet}
                              margin="normal"
                              fullWidth
                            />
                            <TextField
                              id="amount"
                              name="amount"
                              label="Contribution amount"
                              placeholder="Ξther amount"
                              value={values.amount}
                              autoComplete="Off"
                              spellCheck="false"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.amount && !!errors.amount}
                              helperText={touched.amount && errors.amount}
                              min="0"
                              type= "number"
                              fullWidth
                            />
                            <div className="flex-end spacer-top-50 spacer-bottom-50">
                              <Button type="submit" variant="contained" size="large" color="primary" disabled={isSubmitting}>
                                Continue
                              </Button>
                            </div>
                          </form>
                        )}
                      />
                    </div>
                  }
                  {
                    this.state.activeStep === 1 && <DeployStep {...this.state.deployData} />
                  }
                  { /*(activeStep === 0) &&
                    <div className="flex-end spacer-top-50 spacer-bottom-50">
                      <Button variant="contained" size="large" color="primary" onClick={this.handleNext}>
                        Continue
                      </Button>
                    </div>
                  */}
                </div>
                <div className="col-md-3 offset-md-1">
                  <div className="steps-panel shadow-box">
                    <Stepper activeStep={activeStep} orientation="vertical" >
                      {steps.map((label, index) => {
                        return (
                          <Step key={label}>
                          <StepButton
                            onClick={this.handleStep(index)}
                            completed={this.state.completed[index]}
                          >
                            {label}
                          </StepButton>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
