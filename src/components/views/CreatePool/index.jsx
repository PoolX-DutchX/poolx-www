import React from 'react'

import MultiStepForm from '../../MultiStepForm'
import StepOne from './components/Step_1'
import StepTwo from './components/Step_2'
import PoolReview from './components/PoolReview'
import Loader from '../../Loader'
import { useWeb3Context, Web3Consumer } from 'web3-react'

import validationSchemas from './validation/';

const Header = () => (
  <div>
    <h1 className="font-xl">Create Pool</h1>
  </div>
)

const Web3ConsumerComponent = () => {
  return (
    <Web3Consumer>
      {context => {
        const { active, connectorName, account, networkId } = context
        return (
          active && (
            <React.Fragment>
              <p>Active Connector: {connectorName}</p>
              <p>Account: {account || 'None'}</p>
              <p>Network ID: {networkId}</p>
            </React.Fragment>
          )
          )
        }}
    </Web3Consumer>
  )
}

const initialPoolData = {
  token1: '',
  token2: '',
  initialClosingPrice: '',
}

export default () => {
  const context = useWeb3Context()
  const { active } = context
  const isLoading = active ? false : true

  return (
    <div>
      <Web3ConsumerComponent />

      {isLoading && <Loader className="fixed" />}
      {!isLoading && (
        <MultiStepForm
          header={<Header />}
          initialValues={initialPoolData}
          stepLabels={['Add Token Pair', 'Add Initial Price', 'Review']}
          onSubmit={(values, actions) => {
            console.log('submitting values', values)
          }}
          validationSchemas={validationSchemas}
        >
          <StepOne />
          <StepTwo />
          <PoolReview />
        </MultiStepForm>
      )}
    </div>
  )
}
