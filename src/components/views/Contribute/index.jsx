import React, { useState, useEffect } from 'react'

import MultiStepForm from '../../MultiStepForm'
import StepOne from './components/Step_1'
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
      <p className="font-m">...And get in on some of the action</p>
    </div>
  )
}

const Contribute = ({ match }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [poolData, setPoolData] = useState({})
  const {
    params: { poolAddress },
  } = match
  const context = useWeb3Context()
  const { account } = context

  useEffect(() => {
    fetchContributionPageData(poolAddress, account).then(values => {
      const [stageIndex, token1, token2] = values
      setPoolData({
        stage: getPoolStage(stageIndex),
        token1,
        token2,
      })

      setIsLoading(false)
    })
  }, [isEmpty(poolData)])

  if (isLoading) return <Loader className="fixed" />

  const { token1, token2, stage } = poolData

  return (
    <div>
      {stage !== 'Contribution' && <WrongStage stage={stage} />}
      {stage === 'Contribution' && (
        <MultiStepForm
          header={<Header />}
          initialValues={{
            isContributingToken2: '',
            amount: '',
          }}
          stepLabels={['Contribution Details', 'Perform transaction']}
          onSubmit={values =>
            contributeToPool({
              account,
              token1,
              token2,
              poolAddress,
              isContributingToken2: values.isContributingToken2,
              amount: values.amount,
            })
          }
          validationSchemas={validationSchemas}
        >
          <StepOne />
        </MultiStepForm>
      )}
    </div>
  )
}

export default Contribute
