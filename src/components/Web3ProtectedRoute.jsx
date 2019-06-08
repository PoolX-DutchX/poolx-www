import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useWeb3Context } from 'web3-react'
import Web3Error from './Web3Error'
import Loader from './Loader'
import getWeb3 from '../lib/blockchain/getWeb3'

const Web3ProtectedRoute = ({ component, ...rest }) => {
  const context = useWeb3Context()
  const { active, networkId, error, connectorName } = context

  const web3 = getWeb3()

  useEffect(() => {
    if (!networkId) {
      context.setFirstValidConnector(['Injected'])
    }
  }, [])

  return (
    <Route
      {...rest}
      render={props => {
        if (!active && !error) {
          // loading
          return <Loader className="fixed" />
        } else if (error) {
          //error
          return <Web3Error error={error} connectorName={connectorName} />
        } else {
          // success
          const newProps = { web3, ...props }
          return component(newProps)
        }
      }}
    />
  )
}

export default Web3ProtectedRoute
