import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ currentUser, component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return currentUser ? (
        component(props)
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location },
          }}
        />
      );
    }}
  />
);

export default PrivateRoute;
