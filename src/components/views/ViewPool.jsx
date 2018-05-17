import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';

import { feathersClient } from '../../lib/feathersClient';
import Loader from '../Loader';
import GoBackButton from '../GoBackButton';
import { isOwner, getUserName, getUserAvatar } from '../../lib/helpers';
import { checkWalletBalance } from '../../lib/middleware';
import BackgroundImageHeader from '../BackgroundImageHeader';
import DonateButton from '../DonateButton';
import ShowTypeDonations from '../ShowTypeDonations';
import AuthenticatedLink from '../AuthenticatedLink';

import User from '../../models/User';
import GivethWallet from '../../lib/blockchain/GivethWallet';
import PoolService from '../../services/Pool';

import ErrorPopup from '../ErrorPopup';

/**
 * The Campaign detail view mapped to /campaing/id
 *
 * @param currentUser  Currently logged in user information
 * @param history      Browser history object
 * @param wallet       Wallet object with the balance and all keystores
 */
class ViewPool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isLoadingMilestones: true,
      isLoadingDonations: true,
      donations: [],
      milestones: [],
    };
  }

  componentDidMount() {
    const poolId = this.props.match.params.id;

    PoolService.get(poolId)
      .then(pool => this.setState({ pool, isLoading: false }))
      .catch(err => {
        ErrorPopup('Something went wrong loading pool. Please try refresh the page.', err);
        this.setState({ isLoading: false });
      }); // TODO: inform user of error


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
      pool,
      // donations,
      // isLoadingDonations,
    } = this.state;
    console.log('pool', pool);
    // <DonateButton
    //   type="pool"
    //   model={{
    //     title: pool.title,
    //     id: pool.id,
    //     adminId: pool.projectId,
    //   }}
    //   wallet={wallet}
    //   currentUser={currentUser}
    //   history={history}
    // />

    // <div className="row spacer-top-50 spacer-bottom-50">
    //   <div className="col-md-8 m-auto">
    //     <h4>Donations</h4>
    //     <ShowTypeDonations donations={donations} isLoading={isLoadingDonations} />
    //     <DonateButton
    //       type="campaign"
    //       model={{
    //         title: campaign.title,
    //         id: campaign.id,
    //         adminId: campaign.projectId,
    //       }}
    //       wallet={wallet}
    //       currentUser={currentUser}
    //       history={history}
    //     />
    //   </div>
    // </div>
    //
    //
    return (
      <div id="view-campaign-view">
        {isLoading && <Loader className="fixed" />}

        {!isLoading && (
          <div>
            <BackgroundImageHeader image={pool.image} height={300}>
              <h6>Pool</h6>
              <h1>{pool.title}</h1>
              <h3>Total ether needed: {pool.threshold}</h3>
              <h3>Tokens per Ether: {pool.tokenConversionRate}</h3>
              <h3>Close date: {moment.unix(pool.closeDate).format("MM/DD/YYYY")}</h3>

              <button>Invest</button>
            </BackgroundImageHeader>

            <div className="container-fluid">
              <div className="row">
                <div className="col-md-8 m-auto">
                  <GoBackButton history={history} />

                  <center>
                    <Link to={`/profile/${pool.owner.address}`}>
                      <Avatar size={50} src={getUserAvatar(pool.owner)} round />
                      <p className="small">{getUserName(pool.owner)}</p>
                    </Link>
                  </center>

                  <div className="card content-card ">
                    <div className="card-body content">{ReactHtmlParser(pool.description)}</div>
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
  }).isRequired
};

ViewPool.defaultProps = {
  currentUser: undefined
};

export default ViewPool;
