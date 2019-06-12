import React from 'react'
import { Link, withRouter } from 'react-router-dom'

/**
 * The main top menu
 */
const MainMenu = ({ location }) => {
  const isHomePage = location.pathname === '/'

  return (
    <div>
      <nav
        id="main-menu"
        className={`navbar navbar-expand-lg fixed-top ${isHomePage && 'is-homepage'} `}
      >
        <Link className="navbar-brand" to="/">
          {isHomePage ? (
            <img src="/img/poolx_logo.png" width="140px" alt="PoolX logo" />
          ) : (
            <img src="/img/logo_white.png" width="140px" alt="PoolX logo" />
          )}
        </Link>

        <div
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mr-auto" />
        </div>
      </nav>
    </div>
  )
}

export default withRouter(MainMenu)
