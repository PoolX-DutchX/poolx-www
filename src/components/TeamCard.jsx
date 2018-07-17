import React from 'react';
import PropTypes from 'prop-types';

function TeamCard({imgUrl, name, title}){
  return (
    <div className="team-card">
      <div className="picture">
        <img src={imgUrl} height="220px" width="170px" alt={name} />
      </div>
      <div className="name">
        {name}
      </div>
      <div className="title">
        {title}
      </div>
    </div>
  );
}

TeamCard.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default TeamCard;
