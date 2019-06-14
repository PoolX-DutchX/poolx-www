import React, { useState, useEffect } from 'react'

import MultiStepForm from '../../MultiStepForm'
import FormStep from './components/FormStep'
import WrongStage from './WrongStage'
import Loader from '../../Loader'
import validationSchemas from './validation/'
import isEmpty from 'lodash/isEmpty'
import { useWeb3Context } from 'web3-react'
import { getPoolStage } from '../web3Helpers/shared/commonWeb3Helpers'
import {
  fetchContributionPageData,
  contributeToPool,
} from '../web3Helpers/contributePool/contribute'

const Header = () => {
  return (
    <div>
      <h1 className="font-xl">Contribute</h1>
      <p className="font-m">to list tokens on DutchX</p>
    </div>
  )
}

const Contribute = ({ match, history }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [poolData, setPoolData] = useState({})
  const {
    params: { poolAddress },
  } = match
  const context = useWeb3Context()
  const { account } = context

  useEffect(() => {
    fetchContributionPageData(poolAddress, account).then(values => {
      const [
        stageIndex,
        token1,
        token2,
        isAuctionWithWeth,
        token1ThresholdReached,
        token2ThresholdReached,
      ] = values
      setPoolData({
        stage: getPoolStage(stageIndex),
        token1,
        token2,
        isAuctionWithWeth,
        token1ThresholdReached,
        token2ThresholdReached,
      })

      setIsLoading(false)
    })
  }, [isEmpty(poolData)])

  if (isLoading) return <Loader className="fixed" />

  const {
    token1,
    token2,
    stage,
    isAuctionWithWeth,
    token1ThresholdReached,
    token2ThresholdReached,
  } = poolData

  const submitContribution = ({ amount, isContributingToken2 }) => {
    React.swal({
      title: 'You are about to contribute to Pool in 2 transactions',
      content: React.swal.msg(
        <div>
          <p>First transaction, you will approve the smart contract to use your token</p>
          <p>Second transaction you deposit the token to the smart contract</p>
        </div>,
      ),
      icon: 'info',
    }).then(() => {
      contributeToPool({
        account,
        token1,
        token2,
        poolAddress,
        isContributingToken2,
        amount,
      })
      .then(() => history.push(`/pools/view-pool/${poolAddress}`))
    })
  }

  return (
    <div>
      {stage !== 'Contribution' && <WrongStage stage={stage} />}
      {stage === 'Contribution' && (
        <MultiStepForm
          header={<Header />}
          initialValues={{
            isContributingToken2: false,
            amount: '',
          }}
          stepLabels={['Contribution Details', 'Perform transaction']}
          onSubmit={(values) => submitContribution(values)}
          validationSchemas={validationSchemas}
        >
          <FormStep
            isAuctionWithWeth={isAuctionWithWeth}
            token1ThresholdReached={token1ThresholdReached}
            token2ThresholdReached={token2ThresholdReached}
          />
        </MultiStepForm>
      )}
    </div>
  )
}

export default Contribute
