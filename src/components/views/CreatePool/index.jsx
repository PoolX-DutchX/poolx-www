import React from 'react'

import MultiStepForm from '../../MultiStepForm'
import StepOne from './components/Step_1'
import StepTwo from './components/Step_2'
import PoolReview from './components/PoolReview'
import Loader from '../../Loader'
import { useWeb3Context } from 'web3-react'

import validationSchemas from './validation/'

import createPool from '../web3Helpers/createPool/createPool'

const Header = () => (
  <div>
    <h1 className="font-xl">Create Pool</h1>
  </div>
)

const initialPoolData = {
  name: '',
  description: '',
  token1: '',
  token2: '',
  initialClosingPrice: '',
  willUseWeth: false,
}

export default ({ history }) => {
  const context = useWeb3Context()
  const { account, active } = context
  const isLoading = active ? false : true
  const getAddressFromReceiptData = data => {
    const zeroStrippedAddress = data.replace(/(0x)(0{24})(.*)/i, '$1$3')
    return zeroStrippedAddress
  }

  const handleSubmit = values => {
    React.swal({
      title: 'Hold on tight. Your transaction will be mined soon',
      text:
        'After clicking OK, Metamask will request you to create the transaction for the pool creation. After 2 block confirmations, we will redirect you to the pool page.',
      icon: 'info',
    }).then(() => {
      createPool(account, values).then(receipt => {
        const { logs } = receipt
        console.log({ receipt })
        const data = logs[0].data
        const poolAddress = getAddressFromReceiptData(data)

        history.push(`/pools/view-pool/${poolAddress}`)
      })
    })
  }

  if (isLoading) return <Loader className="fixed" />

  return (
    <div>
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
    </div>
  )
}
