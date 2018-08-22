import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Loader from '../Loader';
import WithTooltip from '../WithTooltip';

import User from '../../models/User';
import PoolService from '../../services/Pool';
import PoolModel from '../../models/Pool';
import ContributionService from '../../services/Contribution';
import { feathersClient } from '../../lib/feathersClient';


import ErrorPopup from '../ErrorPopup';

class ViewPool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contributions: [],
    };
    this.contribute = this.contribute.bind(this);
  }

  async componentDidMount() {
    const poolId = this.props.match.params.poolId;
    console.log('poolId', poolId);
    try {
      // const updatedPool = await feathersClient.service('pools').patch(poolId,{
      //   status: 'pending_close_pool',
      //   payoutTxData: '0x5aa26c0ede1f5fc31fe8e266bdcdc1b8a6ac47d7'
      // });
      // console.log('updatedPool', updatedPool);

      let contributions = [];
      const pool = await PoolService.getById(poolId);
      console.log('pool', pool);
      if (this.props.currentUser) {
        console.log('this.props.currentUser', this.props.currentUser);
        const { data } = await ContributionService.getUserContributionsByPoolId(this.props.currentUser.id, poolId);
        contributions = data;
      }
      this.setState({ pool, contributions, isLoading: false });
    } catch (err) {
      console.log('err', err);
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

  contribute() {
    const { history } = this.props;
    if (!this.props.currentUser) {
      React.swal({
        title: "You're almost there...",
        content: React.swal.msg(
          <p>
            It&#8217;s great to see that you want to contribute, however, if you first sign in or sign up, you'll get the benefit of tracking your contributions after they're made. <br />
            <br />
            You can also continue anonymously.
          </p>,
        ),
        icon: 'info',
        buttons: {
          signin: {
            text: 'Signin'
          },
          signup: {
            text: 'Signup'
          },
          continue: {
            text: 'Continue'
          }

        },
      }).then(value => {
        switch(value) {
          case 'signin':
            history.push('/signin');
            break;
          case 'signup':
            history.push('/signup');
            break;
          case 'continue':
            history.push(`/pools/${this.state.pool.id}/contribute`);
            break;
          default:
            break;
        }
      });
    } else {
      history.push(`/pools/${this.state.pool.id}/contribute`)
    }
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
      poolProgress = (pool.netInvested / pool.maxAllocation) * 100;
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
                {
                  !!this.state.contributions.length &&
                  <div className="alert alert-success row my-contributions-panel" role="alert">
                    <div className="col-md-4 ">
                      <h6><WithTooltip title="Sum total of all your contributions for this pool">My Contribution</WithTooltip></h6>
                      <h2>20 Eth</h2>
                    </div>
                    <div className="col-md-8 ">
                      <h6>My Transactions</h6>
                      {
                        this.state.contributions.map((contribution, index) => <div key={index}>Deposit {contribution.amount} Eth</div> )
                      }
                    </div>
                  </div>
                }
                <p className="info-disclaimer">The following information is provided by the pool creator</p>
                <p>{pool.description}</p>
              </div>
              <div className="col-md-5 pool-action-panel">
                <h3><strong>{pool.status}</strong></h3>
                <LinearProgress variant="determinate" value={poolProgress} />
                <div className="total-invested-section">
                  <h4 className="invested"><strong>{pool.netInvested} ETH </strong></h4>
                  <div className="subheading">
                    of {pool.maxAllocation} ETH maximum
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
                <Button variant="contained"
                  color="primary"
                  fullWidth
                  onClick={this.contribute}
                  disabled={pool.status !== PoolModel.ACTIVE}>
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
      poolId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

ViewPool.defaultProps = {
  currentUser: undefined,
};

export default ViewPool;
