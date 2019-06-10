import React from 'react'
import PropTypes from 'prop-types'

function TeamCard({ imgUrl, name, title }) {
  return (
    <div className="col-sm-6 col-md-3 team-card">
      <img src={imgUrl} alt={name} />
      <div className="name">{name}</div>
      <div className="title">{title}</div>
      <a href="">
        <i className="fa fa-fw fa-linkedin" />
      </a>
    </div>
  )
}

TeamCard.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default TeamCard
