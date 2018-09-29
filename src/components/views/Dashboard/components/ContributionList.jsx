import React from 'react';
import PropTypes from 'prop-types';

import ContributionListItem from './ContributionListItem';

function ContributionList(props) {
  const { contributions = [], currentUser } = props;
  return (
    <div>
      {!!contributions.length ? (
        contributions.map((contribution, index) => (
          <ContributionListItem contribution={contribution} currentUser={currentUser} key={index} />
        ))
      ) : (
        <div> You have no contributions yet </div>
      )}
    </div>
  );
}

ContributionList.propTypes = {
  contributions: PropTypes.array,
};

export default ContributionList;
