import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, Switch } from 'react-router-dom';
import localforage from 'localforage';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Sweetalert from 'sweetalert';

import { history } from '../lib/helpers';

// views
import EditProfile from './../components/views/EditProfile';
import SignIn from './../components/views/SignIn';
import SignUp from './../components/views/SignUp';
import Home from './../components/views/Home';

import ViewPool from './../components/views/ViewPool';
import CreatePool from './../components/views/CreatePool/';
import EditPool from './../components/views/EditPool/';
import Update from './../components/views/Update/';
import ClosePool from './../components/views/ClosePool/';
import Contribute from './../components/views/Contribute/';
import Dashboard from './../components/views/Dashboard/';
import Deploy from './../components/views/Deploy/';
import ConfirmTokenBatch from './../components/views/ConfirmTokenBatch/';

import NotFound from './../components/views/NotFound';

// components
import MainMenu from './../components/MainMenu';
import Loader from './../components/Loader';
import PrivateRoute from '../components/PrivateRoute';

// context providers
import UserProvider, { Consumer as UserConsumer } from '../contextProviders/UserProvider';

import './../lib/validators';

/* global document */
/**
 * Here we hack to make stuff globally available
 */
// Make sweet alert global
React.swal = Sweetalert;

// Construct a dom node to be used as content for sweet alert
React.swal.msg = reactNode => {
  const wrapper = document.createElement('span');
  ReactDOM.render(reactNode, wrapper);
  return wrapper.firstChild;
};

// make toast globally available
React.toast = toast;

/**
 * This container holds the application and its routes.
 * It is also responsible for loading application persistent data.
 * As long as this component is mounted, the data will be persistent,
 * if passed as props to children.
 */
class Application extends Component {
  constructor() {
    super();

    localforage.config({
      name: 'poolbase',
    });

  }

  render() {
    return (
      <Router history={history}>
        <UserProvider>
          <UserConsumer>
            {({
              state: {
                currentUser,
                isLoading,
                hasError
              },
              actions: {
                onSignIn,
                onSignOut,
              },
            }) => (
              <div className="full-height">
                {isLoading && <Loader className="fixed" />}
                {!isLoading &&
                  !hasError && (
                    <div className="full-height">
                      <MainMenu onSignOut={onSignOut} currentUser={currentUser} />
                      <section className="page-layout">
                        <Switch>
                          {/* Routes are defined here. Persistent data is set as props on components
                    NOTE order matters, wrong order breaks routes!
                 */}
                          <Route
                            exact
                            path="/pools/create"
                            component={props => (
                              <CreatePool
                                currentUser={currentUser}
                                {...props}
                              />
                            )}
                          />
                          <Route
                            exact
                            path="/pools/:poolId"
                            component={props => (
                              <ViewPool currentUser={currentUser} {...props} />
                            )}
                          />
                          <Route
                            exact
                            path="/pools/:poolId/edit"
                            component={props => (
                              <EditPool currentUser={currentUser} {...props} />
                            )}
                          />
                          <Route
                            exact
                            path="/pools/:poolId/update"
                            component={props => (
                              <Update currentUser={currentUser} {...props} />
                            )}
                          />
                          <Route
                            exact
                            path="/pools/:poolId/payout"
                            component={props => (
                              <ClosePool currentUser={currentUser} {...props} />
                            )}
                          />
                          <Route
                            exact
                            path="/pools/:poolId/contribute"
                            component={props => (
                              <Contribute currentUser={currentUser} {...props} />
                            )}
                          />
                          <Route
                            exact
                            path="/pools/:poolId/confirmTokenBatch"
                            component={props => (
                              <ConfirmTokenBatch currentUser={currentUser} {...props} />
                            )}
                          />
                          <Route
                            exact
                            path="/pools/:poolId/pendingTx"
                            component={props => (
                              <Deploy currentUser={currentUser} {...props} />
                            )}
                          />
                          <Route
                            exact
                            path="/contributions/:contributionId/pendingTx"
                            component={props => (
                              <Deploy currentUser={currentUser} {...props} />
                            )}
                          />
                          <Route
                            exact
                            path="/dashboard"
                            component={props => (
                              <Dashboard currentUser={currentUser} {...props} />
                            )}
                          />
                          <Route
                            exact
                            path="/signin"
                            component={props => (
                              <SignIn
                                onSignIn={onSignIn}
                                {...props}
                              />
                            )}
                          />
                          <Route
                            exact
                            path="/signup"
                            render={props => (
                              <SignUp
                                onSignIn={onSignIn}
                                {...props}
                              />
                            )}
                          />
                          <PrivateRoute
                            exact
                            path="/profile"
                            currentUser={currentUser}
                            component={props => (
                              <EditProfile currentUser={currentUser} onSignIn={onSignIn} {...props} />
                            )}
                          />
                          <Route
                            exact
                            path="/"
                            render={props => (
                              <Home currentUser={currentUser} {...props} />
                            )}
                          />

                          <Route component={NotFound} />
                        </Switch>
                      </section>
                    </div>
                  )}

                {!isLoading &&
                  hasError && (
                    <center>
                      <h2>Oops, something went wrong...</h2>
                      <p>Poolbase could not load for some reason. Please try again...</p>
                    </center>
                  )}

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
            )}
          </UserConsumer>
        </UserProvider>
      </Router>
    );
  }
}

export default Application;
