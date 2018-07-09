import React, {Component} from 'react';
import PropTypes from 'prop-types';
import User from '../../models/User';

import HeroBanner from '../HeroBanner';

import HomeViewCss from '../../styles/_homeView.scss'

// const Home = ({ currentUser, history }) => (
//   <div id="home-view-background">
//     {/* <HeroBanner currentUser={currentUser} history={history} /> */}
//     <div className="container-fluid page-layout reduced-padding">



//     </div>
//   </div>
// );

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
        {/* <HeroBanner currentUser={currentUser} history={history} /> */}
          <div className="page-wrap">
            <section className="section-1">
              <div className="inner-wrap">
                <div className="d-flex justify-content-center">
                  <ul className="col-md-4 list-group clean-list">
                    <li><h3>Poolbase. An app your users will love</h3></li>
                    <li><p>Poolbase is an app which allows its users to pool money together to invest in hot new ICOs</p></li>
                    <li><button className="button-style">Signup For Poolbase</button></li>
                    <li>Login with Github</li>
                  </ul>
                    <img src="https://www.gitbook.com/public/images/adb1b3a77d092d0cb1bccc7a42b94625.png" alt="Signup Image" height ="310" width = "475"/>
                </div>
                <div className="bottom-banner reset-wrap">
                  <div className="skew"></div>
                  <div className="reset-wrap">
                    <div className="container wallet-providers">
                      <a className="wallet-logo" href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                        <img src="/img/metamask-logo.svg" width="90px" alt="Metamask logo" />
                      </a>
                      <a className="wallet-logo" href="https://mycrypto.com/" target="_blank" rel="noopener noreferrer">
                        <img src="/img/mycrypto-logo.png" width="90px" alt="My Crypto logo" />
                      </a>
                      <a className="wallet-logo" href="https://www.myetherwallet.com/" target="_blank" rel="noopener noreferrer">
                        <img src="/img/myetherwallet-logo.png" width="90px" alt="My Ether Wallet logo" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="section-2">
              
            </section>

            <div className = "footer">
                <ul className = "spaced-lists">
                  <li>Poolbase</li>
                  <li>Pricing</li>
                  <li>About</li>
                  <li>Documentation</li>
                  <li>Terms</li>
                </ul>
                <ul>
                  <li>Poolbase.com</li>
                </ul>
            </div>
          </div>
        </div>



// {/* <div className="dark-blue-background"></div> */}
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
