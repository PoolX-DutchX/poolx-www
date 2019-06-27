import React, { useState, useEffect } from 'react'

import BigNumber from 'bignumber.js'
import moment from 'moment'
// import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import Loader from '../Loader'
import Tooltip from '@material-ui/core/Tooltip'
import WithTooltip from '../WithTooltip'

import {
  showToastOnTxSubmitted,
  showToastOnTxConfirmation,
  showToastOnTxError,
} from './web3Helpers/shared/showToasts'

import poolAbi from './web3Helpers/shared/poolAbi.json'

import fetchPoolData from './web3Helpers/viewPool/viewPool'
import { getPoolStage } from './web3Helpers/shared/commonWeb3Helpers'
import { fetchUserTokenBalances } from './web3Helpers/contributePool/contribute'
import { useWeb3Context } from 'web3-react'

BigNumber.config({ EXPONENTIAL_AT: 40 })

const ViewPool = ({ match, web3, history }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [poolData, setPoolData] = useState({})
  const [tokenNames, setTokenNames] = useState({})
  const context = useWeb3Context()
  const {
    params: { poolAddress },
  } = match
  const { account } = context

  useEffect(() => {
    fetchPoolData(poolAddress, account).then(values => {
      const transformFromWei = number => {
        const result = web3.utils.fromWei(number.toString(), 'ether')
        return Number(result)
      }

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
        dutchAuctionIndex,
        dutchAuctionStartTime,
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
        dutchAuctionIndex,
        dutchAuctionStartTime,
      })

      setIsLoading(false)
    })
  }, [account, poolAddress, web3.utils])

  useEffect(() => {
    const { token1, token2 } = poolData
    if (token1 && token2) {
      fetchUserTokenBalances({ token1, token2, account }).then(values => {
        const [token1Data, token2Data] = values

        setTokenNames({
          token1Name: token1Data.tokenName,
          token2Name: token2Data.tokenName,
        })
      })
    }
  }, [poolData, account])

  const contribute = () => history.push(`/pools/${poolAddress}/contribute`)

  const postBuyAndCollect = () => {
    const poolContract = new web3.eth.Contract(poolAbi, poolAddress)

    return new Promise((resolve, rejection) => {
      poolContract.methods
        .buyAndCollect()
        .send({
          from: account,
        })
        .on('transactionHash', txHash => {
          showToastOnTxSubmitted(txHash, 'contribution')
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          showToastOnTxConfirmation(confirmationNumber, receipt, 'contribution')
          resolve(receipt)
        })
        .on('error', (error, receipt) => {
          showToastOnTxError(receipt, 'contribution')
          return rejection(error)
        })
    })
  }
  const claimFunds = () => {
    const poolContract = new web3.eth.Contract(poolAbi, poolAddress)

    return new Promise((resolve, rejection) => {
      poolContract.methods
        .claimFunds()
        .send({
          from: account,
        })
        .on('transactionHash', txHash => {
          showToastOnTxSubmitted(txHash, 'contribution')
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          showToastOnTxConfirmation(confirmationNumber, receipt, 'contribution')
          resolve(receipt)
        })
        .on('error', (error, receipt) => {
          showToastOnTxError(receipt, 'contribution')
          return rejection(error)
        })
    })
  }

  const withdrawContribution = () => {
    const poolContract = new web3.eth.Contract(poolAbi, poolAddress)

    return new Promise((resolve, rejection) => {
      poolContract.methods
        .withdrawContribution()
        .send({
          from: account,
        })
        .on('transactionHash', txHash => {
          showToastOnTxSubmitted(txHash, 'contribution')
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          showToastOnTxConfirmation(confirmationNumber, receipt, 'contribution')
          resolve(receipt)
          setTimeout(() => window.location.reload(), 2000)
        })
        .on('error', (error, receipt) => {
          showToastOnTxError(receipt, 'contribution')
          return rejection(error)
        })
    })
  }

  if (isLoading) return <Loader className="fixed" />

  const {
    token1Balance,
    token2Balance,
    name,
    description,
    currentDxThreshold,
    stage,
    userContributionForToken1Amount,
    userContributionForToken2Amount,
    dutchAuctionIndex,
    dutchAuctionStartTime,
    token1ThresholdReached,
    token2ThresholdReached,
  } = poolData

  const { token1Name, token2Name } = tokenNames

  // const poolProgress = new BigNumber(token1BalanceInUsd)
  //   .plus(token2BalanceInUsd)
  //   .div(currentDxThreshold)
  //   .times(100)
  //   .toNumber()

  const transformFromWei = number => {
    const result = web3.utils.fromWei(number.toString(), 'ether')
    return Number(result)
  }

  const auctionStarted = Date.now() > dutchAuctionStartTime * 1000
  const hasContributedToPool =
    userContributionForToken1Amount > 0 || userContributionForToken2Amount > 0
  const hasReachedPoolContributionThresholdInfo =
    token1ThresholdReached || token2ThresholdReached
      ? 'Contribution reached. You are able to list token on DutchX'
      : 'Contribution ongoing'

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
                    My Contributions in {token1Name || 'Token 1'}
                  </WithTooltip>
                </h6>
                <h2>{userContributionForToken1Amount.toFixed(2)}</h2>
              </div>
              <div className="col-md-4 ">
                <h6>
                  <WithTooltip title="Sum total of all your contributions for this pool">
                    My Contributions in {token2Name || 'Token 2'}
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
            <p>{hasReachedPoolContributionThresholdInfo}</p>
            {/* <LinearProgress variant="determinate" value={poolProgress} /> */}
            <div className="total-invested-section">
              {/* <h4 className="invested">
                <strong>
                  {transformFromWei(
                    new BigNumber(token1BalanceInUsd).plus(token2BalanceInUsd)
                  )}
                </strong>
                USD
              </h4> */}
              <div className="subheading">
                Currently on DutchX, it is required{' '}
                <strong>{transformFromWei(currentDxThreshold)}</strong> USD to
                list a token pair
              </div>
            </div>
            <div className="min-max-section">
              <span>
                <h4>
                  <strong>{token1Balance}</strong>
                </h4>
                <div className="subheading">
                  Total {token1Name || 'Token 1'} balance in pool
                </div>
              </span>
              <span>
                <h4>
                  <strong>{token2Balance}</strong>
                </h4>
                <div className="subheading">
                  Total {token2Name || 'Token 2'} balance in pool
                </div>
              </span>
            </div>
            {stage === 'Contribution' && (
              <div className="row">
                <div className="col-md-6">
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={contribute}
                  >
                    Contribute
                  </Button>
                </div>
                {hasContributedToPool && (
                  <div className="col-md-6">
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={withdrawContribution}
                    >
                      Withdraw
                    </Button>
                  </div>
                )}
              </div>
            )}
            {stage === 'Collection' && (
              <div className="row">
                <div className="col-md-4 subheading">
                  {`Finished? ${
                    dutchAuctionIndex.toString() === '1' ? 'No' : 'Yes'
                  }`}
                </div>
                <div className="col-md-4 subheading">
                  {`Starts at: ${moment(dutchAuctionStartTime * 1000).format(
                    'MMMM Do YYYY, h:mm:ss a'
                  )}\n`}
                </div>
                <div className="col-md-4 subheading">
                  {`Starts in: ${moment(
                    dutchAuctionStartTime * 1000
                  ).fromNow()}`}
                </div>
              </div>
            )}
            <div>
              {stage === 'Collection' && (
                <Tooltip
                  title={auctionStarted ? '' : 'Auction not yet started'}
                >
                  <div className="row margin-top-bottom">
                    <Button
                      disabled={!auctionStarted}
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={postBuyAndCollect}
                    >
                      POST BUY ORDER
                    </Button>
                  </div>
                </Tooltip>
              )}
              {stage === 'Claim' && (
                <div className="row margin-top-bottom">
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={claimFunds}
                  >
                    CLAIM FUNDS
                  </Button>
                </div>
              )}
              <p className="info-disclaimer">
                Once pool is finalized it will automatically send the collected
                funds to DutchX. Important: the auction starts six hours after
                the token pair is added. Use this interface to send a buy order
                for the DutchX auction once it starts. Only then, users are able
                to claim tokens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewPool
