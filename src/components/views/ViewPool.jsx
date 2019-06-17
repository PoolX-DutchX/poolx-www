import React, { useState, useEffect } from 'react'

import BigNumber from 'bignumber.js'
import moment from 'moment'
import LinearProgress from '@material-ui/core/LinearProgress'
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
import { useWeb3Context } from 'web3-react'

BigNumber.config({ EXPONENTIAL_AT: 40 })

const ViewPool = ({ match, web3, history }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [poolData, setPoolData] = useState({})
  const {
    params: { poolAddress },
  } = match
  const context = useWeb3Context()
  const { account } = context

  useEffect(() => {
    fetchPoolData(poolAddress, account).then(values => {
      const transfromFromWei = number => {
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
        token1Balance: transfromFromWei(token1BalanceResult),
        token2Balance: transfromFromWei(token2BalanceResult),
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
        userContributionForToken1Amount: transfromFromWei(
          userContributionForToken1Amount
        ),
        userContributionForToken2Amount: transfromFromWei(
          userContributionForToken2Amount
        ),
        dutchAuctionIndex,
        dutchAuctionStartTime,
      })

      setIsLoading(false)
    })
  }, [account, poolAddress, web3.utils])

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
    token1BalanceInUsd,
    token2BalanceInUsd,
    stage,
    userContributionForToken1Amount,
    userContributionForToken2Amount,
    dutchAuctionIndex,
    dutchAuctionStartTime,
  } = poolData

  const poolProgress = new BigNumber(token1BalanceInUsd)
    .plus(token2BalanceInUsd)
    .div(currentDxThreshold)
    .times(100)
    .toNumber()

  const transfromFromWei = number => {
    const result = web3.utils.fromWei(number.toString(), 'ether')
    return Number(result)
  }

  const auctionStarted = Date.now() > dutchAuctionStartTime * 1000

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
                  {transfromFromWei(
                    new BigNumber(token1BalanceInUsd).plus(token2BalanceInUsd)
                  )}
                </strong>
                USD
              </h4>
              <div className="subheading">
                of {transfromFromWei(currentDxThreshold)} USD to list token pair
              </div>
            </div>
            <div className="min-max-section">
              <span>
                <h4>
                  <strong>{token1Balance}</strong>
                </h4>
                <div className="subheading">Total Token1 balance in pool</div>
              </span>
              <span>
                <h4>
                  <strong>{token2Balance}</strong>
                </h4>
                <div className="subheading">Total Token2 balance in pool</div>
              </span>
            </div>
            {stage === 'Contributing' && (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewPool
