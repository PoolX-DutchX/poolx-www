import React, { Component } from 'react';
import PropTypes from 'prop-types';

import User from '../../../models/User';
import Pool from '../../../models/Pool';
import PoolService from '../../../services/Pool';

import * as Yup from 'yup';

import MultiStepForm from '../../MultiStepForm';

import Loader from '../../Loader';
import { history, isPoolAdmin } from '../../../lib/helpers';
import { isAuthenticated } from '../../../lib/middleware';
import { ethereumAddress } from '../../../lib/validators';
import validationSchemas from './validation/';
import updateComponents from './components/';

/**
 * View flow to confirm a token batch
 *
 * @param id       URL parameter which is an id of a pool object
 */

const Header = ({ text }) => {
  return (
    <div>
      <h1 className="font-xl">{text}</h1>
    </div>
  );
};

const textMap = {
  maxAllocation: {
    stepLabel: 'Max allocation',
    header: 'Set Max allocation for Pool',
  },
  fee: {
    stepLabel: 'Admin fee',
    header: 'Set your Admin Fee',
  },
  adminPayoutAddress: {
    stepLabel: 'Admin payout wallet',
    header: 'Set your Admin payout wallet',
  },
};

class Update extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      pool: {},
      formProps: {},
    };
  }

  async componentDidMount() {
    const { currentUser, match: { params: { poolId } }, location: { hash } } = this.props;

    const updateProperty = hash && hash.substr(1);

    try {
      await isAuthenticated(currentUser);

      const pool = await PoolService.getById(poolId);
      // check status of pool & redirect if not appropriate
      if (!isPoolAdmin(pool, currentUser) || !updateProperty) {
        history.replace(`/pools/${pool._id}`);
      }

      let formProps = {};
      if (['maxAllocation', 'fee', 'adminPayoutAddress'].includes(updateProperty)) {
        formProps = {
          validationSchema: validationSchemas[updateProperty](pool),
          initialValues: {
            [updateProperty]: pool[updateProperty],
          },
          UpdateComponent: updateComponents[updateProperty],
          stepLabel: textMap[updateProperty].stepLabel,
          headerText: textMap[updateProperty].header,
        };
      } else {
        return history.replace(`/pools/${pool._id}`);
      }

      this.setState({
        isLoading: false,
        pool,
        formProps,
        updateProperty,
      });
    } catch (err) {
      console.log('err', err);
      //oops something wrong
    }
  }

  render() {
    const {
      isLoading,
      pool,
      formProps: { initialValues, UpdateComponent, validationSchema, stepLabel, headerText },
    } = this.state;

    return (
      <div>
        {isLoading && <Loader className="fixed" />}
        {!isLoading && (
          <MultiStepForm
            header={<Header text={headerText} />}
            initialValues={initialValues}
            stepLabels={[stepLabel, 'Perform transaction']}
            onSubmit={(values, actions) => {
              const { updateProperty } = this.state;
              console.log('updateProperty', updateProperty);
              PoolService.patch(this.state.pool.id, {
                [updateProperty]: values[updateProperty],
              }).then(() => {
                history.push(`/pools/${this.state.pool.id}/pendingTx`);
              });
            }}
            validationSchemas={[validationSchema]}
          >
            <UpdateComponent />
          </MultiStepForm>
        )}
      </div>
    );
  }
}

Update.propTypes = {
  currentUser: PropTypes.instanceOf(User),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Update;
