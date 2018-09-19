import React from 'react';
import { Formik } from 'formik';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';


class MultiStepForm extends React.Component {
  static Step = ({ children }) => children;

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      values: props.initialValues,
      completed: {}
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  next = values => {
    window.scrollTo(0, 0);
    this.setState(state => ({
      step: Math.min(state.step + 1, this.props.children.length - 1),
      values,
    }));
  }

  handleStep = (step) => {
    return () => {
      console.log('step', step);
    };
  };

  previous = () => {
    window.scrollTo(0, 0);
    this.setState(state => ({
      step: Math.max(state.step - 1, 0),
    }));
  }
  
  handleSubmit = (values, bag) => {
    const { children, onSubmit } = this.props;
    const { step } = this.state;
    const isLastStep = step === React.Children.count(children) - 1;
    console.log('step', step);
    console.log('isLastStep', isLastStep);
    if (isLastStep) {
      return onSubmit(values);
    } else {
      this.next(values);
      bag.resetForm()
      // bag.setSubmitting(false);
    }
  };

  render() {
    const { children, header, validationSchemas, stepLabels } = this.props;
    const { step, values } = this.state;
    const activeStep = React.Children.toArray(children)[step];
    const isLastStep = step === React.Children.count(children) - 1;

    return (
      <div id="multi-step-form">
        <div className="header">
          <div className="row">
            <section className="col-8 offset-2">
              {header}
            </section>
          </div>
        </div>
        {/*ToDo: need to conjoin all schemas on last step*/}
        <div className="container main-wrap">
          <div className="row">
            <div className="col-md-9">
              <Formik
                initialValues={values}
                enableReinitialize={false}
                validationSchema={validationSchemas[step]}
                onSubmit={this.handleSubmit}
                render={(formikProps) => {
                  console.log('activeStep', activeStep);
                  const activeStepWithFormikProps = React.cloneElement(activeStep, {formik: formikProps});
                  const { handleSubmit, isSubmitting } = formikProps;
                  return (
                    <form onSubmit={handleSubmit} noValidate>
                      {activeStepWithFormikProps}
                      <div className="d-flex justify-content-between spacer-top-50 spacer-bottom-50">
                        { step > 0 && (
                          <div className="flex-start">
                            <Button type="button" variant="outlined" size="large" onClick={this.previous}>
                              Back
                            </Button>
                          </div>
                        )}
                        <div className="ml-auto">
                          <Button type="submit" variant="contained" size="large" color="primary" disabled={isSubmitting}>
                            {isLastStep ? 'Submit' : 'Continue'}
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                } />
            </div>
            <div className="col-md-3">
              <div className="steps-panel shadow-box">
                <Stepper activeStep={step} orientation="vertical" >
                  {stepLabels.map((label, index) => {
                    return (
                      <Step key={index}>
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
    );
  }
}


export default MultiStepForm;
