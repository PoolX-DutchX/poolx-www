import poolXCloneFactoryAbi from './poolXCloneFactoryAbi.json'
import config from '../../../../configuration'
import { wholeNumberToFractionArray } from './fraction'
import {
  showToastOnTxSubmitted,
  showToastOnTxConfirmation,
  showToastOnTxError,
} from './showToasts'
import isMetamasInstalled from '../../../../lib/blockchain/isMetamasInstalled'
import Web3 from 'web3'
const web3 = isMetamasInstalled() && new Web3(Web3.givenProvider, null, {})
const { poolFactoryAddress, dxAddress } = config

export default (
  ethereumAddressFrom,
  { token1, token2, initialClosingPrice }
) => {
  const contract = new web3.eth.Contract(
    poolXCloneFactoryAbi,
    poolFactoryAddress
  )
  const [
    initialClosingPriceNum,
    initialClosingPriceDen,
  ] = wholeNumberToFractionArray(parseFloat(initialClosingPrice, 10))

  return new Promise((resolve, reject) => {
    contract.methods
      .createPool(
        dxAddress,
        token1,
        token2,
        initialClosingPriceNum,
        initialClosingPriceDen
      )
      .send({
        from: ethereumAddressFrom,
      })
      .on('transactionHash', txHash => {
        showToastOnTxSubmitted(txHash)

        return resolve(txHash)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        showToastOnTxConfirmation(confirmationNumber, receipt)
      })
      .on('error', (error, receipt) => {
        showToastOnTxError(receipt)
        return reject(error)
      })
  })
}
