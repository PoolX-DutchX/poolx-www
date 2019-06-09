import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import Loader from '../Loader'
import WithTooltip from '../WithTooltip'

import fetchPoolData from './web3Helpers/viewPool/viewPool'
import { getPoolStage } from './web3Helpers/shared/commonWeb3Helpers'
import isEmpty from 'lodash/isEmpty'
import { useWeb3Context } from 'web3-react'

const ViewPool = ({ match, web3, history }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [poolData, setPoolData] = useState({})
  const {
    params: { poolAddress },
  } = match
  const context = useWeb3Context()
  const { account } = context


  const transformFromWei = number => {
    const result = web3.utils.fromWei(number.toString(), 'ether')
    return Number(result)
  }

  useEffect(() => {
    fetchPoolData(poolAddress, account).then(values => {
      const [
        token1BalanceResult,
        token2BalanceResult,
        name,
        description,
        currentDxThreshold,
        tokenBalancesInUsd,
        stageIndex,
        token1,
        token2,
        token1ThresholdReached,
        token2ThresholdReached,
        userContributionForToken1Amount,
        userContributionForToken2Amount,
      ] = values

      const tokenBalanceArray = Object.entries(tokenBalancesInUsd).map(
        ([, value]) => value
      )
      const [token1BalanceInUsd, token2BalanceInUsd] = tokenBalanceArray

      setPoolData({
        token1Balance: transformFromWei(token1BalanceResult),
        token2Balance: transformFromWei(token2BalanceResult),
        name,
        description,
        currentDxThreshold,
        token1BalanceInUsd,
        token2BalanceInUsd,
        stage: getPoolStage(stageIndex),
        token1,
        token2,
        token1ThresholdReached,
        token2ThresholdReached,
        userContributionForToken1Amount: transformFromWei(
          userContributionForToken1Amount
        ),
        userContributionForToken2Amount: transformFromWei(
          userContributionForToken2Amount
        ),
      })

      setIsLoading(false)
    })
  }, [isEmpty(poolData)])

  const contribute = () => history.push(`/pools/${poolAddress}/contribute`)

  if (isLoading) return <Loader className="fixed" />

  const {
    token1Balance,
    token2Balance,
    name,
    description,
    currentDxThreshold,
    token1BalanceInUsd,
    token2BalanceInUsd,
    stage,
    userContributionForToken1Amount,
    userContributionForToken2Amount,
  } = poolData

  const poolProgress = new BigNumber(token1BalanceInUsd)
    .plus(token2BalanceInUsd)
    .div(currentDxThreshold)
    .times(100)
    .toNumber()

  return (
    <div id="view-pool-view" className="container">
      <div>
        <div className="row justify-content-between">
          <div className="col-md-6 ">
            <h1>
              <strong>{name}</strong>
            </h1>
            {/* <div className="pool-creator">
                  Pool Creator Verified{' '}
                  <img src="/img/telegram_logo.png" width="20" alt="Telegram logo" /> KYC
                </div> */}
            <div
              className="alert alert-success row my-contributions-panel"
              role="alert"
            >
              <div className="col-md-4 ">
                <h6>
                  <WithTooltip title="Sum total of all your contributions for this pool">
                    My Contributions in Token 1
                  </WithTooltip>
                </h6>
                <h2>{userContributionForToken1Amount.toFixed(2)}</h2>
              </div>
              <div className="col-md-4 ">
                <h6>
                  <WithTooltip title="Sum total of all your contributions for this pool">
                    My Contributions in token 2
                  </WithTooltip>
                </h6>
                <h2>{userContributionForToken2Amount.toFixed(2)}</h2>
              </div>
            </div>
            <p className="info-disclaimer">
              The following information is provided by the pool creator
            </p>
            <p>{description}</p>
          </div>
          <div className="col-md-5 pool-action-panel">
            <h3>
              <strong>{stage} phase</strong>
            </h3>
            <LinearProgress variant="determinate" value={poolProgress} />
            <div className="total-invested-section">
              <h4 className="invested">
                <strong>
                  {new BigNumber(token1BalanceInUsd)
                    .plus(token2BalanceInUsd)
                    .toString()}{' '}
                  USD
                </strong>
              </h4>
              <div className="subheading">
                of {transformFromWei(currentDxThreshold)} USD to list token pair
              </div>
            </div>
            <div className="min-max-section">
              <span>
                <h4>
                  <strong>{token1Balance}</strong>
                </h4>
                <div className="subheading">Token1 balance</div>
              </span>
              <span>
                <h4>
                  <strong>{token2Balance}</strong>
                </h4>
                <div className="subheading">Token2 balance</div>
              </span>
            </div>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={contribute}
              disabled={false}
            >
              Contribute to Pool
            </Button>
            <div className="row margin-top-bottom">
              <div className="col">
                <Button variant="outlined" fullWidth>
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewPool
