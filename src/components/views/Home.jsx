import React from 'react';
import PropTypes from 'prop-types';

import User from '../../models/User';
import HeroBanner from '../HeroBanner';

const Home = ({ currentUser, history }) => (
  <div>
    <HeroBanner currentUser={currentUser} history={history} />
    <div className="container-fluid page-layout reduced-padding">
    </div>
  </div>
);

Home.propTypes = {
  currentUser: PropTypes.instanceOf(User),
  history: PropTypes.shape({}).isRequired,
};

Home.defaultProps = {
  currentUser: undefined
};

export default Home;
