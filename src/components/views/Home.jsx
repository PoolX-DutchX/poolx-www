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
          <div className="container-fluid page-layout reduced-padding">
              <div className="light-blue-background heading">
                  <div className="table-margin flexcontainer"> 
                        <ul className = "col-md-4 list-group clean-list"> 
                            <li><h3>Poolbase. An app your users will love</h3></li>                  
                            <li><p>Poolbase is an app which allows its users to pool money together to invest in hot new ICOs</p></li>                  
                            <li><button className="button-style">Signup For Poolbase</button></li>                  
                            <li>Login with Github</li>                  
                        </ul>
                          <img src="https://www.gitbook.com/public/images/adb1b3a77d092d0cb1bccc7a42b94625.png" alt="Signup Image" height ="310" width = "475"/>
                  </div>
                <div className = "middle-homepage-content">
                    <ul className = "horizontal-list centering">
                      <li><a href="https://redux.js.org/"><img alt="redux" src="https://www.gitbook.com/public/images/18af60f4f368614a75f3441be0a50f65.png"/></a></li>
                      <li><a href="https://docs.realm.io/platform/"><img alt="realm" src="https://www.gitbook.com/public/images/eef983656f36aca94b67658113f25eb5.svg"/></a></li>
                      <li><img alt="coursera" src="https://www.gitbook.com/public/images/e391fda125c99af0e02ced8119722efd.svg"/></li>
                      <li><img alt="duckduckgo" src="https://www.gitbook.com/public/images/1318e0fd1fabf3efe44eef228e5600cf.svg"/></li>
                    </ul>
                </div>
            </div>
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
