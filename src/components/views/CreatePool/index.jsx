import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-input-token/lib/style.css';

// import { withFormik } from 'formik';
// import Yup from 'yup';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';

import { feathersClient } from '../../../lib/feathersClient';
import Loader from '../../Loader';

import PoolReview from './components/PoolReview';
import DeployStep from './components/DeployStep';

import { history, removeFromArray, addToArray } from '../../../lib/helpers';
import {
  isAuthenticated,
  confirmBlockchainTransaction,
} from '../../../lib/middleware';
import User from '../../../models/User';
import Pool from '../../../models/Pool';

const poolData = {
  maxAllocation: '200',
  fee: '0.25',
  feePayoutCurrency: 'ether',
  payoutAddress: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1' ,
  payoutAddressTxData: '0Ab7BA78BA',
  adminAddresses: [
    '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
    '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
    '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
    '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
  ],
  name: 'IIOC',
  description: 'This is the best pool you could ever hope for.',
  minContribution: '5',
  maxContribution: '30',
  ownerWallet: '0x36596eEBd695aDCd03B3e42260Aa2468885100dd',
};

function getSteps() {
  return ['Wallet & Limits', 'Fees & Admins', 'Additional Info', 'Review & Save', 'Deploy'];
}

function getButtonText(step) {
  switch(step) {
    case 0:
    case 1:
    case 2:
      return 'Continue';

    case 3:
      return 'Save & Continue';

    default:
      return 'Continue';
  }
}

function totalSteps() {
  return getSteps().length;
};

const formStyles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  button: {
   margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  numberField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 40
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  menu: {
    width: 200,
  },
});


/**
 * View to create a Pool
 *
 * @param id       URL parameter which is an id of a pool object
 */
