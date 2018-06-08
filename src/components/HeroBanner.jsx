import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

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
    if (this.props.currentUser) {
      this.props.history.push('/pools/new');
    } else {
      React.swal({
        title: "You're almost there...",
        content: React.swal.msg(
          <p>
            It&#8217;s great to see that you want to start a pool. To get started, please
            sign up (or sign in) first.
          </p>,
        ),
        icon: 'info',
        buttons: ['Cancel', 'Sign up now!'],
      }).then(isConfirmed => {
        if (isConfirmed) this.props.history.push('/signin');
      });
    }
  }

  render() {
    return (
      <div id="hero-banner">
        <div className="vertical-align">
          <center>
            <h3>Your ICO pooling destination!</h3>
            &nbsp;
            {this.state.canCreatePool && (
              <Button variant="contained" onClick={this.createPool}>
                Create a Pool
              </Button>
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
