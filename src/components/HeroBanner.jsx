import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CommunityButton from './CommunityButton';
import User from '../models/User';
import { takeActionAfterWalletUnlock, checkWalletBalance, isInWhitelist } from '../lib/middleware';
import GivethWallet from '../lib/blockchain/GivethWallet';

/**
 * The join Giveth community top-bar
 */
class HeroBanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canCreatePool: true
    };

    this.createPool = this.createPool.bind(this);
  }

  componentDidMount() {
    // isInWhitelist(this.props.currentUser, React.whitelist.delegateWhitelist)
    //   .then(() => this.setState({ canCreatePool: true }))
    //   .catch(() => {}); // nothing
  }

  createPool() {
    isInWhitelist(this.props.currentUser, React.whitelist.projectOwnerWhitelist)
      .then(() => {
        if (this.props.currentUser) {
          takeActionAfterWalletUnlock(this.props.wallet, () => {
            checkWalletBalance(this.props.wallet).then(() => {
              this.props.history.push('/campaigns/new');
            });
          });
        } else {
          React.swal({
            title: "You're almost there...",
            content: React.swal.msg(
              <p>
                It&#8217;s great to see that you want to start a campaign. To get started, please
                sign up (or sign in) first.
              </p>,
            ),
            icon: 'info',
            buttons: ['Cancel', 'Sign up now!'],
          }).then(isConfirmed => {
            if (isConfirmed) this.props.history.push('/signup');
          });
        }
      })
      .catch(() => {
        React.swal({
          title: 'Sorry, Giveth is in beta...',
          content: React.swal.msg(
            <p>
              It&#8217;s great to see that you want to start a campaign, however, Giveth is still in
              alpha and we only allow a select group of people to start campaigns<br />
              Please <strong>contact us on our Slack</strong>, or keep browsing
            </p>,
          ),
          icon: 'info',
          buttons: [false, 'Got it'],
        });
      });
  }

  render() {
    return (
      <div id="hero-banner">
        <div className="vertical-align">
          <center>
            <h3>Let's make some money boys!</h3>
            &nbsp;
            {this.state.canCreatePool && (
              <button className="btn btn-info" onClick={() => this.createPool()}>
                Create a Pool
              </button>
            )}
          </center>
        </div>
      </div>
    );
  }
}

export default HeroBanner;

HeroBanner.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
  wallet: PropTypes.instanceOf(GivethWallet),
};

HeroBanner.defaultProps = {
  wallet: undefined,
  currentUser: undefined,
};