class CreatePool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isSaving: false,
      formIsValid: false,
      pool: new Pool({
        owner: props.currentUser,
        ...poolData
      }),
      activeStep: 0,
      completed: {},
    };

    this.handleStateChange = this.handleStateChange.bind(this);
    this.handlePoolChange = this.handlePoolChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.submit = this.submit.bind(this);
    this.setImage = this.setImage.bind(this);
  }

  componentDidMount() {
    isAuthenticated(this.props.currentUser)
      .then(() => {
          this.setState({ isLoading: false });
      })
      .catch((err, anythingElse) => {
        console.log('err', err);
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
    console.log('pool', pool);
  }

  toggleFormValid(state) {
    this.setState({ formIsValid: state });
  }

  setImage(image) {
    const { pool } = this.state;
    pool.image = image;
    this.setState({ pool });
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

  handleStateChange = inputKey => event => {
    this.setState({ [inputKey]: event.target.value });
  }

  handlePoolChange = inputKey => event => {
    this.state.pool[inputKey] = event.target.value;
    this.setState({ pool: this.state.pool });
  }

  handleToggleChange = inputKey => event => {
    this.setState({ [inputKey]: event.target.checked });
  }

  handleListAddition = (inputKey, listKey) => event => {
    this.state.pool[listKey] = addToArray(this.state.pool[listKey], this.state[inputKey]);

    this.setState({
        [inputKey]: '',
        pool: this.state.pool
      });
  }

  removeItemFromList = (listKey, value) => () => {
    this.state.pool[listKey] = removeFromArray(this.state.pool[listKey], value);

    this.setState({
        pool: this.state.pool
    });
  }

  generateAddressList(listKey) {
    const AddressItem = ({value}) => {
      return (<ListItem>
        <ListItemText
          primary={value}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete" onClick={this.removeItemFromList(listKey, value)}>
            <CloseIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>)
    };
    return this.state.pool[listKey].map((value, index) => <AddressItem key={index} value={value} />
    );
  }

  async handleNext() {
    console.log('this.state.activeStep', this.state.activeStep);
    console.log('totalSteps()', totalSteps());
    if (this.state.activeStep === totalSteps() - 2 ) { //check validation
      const result = await feathersClient
        .service('pools')
        .create(this.state.pool.toFeathers())

      this.deployData = {
        ownerWallet: this.state.pool.ownerWallet,
        toAddress: this.state.pool.address,
        amount: this.state.pool.amount,
        txData: 'txData',
        gasLimit: 2000000
      }

    console.log('result', result);
      //
      // feathersClient
      //   .service('pools')
      //   .patch(pool.id, pool.toFeathers())
      //   .then(() => afterMined(`${etherScanUrl}address/${receipt.contractAddress}`));
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

  render() {
    const { isLoading, pool } = this.state;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div id="create-pool-view">
        {isLoading && <Loader className="fixed" />}
        {!isLoading && (
          <div>
            <div className="header">
              <div className="row">
                <section className="col-8 offset-2">
                  <h1 className="font-xl">Create Your Pool</h1>
                  <p className="font-m">Give your network some peace of mind</p>
                </section>
              </div>
            </div>
            <div className="container main-wrap">
              <div className="row">
                <div className="col-md-8">
                  <form noValidate autoComplete="off">
                    {
                      this.state.activeStep === 0 &&
                      <div>
                        <TextField
                          id="ownerWallet"
                          label="Wallet address"
                          value={pool.ownerWallet}
                          placeholder="Your wallet address"
                          onChange={this.handlePoolChange('ownerWallet')}
                          margin="normal"
                          fullWidth
                        />
                        <Grid container spacing={16} className='spacer-top-15'>
                          <Grid item md={3}>
                            <FormLabel className='spacer-top-40'>Limits</FormLabel>
                          </Grid>
                          <Grid item md={9} >
                              <div className='flex-wrap-between'>
                                <TextField
                                  id="maxAllocation"
                                  label="Net pool allocation"
                                  inputProps={{style: {width:"100%"}}}
                                  className={formStyles.textField}
                                  placeholder="Ξther amount"
                                  value={pool.maxAllocation}
                                  onChange={this.handlePoolChange('maxAllocation')}
                                  min="0"
                                  type= "number"
                                  margin="normal"
                                  fullWidth
                                />
                                <TextField
                                  id="minContribution"
                                  className={formStyles.textField}
                                  label="Min contribution"
                                  placeholder="Ξther amount"
                                  value={pool.minContribution}
                                  onChange={this.handlePoolChange('minContribution')}
                                  min="0"
                                  type= "number"
                                  margin="normal"
                                />
                                <TextField
                                  id="maxContribution"
                                  className={formStyles.textField}
                                  label="Max contribution"
                                  placeholder="Ξther amount"
                                  value={pool.maxContribution}
                                  onChange={this.handlePoolChange('maxContribution')}
                                  min="0"
                                  type= "number"
                                  margin="normal"
                                />
                              </div>
                          </Grid>
                        </Grid>
                      </div>
                    }
                    {
                      this.state.activeStep === 1 &&
                      <Grid container spacing={16}>
                        <Grid container>
                          <Grid item md={4}>
                            <TextField
                              id="fee"
                              label="Pool fee"
                              className={formStyles.numberField}
                              placeholder="0.0"
                              value={pool.fee}
                              onChange={this.handlePoolChange('fee')}
                              inputProps={{
                                min:"0",
                                step:"0.1"
                              }}
                              type= "number"
                              margin="normal"
                            />
                          </Grid>
                          <Grid item md={4}>
                            <div>Your fee <span className="underline">{pool.fee}%</span> + </div>
                            <div>PB fee <span className="underline">0.4%</span>  = </div>
                            <hr/>
                            <div><strong>Total fee <span className="underline">{(parseFloat(pool.fee) + 0.4).toFixed(2)}%</span> </strong></div>
                          </Grid>
                          <Grid item md={4}>
                            <FormControl component="fieldset" className={formStyles.formControl}>
                              <FormLabel component="legend">Fee payout currency</FormLabel>
                              <RadioGroup
                                aria-label="fee payout currency"
                                name="feePayoutCurrency"
                                className={formStyles.group}
                                value={pool.feePayoutCurrency}
                                onChange={this.handlePoolChange('feePayoutCurrency')}
                              >
                                <FormControlLabel value={Pool.CURRENCY_ETHER} control={<Radio color="primary" />} label="Ξther" />
                                <FormControlLabel value={Pool.CURRENCY_TOKEN} control={<Radio color="primary" />} label="Token" />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Divider />
                        <Divider />
                        <Grid container>
                          <Grid item md={6}>
                            <TextField
                            id="adminAddress"
                            label="Admin Address"
                            className={formStyles.textField}
                            placeholder="0x..."
                            value={this.state.adminAddress}
                            onChange={this.handleStateChange('adminAddress')}
                            type= "text"
                            margin="normal"
                            />
                            { (pool.adminAddresses && pool.adminAddresses.length < 6) &&
                              <Button variant="fab" mini color="primary" aria-label="add" className={formStyles.button} onClick={this.handleListAddition('adminAddress', 'adminAddresses')}>
                                <AddIcon/>
                              </Button>
                            }
                          </Grid>
                          <Grid item md={6}>
                            { pool.adminAddresses && !!pool.adminAddresses.length &&
                              <List dense>
                              {
                                this.generateAddressList( 'adminAddresses')
                              }
                              </List>
                            }
                          </Grid>
                        </Grid>
                        <hr/>
                        <Grid container>
                          <Grid item md={6}>
                            <FormLabel>Lock Destination</FormLabel>
                            <Switch
                              checked={this.state.lockDestination}
                              onChange={this.handleToggleChange('lockDestination')}
                              value="lockDestination"
                              color="primary"
                            />
                          </Grid>
                          <Grid item md={6}>
                            { this.state.lockDestination && <div>
                                <TextField
                                  id="payoutAddress"
                                  label="Destination Address"
                                  placeholder="0x..."
                                  value={pool.payoutAddress}
                                  onChange={this.handlePoolChange('payoutAddress')}
                                  type= "text"
                                  margin="normal"
                                  fullWidth
                                />
                                <TextField
                                  id="payoutAddressTxData"
                                  label="Transaction data"
                                  value={pool.payoutAddressTxData}
                                  onChange={this.handlePoolChange('payoutAddressTxData')}
                                  type= "text"
                                  margin="normal"
                                  fullWidth
                                />
                              </div>
                            }
                          </Grid>
                        </Grid>
                      </Grid>
                    }
                    {
                      this.state.activeStep === 2 &&
                      <div>
                        <TextField
                          id="name"
                          label="Pool name"
                          value={pool.name}
                          placeholder="Your pool's name"
                          onChange={this.handlePoolChange('name')}
                          margin="normal"
                          fullWidth
                        />
                        <TextField
                          id="description"
                          label="Pool description"
                          value={pool.description}
                          placeholder="Any additional info you have about your pool"
                          onChange={this.handlePoolChange('description')}
                          margin="normal"
                          fullWidth
                          multiline
                          rowsMax="6"
                        />
                      </div>
                    }
                    {
                      this.state.activeStep === 3 && <PoolReview pool={pool}></PoolReview>
                    }
                    {
                      this.state.activeStep === 4 && <DeployStep {...this.deployData}/>
                    }
                    { (activeStep < 4) &&
                      <div className="flex-end spacer-top-50 spacer-bottom-50">
                        <Button variant="contained" size="large" color="primary" onClick={this.handleNext}>
                          { getButtonText(activeStep)}
                        </Button>
                      </div>
                    }
                  </form>
                </div>
                <div className="col-md-3 offset-md-1">
                  <div className="steps-panel shadow-box">
                    <Stepper nonLinear activeStep={activeStep} orientation="vertical" >
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

CreatePool.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default CreatePool;
