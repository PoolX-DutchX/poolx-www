import React from 'react'
import styled from 'styled-components'

import { Connectors } from 'web3-react'
import error from '../assets/error.svg'
import Common, { Text, Button } from './Web3ErrorBase'

import { Link } from 'react-router-dom'
const { InjectedConnector } = Connectors

const Logo = styled.div`
  margin: 1em;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 6em;
  width: 6em;
`

const ErrorLogo = styled(Logo)`
  background-image: url(${error});
`

const ResetButton = styled(Button)`
  margin: 1em;
  padding: 1em;
`

const ErrorWrapper = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 95vh;
  width: 90%;
`

const ErrorText = styled(Text)`
  text-align: center;
  font-size: 2em;
  margin-bottom: 1em;
`
export default function Web3Error({ error, connectorName }) {
  console.error(`The '${connectorName}' connector threw an error.`) // eslint-disable-line no-console
  console.log({ error: error.code }) // eslint-disable-line no-console

  const getErrorMessage = () => {
    if (error.code === InjectedConnector.errorCodes.ETHEREUM_ACCESS_DENIED)
      return 'Grant access to continue.'
    if (error.code === InjectedConnector.errorCodes.NO_WEB3)
      return 'No Web3 Provider Found.'
    if (error.code === InjectedConnector.errorCodes.LEGACY_PROVIDER)
      return 'Update your legacy Web3 Provider.'
    if (error.code === InjectedConnector.errorCodes.UNLOCK_REQUIRED)
      return 'Unlock your Ethereum Account.'
    if (error.code === 'UNSUPPORTED_NETWORK') {
      return `Unssuported Network. Please connect to Rinkeby or Mainnet.`
    }

    return 'An unexpected error occurred. Please try again.'
  }

  return (
    <Common>
      <ErrorWrapper>
        <ErrorLogo />
        <ErrorText>{getErrorMessage()}</ErrorText>
        <Link to="/">
          <ResetButton>Reset</ResetButton>
        </Link>
      </ErrorWrapper>
    </Common>
  )
}
