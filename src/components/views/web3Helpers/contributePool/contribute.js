import {
  showToastOnTxSubmitted,
  showToastOnTxConfirmation,
  showToastOnTxError,
} from '../shared/showToasts'
import { getPoolData } from '../shared/commonWeb3Helpers'

import ERC20Abi from '../shared/ERC20Abi.json'
import poolAbi from '../shared/poolAbi.json'
import BigNumber from 'bignumber.js'
import getWeb3 from '../../../../lib/blockchain/getWeb3'
import config from '../../../../configuration'

const { numberOfConfirmations } = config
const web3 = getWeb3()

export const contributeToPool = ({
  amount,
  isContributingToken2,
  token1,
  token2,
  account,
  poolAddress,
}) => {
  const tokenContract = new web3.eth.Contract(
    ERC20Abi,
    isContributingToken2 ? token2 : token1
  )
  const poolContract = new web3.eth.Contract(poolAbi, poolAddress)
  const amountInWei = new BigNumber(amount).times(1e18).toString()

  return new Promise((resolve, rejection) => {
    tokenContract.methods
      .approve(poolAddress, amountInWei)
      .send({ from: account })

      .on('transactionHash', txHash => {
        showToastOnTxSubmitted(txHash, 'contribution')
      })
      .once('confirmation', () => {
        poolContract.methods
          .contribute(
            isContributingToken2 ? 0 : amountInWei,
            isContributingToken2 ? amountInWei : 0
          )
          .send({
            from: account,
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            showToastOnTxConfirmation(
              confirmationNumber,
              receipt,
              'contribution'
            )

            if (confirmationNumber === numberOfConfirmations)
              return resolve(receipt)
          })
          .on('error', (error, receipt) => {
            showToastOnTxError(receipt)
            return rejection(error)
          })
      })
      .on('error', (error, receipt) => {
        showToastOnTxError(receipt, 'contribution')
        return rejection(error)
      })
  })
}

export const fetchContributionPageData = poolAddress =>
  Promise.all([
    getPoolData(poolAddress, 'stage'),
    getPoolData(poolAddress, 'token1'),
    getPoolData(poolAddress, 'token2'),
    getPoolData(poolAddress, 'isAuctionWithWeth'),
    getPoolData(poolAddress, 'token1ThresholdReached'),
    getPoolData(poolAddress, 'token2ThresholdReached'),
  ])

export const getTokenInfo = ({ tokenAddress, account }) => {
  const tokenContract = new web3.eth.Contract(ERC20Abi, tokenAddress)

  return new Promise(async (resolve, reject) => {
    try {
      const userBalance = await tokenContract.methods.balanceOf(account).call()
      const tokenName = await tokenContract.methods.name().call()
      resolve({ userBalance, tokenName })
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })
}

export const fetchUserTokenBalances = ({ token1, token2, account }) =>
  Promise.all([
    getTokenInfo({ tokenAddress: token1, account }),
    getTokenInfo({ tokenAddress: token2, account }),
  ])
