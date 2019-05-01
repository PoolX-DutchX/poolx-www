import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useWeb3Context } from 'web3-react'
import Web3Error from './Web3Error'

const Web3ProtectedRoute = ({ currentUser, component, ...rest }) => {
  const context = useWeb3Context()
  const [setInitializationOver] = useState(false)
  const { active, account, error, unsetConnector, connectorName } = context;

  // if (error) {
  //   unsetConnector()
  // }

  if(!active) {
    useEffect(() => {
      context.setConnector('Injected')
        .catch(() => {
          setInitializationOver(true)
          console.log('Unable to automatically activate MetaMask') // eslint-disable-line no-console
        })
    }, [])
  }

  return (
    <Route
      {...rest}
      render={props => {
        let render;
        if (active) {
          render = component(props)
        } else if (error) {
          render = (
            <Web3Error
            error={ error }
            connectorName={ connectorName }
            unsetConnector={ unsetConnector }
            />
          )
        } else {
          render = (
            <Redirect
              to={{
                pathname: '/',
                state: { from: props.location },
              }}
            />
          )
        }
        return render
        // return active ? (
        //   component(props)
        // ) : (
        //   <Web3Error
        //     error={ error }
        //     connectorName={ connectorName }
        //     unsetConnector={ unsetConnector }
        //   />
        //   // <Redirect
        //   //   to={{
        //   //     pathname: '/',
        //   //     state: { from: props.location },
        //   //   }}
        //   // />
        // );
      }}
    />
)};

export default Web3ProtectedRoute;
