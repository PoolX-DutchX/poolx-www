import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { history } from '../lib/helpers'

/**
 * The main top menu
 */
class MainMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showMobileMenu: false,
    }
  }

  componentDidMount() {
    // when route changes, close the menu
    history.listen(() => this.setState({ showMobileMenu: false }))
  }

  toggleMobileMenu() {
    this.setState({ showMobileMenu: !this.state.showMobileMenu })
  }

  render() {
    const { showMobileMenu } = this.state
    const { location } = this.props
    const isHomePage = location.pathname === '/'

    return (
      <div>
        <nav
          id="main-menu"
          className={`navbar navbar-expand-lg fixed-top ${
            showMobileMenu ? 'show' : ''
          } ${isHomePage && 'is-homepage'} `}
        >
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            onClick={() => this.toggleMobileMenu()}
          >
            <i
              className={`navbar-toggler-icon fa ${
                showMobileMenu ? 'fa-close' : 'fa-bars'
              }`}
            />
          </button>
          <Link className="navbar-brand" to="/">
            {isHomePage ? (
              <img src="/img/poolx_logo.png" width="140px" alt="PoolX logo" />
            ) : (
              <img src="/img/poolx_logo.png" width="140px" alt="PoolX logo" />
            )}
          </Link>

          <div
            className={`collapse navbar-collapse ${
              showMobileMenu ? 'show' : ''
            } `}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mr-auto" />
          </div>
        </nav>
      </div>
    )
  }
}

export default withRouter(MainMenu)
