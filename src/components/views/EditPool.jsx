import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputToken from 'react-input-token';
import moment from 'moment';
import 'react-input-token/lib/style.css';

import { Form, Input, Date } from 'formsy-react-components';
import { feathersClient } from '../../lib/feathersClient';
import Loader from '../Loader';
import QuillFormsy from '../QuillFormsy';
import SelectFormsy from './../SelectFormsy';
import FormsyImageUploader from './../FormsyImageUploader';
import GoBackButton from '../GoBackButton';
import { isOwner, getTruncatedText, history } from '../../lib/helpers';
import {
  isAuthenticated,
  checkWalletBalance,
  isInWhitelist,
  confirmBlockchainTransaction,
} from '../../lib/middleware';
import LoaderButton from '../../components/LoaderButton';
import User from '../../models/User';
import GivethWallet from '../../lib/blockchain/GivethWallet';
import Pool from '../../models/Pool';
import PoolService from '../../services/Pool';
import ErrorPopup from '../ErrorPopup';

/**
 * View to create or edit a Pool
 *
 * @param isNew    If set, component will load an empty model.
 *                 Otherwise component expects an id param and will load a pool object
 * @param id       URL parameter which is an id of a pool object
 * @param wallet   Wallet object with the balance and all keystores
 */
class EditPool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isSaving: false,
      formIsValid: false,
      dacsOptions: [],
      // hasWhitelist: React.whitelist.reviewerWhitelist.length > 0,
      // whitelistOptions: React.whitelist.projectOwnerWhitelist.map(r => ({
      //   value: r.address,
      //   title: `${r.name ? r.name : 'Anonymous user'} - ${r.address}`,
      // })),
      reviewers: [],
      // Pool model
      pool: new Pool({
        owner: props.currentUser,
        threshold: 200,
        tokenConversionRate: 15,
        title: 'TinderCoin Private Sale',
        description: 'Stuff and more stuff',
        tokenUrl: 'http://www.tindercoin.com',
        tokenName: 'Quantstramp',
        tokenSymbol: 'QSP',
      }),
    };

    this.submit = this.submit.bind(this);
    this.setImage = this.setImage.bind(this);
  }

  componentDidMount() {
    isAuthenticated(this.props.currentUser)
      // .then(() => isInWhitelist(this.props.currentUser, React.whitelist.projectOwnerWhitelist))
      // .then(() => checkWalletBalance(this.props.wallet))
      .then(() => {
        // Load this Pool
        if (!this.props.isNew) {
          PoolService.get(this.props.match.params.id)
            .then(pool => {
              if (isOwner(pool.owner.address, this.props.currentUser)) {
                this.setState({ pool, isLoading: false });
              } else history.goBack();
            })
            .catch(() => err => {
              this.setState({ isLoading: false });
              ErrorPopup(
                'There has been a problem loading the Pool. Please refresh the page and try again.',
                err,
              );
            });
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch((err, anythingElse) => {
        console.log('err', err);
      });
  }

  componentWillUnmount() {}

  submit() {
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

  toggleFormValid(state) {
    this.setState({ formIsValid: state });
  }

  setImage(image) {
    const { pool } = this.state;
    console.log('image', image);
    pool.image = image;
    this.setState({ pool });
  }

  render() {
    const { isNew } = this.props;
    const { isLoading, isSaving, pool, formIsValid } = this.state;

    return (
      <div id="edit-pool-view">
        <div className="container-fluid page-layout edit-view">
          <div>
            <div className="col-md-8 m-auto">
              {isLoading && <Loader className="fixed" />}

              {!isLoading && (
                <div>
                  <GoBackButton history={history} />

                  <div className="form-header">
                    {isNew && <h3>Start a pool!</h3>}

                    {!isNew && <h3>Edit pool {pool.title}</h3>}
                    <p>
                      <i className="fa fa-question-circle" />
                      Go ahead and fill out this form to get started on launching your ico presale
                      pool
                    </p>
                  </div>

                  <Form
                    onSubmit={this.submit}
                    mapping={inputs => {
                      console.log('inputs.closeDate', inputs.closeDate);
                      pool.threshold = parseInt(inputs.threshold);
                      pool.closeDate = moment(inputs.closeDate, 'YYYY-MM-DD').unix();
                      pool.tokenConversionRate = parseInt(inputs.tokenConversionRate);
                      pool.title = inputs.title;
                      pool.description = inputs.description;
                      pool.tokenUrl = inputs.tokenUrl;
                      pool.tokenName = inputs.tokenName;
                      pool.tokenSymbol = inputs.tokenSymbol;
                    }}
                    onValid={() => this.toggleFormValid(true)}
                    onInvalid={() => this.toggleFormValid(false)}
                    layout="vertical"
                  >
                    <Input
                      name="title"
                      id="title-input"
                      label="What's the name of your pool'?"
                      type="text"
                      value={pool.title}
                      placeholder="E.g. TinderCoin Private Sale"
                      validations="minLength:3"
                      validationErrors={{
                        minLength: 'Please provide at least 3 characters.',
                      }}
                      required
                      autoFocus
                    />
                    <QuillFormsy
                      name="description"
                      label="Explain how the pool is going to proceed."
                      helpText="Make it as extensive as necessary.
                      Your goal is to build trust, so that people donate Ether to your pool."
                      value={pool.description}
                      placeholder="Describe how you're pool is going to proceed...."
                      validations="minLength:20"
                      help="Describe your pool."
                      validationErrors={{
                        minLength: 'Please provide at least 10 characters.',
                      }}
                    />
                    <div className="form-group">
                      <FormsyImageUploader setImage={this.setImage} previewImage={pool.image} />
                    </div>
                    <div className="form-group">
                      <Input
                        name="tokenUrl"
                        id="token-url"
                        label="Url for token sale."
                        type="text"
                        value={pool.tokenUrl}
                        placeholder="https://golem.network"
                        help="Where can people read about the token sale? Poolbase redirects people there."
                        validations="isUrl"
                        validationErrors={{ isUrl: 'Please provide a url.' }}
                      />
                    </div>
                    <div className="form-group">
                      <Input
                        name="tokenName"
                        id="token-name-input"
                        label="Token Name"
                        type="text"
                        value={pool.tokenName}
                        placeholder={pool.title}
                        help="The name of the token that contributers will receive when they
                        donate to this Pool."
                        validations="minLength:3"
                        validationErrors={{
                          minLength: 'Please provide at least 3 characters.',
                        }}
                        disabled={!isNew}
                      />
                    </div>
                    <div className="form-group">
                      <Input
                        name="tokenSymbol"
                        id="token-symbol-input"
                        label="Token Symbol"
                        type="text"
                        value={pool.tokenSymbol}
                        help="The symbol of the token that contributers will receive when
                        they donate to this pool."
                        validations="minLength:2"
                        validationErrors={{
                          minLength: 'Please provide at least 2 characters.',
                        }}
                        disabled={!isNew}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor>
                        Closing date of pool
                        <Input
                          name="closeDate"
                          id="closeDate"
                          value={pool.closeDate}
                          type="date"
                          placeholder="yyyy-mm-dd"
                        />
                      </label>
                    </div>
                    <div className="form-group">
                      <Input
                        name="threshold"
                        id="threshold"
                        label="Minimum amount of Ether for pool to be realized"
                        type="number"
                        value={pool.threshold}
                        placeholder="amount in Ether"
                      />
                    </div>
                    <div className="form-group">
                      <Input
                        name="tokenConversionRate"
                        id="tokenConversionRate"
                        label="Number of tokens per Ether to be redeemed"
                        type="number"
                        value={pool.tokenConversionRate}
                        placeholder="Redeemable Tokens per Ether"
                      />
                    </div>
                    <div className="form-group row">
                      <div className="col-md-6">
                        <GoBackButton history={history} />
                      </div>
                      <div className="col-md-6">
                        <LoaderButton
                          className="btn btn-success pull-right"
                          formNoValidate
                          type="submit"
                          disabled={isSaving || !formIsValid}
                          isLoading={isSaving}
                          loadingText="Saving..."
                        >
                          {isNew ? 'Create' : 'Update'} your pool
                        </LoaderButton>
                      </div>
                    </div>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditPool.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  isNew: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

EditPool.defaultProps = {
  isNew: false,
};

export default EditPool;
