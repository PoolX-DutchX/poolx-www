import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { withStyles } from '@material-ui/core/styles';

import { feathersClient } from '../../lib/feathersClient';
import Loader from '../Loader';
import GoBackButton from '../GoBackButton';
import { isOwner, getUserName, getUserAvatar } from '../../lib/helpers';
import { checkWalletBalance } from '../../lib/middleware';

import AuthenticatedLink from '../AuthenticatedLink';

import User from '../../models/User';
import PoolService from '../../services/Pool';

import ErrorPopup from '../ErrorPopup';

/**
 * The Campaign detail view mapped to /campaing/id
 *
 * @param currentUser  Currently logged in user information
 * @param history      Browser history object
 * @param wallet       Wallet object with the balance and all keystores
 */
//  const iconClasses = theme => ({
//   button: {
//     height: '30px',
//     verticalAlign: 'text-top',
//     width: '30px'
//   }
// });
//  const RefreshIconButton = ({classes}) => {
//    <IconButton className={classes.button}><AutorenewIcon/></IconButton>
//  }
//
// const RefreshIcon = withStyles(iconClasses)(RefreshIconButton);

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

    // Lazy load donations
    // this.donationsObserver = PoolService.subscribeDonations(
    //   poolId,
    //   donations =>
    //     this.setState({
    //       donations,
    //       isLoadingDonations: false,
    //     }),
    //   () => this.setState({ isLoadingDonations: false }),
    // );
  }

  componentWillUnmount() {
    // this.donationsObserver.unsubscribe();
  }

  render() {
    const { history, currentUser } = this.props;
    const {
      isLoading,
      pool
    } = this.state;

    let poolProgress = 0;
    if (!isLoading) {
      poolProgress = (pool.totalInvested / pool.cap) * 100;
    }

    console.log('pool', pool);
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
                <Button variant="contained" color="primary" fullWidth>
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
                <div class="row justify-content-start">
                  <div class="col">
                    Whitelist <strong>Off</strong>
                  </div>
                  <div class="col-md-auto">
                    Autodistribution <strong>On</strong>
                  </div>
                  <div class="col">
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
