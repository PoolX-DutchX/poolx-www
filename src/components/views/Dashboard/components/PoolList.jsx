import React from 'react';
import PropTypes from 'prop-types';

import PoolListItem from './PoolListItem';

function PoolList(props) {
  const { pools = [], currentUser } = props;
  return (
    <div>
      {!!pools.length ? pools.map((pool, index) => (
        <PoolListItem pool={pool} currentUser={currentUser} key={index}/>
      )) : <div> You have no pools yet </div>}
    </div>
  );
}

PoolList.propTypes = {
  pools: PropTypes.array
};

export default PoolList;
