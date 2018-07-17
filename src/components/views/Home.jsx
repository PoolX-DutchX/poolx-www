import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PillButton from '../PillButton.jsx';
import TeamCard from '../TeamCard.jsx';
import { teamList } from '../../constants';
import User from '../../models/User';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMobileMenu: false,
    };
  }
  render() {
    return (
        <div id="home-view">
          <div className="page-wrap">
            <div className="skew top-section bg-color-light box-shadow">
              <div className="skew-reset relative">
                <div className="container">
                  <div className="row">
                    <div className="col-sm-5 ">
                      <h1>Powered by the Ethereum blockchain!</h1>
                      <p>Pool digital currency today with the security of smart contracts</p>
                      <PillButton>
                        Create a Pool
                      </PillButton>
                    </div>
                    <div className="col-sm-7">
                      <img className="pb-screenshot" src="/img/screenshots.png" alt="Poolbase Screenshot"/>
                    </div>
                  </div>
                </div>
                <div className="bottom-banner">
                  <div className="skew2 cover-all bg-color-medium"></div>
                    <div className="relative">
                      <div className="container wallet-providers">
                        <a className="wallet-logo" href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                          <img src="/img/metamask-logo-white.png" height="60px" alt="Metamask logo" />
                        </a>
                        <a className="wallet-logo" href="https://mycrypto.com/" target="_blank" rel="noopener noreferrer">
                          <img src="/img/mycrypto-logo-white.png" height="60px" alt="My Crypto logo" />
                        </a>
                        <a className="wallet-logo" href="https://www.myetherwallet.com/" target="_blank" rel="noopener noreferrer">
                          <img src="/img/myetherwallet_logo_white.png" height="60px" alt="My Ether Wallet logo" />
                        </a>
                        <a className="wallet-logo" href="https://www.ethereum.org/" target="_blank" rel="noopener noreferrer">
                          <img src="/img/ethereum-logo-white.png" height="70px" alt="Ethereum.org" />
                        </a>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="section-wrap">
            </div>
            <div className="relative">
              <div className="skew cover-all bg-color-dark box-shadow"></div>
              <div className="relative">
                <div className="section-wrap"></div>
              </div>
            </div>
            <div className="section-wrap team-section container">
              <h2>The team</h2>
              <div className="card-wrap">
                {
                  teamList.map((memberDetails, index) => <TeamCard key={index} {...memberDetails}/>)
                }
              </div>
            </div>
            <div className="relative">
              <div className="skew cover-all bg-color-light box-shadow"></div>
              <div className="relative">
                <div className="section-wrap"></div>
              </div>
            </div>
            <footer className="bottom-section">
              <div className="relative">
                <div className="skew cover-all bg-color-dark box-shadow bottom-skew"></div>
                <div className="relative">
                  <div className="section-wrap">
                    <div className="container-fluid site-links">
                       <span>
                        <Link to="/">
                          <img src="/img/logo_white.svg" width="140px" alt="Poolbase logo" />
                        </Link>
                      </span>
                       <span>About</span>
                       <span>Support</span>
                       <span>Terms</span>
                       <span>
                        © PoolBase.com
                       </span>
                     </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
    )
  }
}

Home.propTypes = {
  currentUser: PropTypes.instanceOf(User),
  history: PropTypes.shape({}).isRequired,
};

Home.defaultProps = {
  currentUser: undefined
};

export default Home;
