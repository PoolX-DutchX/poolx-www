import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Loader from '../Loader';

import User from '../../models/User';
import PoolService from '../../services/Pool';

import ErrorPopup from '../ErrorPopup';

class ViewPool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    const poolId = this.props.match.params.poolId;
    try {
      const pool = await PoolService.get(poolId);
      this.setState({ pool, isLoading: false });
    } catch (err) {
      ErrorPopup('Something went wrong loading pool. Please try refresh the page.', err);
      this.setState({ isLoading: false });
    }

    // Lazy load contributions
    // this.contributionObserver = PoolService.subscribeContributions(
    //   poolId,
    //   contributions =>
    //     this.setState({
    //       contributions,
    //       isLoadingDonations: false,
    //     }),
    //   () => this.setState({ isLoadingContributions: false }),
    // );
  }

  componentWillUnmount() {
    // this.contributionObserver.unsubscribe();
  }

  render() {
    const {
      isLoading,
      pool
    } = this.state;

    let poolProgress = 0;
    if (!isLoading) {
      poolProgress = (pool.totalInvested / pool.cap) * 100;
    }

    return (
      <div id="view-pool-view" className="container">
        {isLoading && <Loader className="fixed" />}

        {!isLoading && (
          <div>
            <div className="row justify-content-between">
              <div className="col-md-6 ">
                <h1><strong>{pool.name}</strong></h1>
                <div className="pool-creator">Pool Creator Verified <img src={"/img/telegram_logo.png"} width="20" alt="Telegram logo"/> KYC</div>
                <p className="info-disclaimer">The following information is provided by the pool creator</p>
                <p>{pool.description}</p>
              </div>
              <div className="col-md-5 pool-action-panel">
                <h3><strong>{pool.status}</strong></h3>
                <LinearProgress variant="determinate" value={poolProgress} />
                <div className="total-invested-section">
                  <h4 className="invested"><strong>{pool.totalInvested} ETH </strong></h4>
                  <div className="subheading">
                    of {pool.cap} ETH maximum
                  </div>
                </div>
                <div className="min-max-section">
                  <span>
                    <h4><strong>{pool.minContribution} ETH </strong></h4>
                    <div className="subheading">Min. Contribution</div>
                  </span>
                  <span>
                    <h4><strong>{pool.maxContribution} ETH </strong></h4>
                    <div className="subheading">Max. Contribution</div>
                  </span>
                </div>
                <Button variant="contained" color="primary" fullWidth onClick={()=> (this.props.history.push(`/pools/contribute/${this.state.pool.id}`))}>
                  Contribute to Pool
                </Button>
                <div className="row margin-top-bottom">
                  <div className="col">
                    <Button variant="outlined" fullWidth>
                      Withdraw
                    </Button>
                  </div>
                  <div className="col">
                    <Button variant="outlined" fullWidth>
                      Bookmark
                    </Button>
                  </div>
                </div>
                <div className="row justify-content-start">
                  <div className="col">
                    Whitelist <strong>Off</strong>
                  </div>
                  <div className="col-md-auto">
                    Autodistribution <strong>On</strong>
                  </div>
                  <div className="col">
                    Fee <strong>{pool.fee}%</strong>
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

ViewPool.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

ViewPool.defaultProps = {
  currentUser: undefined,
};

export default ViewPool;
