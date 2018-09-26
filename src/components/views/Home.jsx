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
      workflowSwitch: true
    };

    this.preloadPics = [
      'https://www.paypalobjects.com/digitalassets/c/website/marketing/emea/de/de/home/de-buyonline-browser1.png',
      'https://www.paypalobjects.com/digitalassets/c/website/marketing/emea/de/de/home/de-sellonline-browser2.png'
    ];

    this.footerSocial = [
        ['fa-github', 'http://website1.com'],
        ['fa-twitter', 'http://website2.com'],
        ['fa-facebook', 'http://website3.com'],
        ['fa-medium', 'http://website4.com'],
        ['fa-reddit-alien', 'http://website5.com'],
        ['fa-instagram', 'http://website6.com'],
        ['fa-youtube', 'http://website7.com'],
        ['fa-telegram', 'http://website8.com'],
        ['fa-linkedin', 'http://website9.com']
    ];
  }


  componentDidMount() {
    this.preloadPics.forEach(picture => {
      const img = new Image();
      img.src = picture;
    });
  }


  render() {
    return (
        <div id="home-view">
          <div className="page-wrap">

            <div className="top-section bg-color-light box-shadow">
              <div className="relative">
                <div className="container">
                  <div className="row">
                    <div className="col-sm-5 ">
                      <h1>Powered by the Ethereum blockchain!</h1>
                      <p>Pool digital currency today with the security of smart contracts</p>
                      <PillButton onClick={()=> this.props.history.push('/pools/create')}>
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


            <section className="workflow-section">
              <h2>That's how PoolBase works</h2>

              <div className="switch">
                <span className={this.state.workflowSwitch ? 'active' : ''}
                  onClick={() => this.setState({workflowSwitch: true})}>
                  For investors
                </span>
                <span className={!this.state.workflowSwitch ? 'active' : ''}
                  onClick={() => this.setState({workflowSwitch: false})}>
                  For pool creators
                </span>
              </div>

              {this.state.workflowSwitch &&
                <div>
                  <div className="steps container">
                    <div className="row">
                      <div className="col-md-4">
                        <img src="https://www.paypalobjects.com/digitalassets/c/website/marketing/emea/de/de/home/de-buyonline-browser1.png" alt="" />
                        <span className="arrow" />
                        <div className="content">
                          <div className="circle">1</div>
                          <p><a href="">Sign up</a> completely free with your e-mail address and your password.</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <img src="https://www.paypalobjects.com/digitalassets/c/website/marketing/emea/de/de/home/de-buyonline-browser1.png" alt="" />
                        <span className="arrow" />
                        <div className="content">
                          <div className="circle">2</div>
                          <p>Perform a KYC if that is required by the pool. Choose the pool you want to participate in.</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <img src="https://www.paypalobjects.com/digitalassets/c/website/marketing/emea/de/de/home/de-buyonline-browser1.png" alt="" />
                        <div className="content">
                          <div className="circle">3</div>
                          <p>Follow the steps on the &quot;Participate in a pool&quot; page. It&apos; easy to use.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="learn-more">
                    <a href="http://website1.com">Learn More</a>
                  </div>
                </div>
              }

              {!this.state.workflowSwitch &&
                <div>
                  <div className="steps container">
                    <div className="row">
                      <div className="col-md-4">
                        <img src="https://www.paypalobjects.com/digitalassets/c/website/marketing/emea/de/de/home/de-sellonline-browser2.png" alt="" />
                        <span className="arrow" />
                        <div className="content">
                          <div className="circle">1</div>
                          <p><a href="">Sign up</a> completely free with your e-mail address and your password.</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <img src="https://www.paypalobjects.com/digitalassets/c/website/marketing/emea/de/de/home/de-sellonline-browser2.png" alt="" />
                        <span className="arrow" />
                        <div className="content">
                          <div className="circle">2</div>
                          <p>Perform a KYC if that is required by the pool. Choose the pool you want to participate in.</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <img src="https://www.paypalobjects.com/digitalassets/c/website/marketing/emea/de/de/home/de-sellonline-browser2.png" alt="" />
                        <div className="content">
                          <div className="circle">3</div>
                          <p>Follow the steps on the &quot;Participate in a pool&quot; page. It&apos; easy to use.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="learn-more">
                    <a href="http://website2.com">Learn More</a>
                  </div>
                </div>
              }
            </section>


            <section className="advantages-section four-columns">
              <h2>That speaks for PoolBase</h2>
              <div className="container">
                <div className="row">
                  <div className="col-sm-6 col-md-3">
                    <h4>More security</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet finibus nisl. Morbi sagittis sapien ut nibh ultricies faucibus. Morbi sit amet metus ligula. Praesent sed tempor nibh, non eleifend augue.</p>
                    <p><a href="">Read more about security</a></p>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <h4>Quick and easy to use</h4>
                    <p>Curabitur sed lorem tellus. Suspendisse ultricies justo vel purus fermentum viverra. Vivamus tellus est, sagittis a mattis in, vestibulum eget odio. Duis luctus sapien ligula, a porta orci egestas non.</p>
                    <p><a href="">Create your Pool</a></p>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <h4>Low cost</h4>
                    <p>Pellentesque quis dolor pharetra nibh ullamcorper vulputate a sed odio. Donec sagittis convallis tincidunt. Donec volutpat dictum lacus a fringilla. Praesent convallis nec sapien sed eleifend.</p>
                    <p><a href="">Read about the fees</a></p>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <h4>Transparent as the code</h4>
                    <p>Quisque placerat lectus quis dictum ultricies. Praesent consequat, tortor ut scelerisque aliquet, enim libero imperdiet felis, vel luctus orci magna a ligula.</p>
                    <p><a href="">Read more about our product</a></p>
                  </div>
                </div>
              </div>
            </section>


            <section className="team-section four-columns">
              <h2>The team</h2>
              <div className="container">
                <div className="row">
                  {teamList.map((memberDetails, index) => <TeamCard key={index} {...memberDetails} />)}
                </div>
              </div>
            </section>


            <footer id="footer">
              <div className="menu container-fluid four-columns">
                <div className="row">
                  <div className="col-sm-6 col-md-3">
                    <h4>Get started</h4>
                    <ul>
                      <li><a href="">FAQs</a></li>
                      <li><a href="">For participants</a></li>
                      <li><a href="">For pool creators</a></li>
                      <li><a href="">For developers</a></li>
                    </ul>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <h4>The company</h4>
                    <ul>
                      <li><a href="">Our vision</a></li>
                      <li><a href="">PoolBase company</a></li>
                      <li><a href="">Meet the team</a></li>
                    </ul>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <h4>Support</h4>
                    <ul>
                      <li><a href="">Help center</a></li>
                      <li><a href="">Contact us</a></li>
                      <li><a href="">Telegram support</a></li>
                      <li><a href="">Reddit group</a></li>
                    </ul>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <h4>Social</h4>
                    <ol>
                      {this.footerSocial.map((v, i) =>
                        <li key={v[0]}>
                          <a href={v[1]}>
                            <i className={"fa fa-fw " + v[0]} />
                          </a>
                        </li>
                      )}
                    </ol>
                  </div>
                </div>
              </div>
              <div className="divider" />
              <div className="container-fluid bottom-line">
                <div className="row">
                  <div className="col-xs-12 col-sm-6 links">
                    <a href="">Terms &amp; Conditions</a>
                    <a href="">Privacy</a>
                  </div>
                  <div className="col-xs-12 col-sm-6 copyright">Copyright &copy; 2018 PoolBase</div>
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
