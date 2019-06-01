import React, { useState, useEffect } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useWeb3Context } from 'web3-react'
import Web3Error from './Web3Error'

const Web3ProtectedRoute = ({ currentUser, component, ...rest }) => {
  const context = useWeb3Context()
  const [setInitializationOver] = useState(false)
  const { active, error, unsetConnector, connectorName } = context
  // const { account } = context;

  if (!active) {
    useEffect(() => {
      context.setConnector('Injected').catch(() => {
        setInitializationOver(true)
        console.log('Unable to automatically activate MetaMask') // eslint-disable-line no-console
      })
    }, [])
  }

  return (
    <Route
      {...rest}
      render={props => {
        if (active) {
          return component(props)
        } else if (error) {
          return (
            <Web3Error
              error={error}
              connectorName={connectorName}
              unsetConnector={unsetConnector}
            />
          )
        } else {
          return (
            <Redirect
              to={{
                pathname: '/',
                state: { from: props.location },
              }}
            />
          )
        }
      }}
    />
  )
}

export default Web3ProtectedRoute
