import React from 'react'
import ReactDOM from 'react-dom'

import { Router, Route, Switch } from 'react-router-dom'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Sweetalert from 'sweetalert'

import { history } from '../lib/helpers'

// views
import Home from './../components/views/Home'

import ViewPool from './../components/views/ViewPool'
import Pools from './../components/views/Pools'
import CreatePool from './../components/views/CreatePool/'
import Contribute from './../components/views/Contribute/'

import NotFound from './../components/views/NotFound'

// components
import MainMenu from './../components/MainMenu'
import Web3ProtectedRoute from '../components/Web3ProtectedRoute'

import './../lib/validators'

/* global document */
/**
 * Here we hack to make stuff globally available
 */
// Make sweet alert global
React.swal = Sweetalert

// Construct a dom node to be used as content for sweet alert
React.swal.msg = reactNode => {
  const wrapper = document.createElement('span')
  ReactDOM.render(reactNode, wrapper)
  return wrapper.firstChild
}

// make toast globally available
React.toast = toast

/**
 * This container holds the application and its routes.
 * It is also responsible for loading application persistent data.
 * As long as this component is mounted, the data will be persistent,
 * if passed as props to children.
 */
const Application = () => {
  return (
    <Router history={history}>
      <div>
        <div className="full-height">
            <div className="full-height">
              <MainMenu />
              <section className="page-layout">
                <Switch>
                  {/* Routes are defined here. Persistent data is set as props on components
                    NOTE order matters, wrong order breaks routes!
                 */}
                  <Web3ProtectedRoute
                    exact
                    path="/pools/create"
                    component={props => <CreatePool {...props} />}
                  />
                  <Web3ProtectedRoute
                    exact
                    path="/pools/view-pool/:poolAddress"
                    component={props => <ViewPool {...props} />}
                  />
                  <Web3ProtectedRoute
                    exact
                    path="/pools/:poolAddress/contribute"
                    component={props => <Contribute {...props} />}
                  />
                  <Web3ProtectedRoute
                    exact
                    path="/pools"
                    component={props => <Pools {...props} />}
                  />
                  <Route exact path="/" render={props => <Home {...props} />} />

                  <Route component={NotFound} />
                </Switch>
              </section>
            </div>

          <ToastContainer
            position="top-right"
            type="default"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            pauseOnHover
          />
        </div>
      </div>
    </Router>
  )
}

export default Application
