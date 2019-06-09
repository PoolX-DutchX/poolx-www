import {
  showToastOnTxSubmitted,
  showToastOnTxConfirmation,
  showToastOnTxError,
} from '../shared/showToasts'
import { getPoolData } from '../shared/commonWeb3Helpers'

import ERC20Abi from '../shared/ERC20Abi.json'
import poolAbi from '../shared/ERC20Abi.json'
import BigNumber from 'bignumber.js'
import getWeb3 from '../../../../lib/blockchain/getWeb3'
const web3 = getWeb3()

export const contributeToPool = ({
  amount,
  isContributingToken2,
  token1,
  token2,
  account,
  poolAddress,
}) => {
  return new Promise((res, rej) => {
    console.log({ amount, isContributingToken2 })

    const amountInWei = new BigNumber(amount).times(1e18).toString()

    const tokenContract = new web3.eth.Contract(
      ERC20Abi,
      isContributingToken2 ? token2 : token1
    )
    const poolContract = new web3.eth.Contract(poolAbi, poolAddress)

    tokenContract.methods
      .approve(poolAddress, amountInWei)
      .send({ from: account })

      .on('transactionHash', txHash => {
        showToastOnTxSubmitted(txHash)
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
            showToastOnTxConfirmation(confirmationNumber, receipt)

            if (confirmationNumber === 2) return res(receipt)
          })
          .on('error', (error, receipt) => {
            showToastOnTxError(receipt)
            return rej(error)
          })
      })
      .on('error', (error, receipt) => {
        showToastOnTxError(receipt)
        return rej(error)
      })
  })
}

export const fetchContributionPageData = poolAddress =>
  Promise.all([
    getPoolData(poolAddress, 'stage'),
    getPoolData(poolAddress, 'token1'),
    getPoolData(poolAddress, 'token2'),
  ])
