import React from 'react'

import MultiStepForm from '../../MultiStepForm'
import StepOne from './components/Step_1'
import StepTwo from './components/Step_2'
import PoolReview from './components/PoolReview'
import Loader from '../../Loader'
import { useWeb3Context, Web3Consumer } from 'web3-react'

import validationSchemas from './validation/';

import createPool from '../web3Helpers/createPool/createPool'

const Header = () => (
  <div>
    <h1 className="font-xl">Create Pool</h1>
  </div>
)

const Web3ConsumerComponent = () => {
  return (
    <Web3Consumer>
      {context => {
        const { active, account, networkId } = context
        return (
          active && (
            <React.Fragment>
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
  willUseWeth: false
}


export default ({ history }) => {
  const context = useWeb3Context()
  const { account } = context;
  const { active } = context
  const isLoading = active ? false : true

  const getAddressFromReceiptData = (data) => {
    const zeroStrippedAddress = data.replace(/(0x)0*(.*)/i, '$1$2')
    return zeroStrippedAddress
  }

  const handleSubmit = (values) => {
    React.swal({
      title: 'Hold on tight. Your transaction will be mined soon',
      text:
        'After clicking OK, Metamask will request you to create the transaction for the pool creation. After 5 block confirmations, we will redirect you to the pool page.',
      icon: 'info',
    }).then(() => {
      createPool(account, values)
      .then(receipt => {
        const { logs } = receipt
        const data = logs[0].data
        const poolAddress = getAddressFromReceiptData(data)

        history.push(`/pools/view-pool/${poolAddress}`)
      })
    })

  }

  return (
    <div>
      <Web3ConsumerComponent />

      {isLoading && <Loader className="fixed" />}
      {!isLoading && (
        <MultiStepForm
          header={<Header />}
          initialValues={initialPoolData}
          stepLabels={['Add Token Pair', 'Add Initial Price', 'Review']}
          onSubmit={handleSubmit}
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
