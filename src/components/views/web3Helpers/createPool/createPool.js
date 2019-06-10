import poolXCloneFactoryAbi from '../shared/poolXCloneFactoryAbi.json'
import config from '../../../../configuration'
import { wholeNumberToFractionArray } from './fraction'
import {
  showToastOnTxSubmitted,
  showToastOnTxConfirmation,
  showToastOnTxError,
} from '../shared/showToasts'
import getWeb3 from '../../../../lib/blockchain/getWeb3'
const web3 = getWeb3()
const { poolFactoryAddress, dxProxyAddress } = config

export default (
  ethereumAddressFrom,
  { name, description, token1, token2, initialClosingPrice }
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
        dxProxyAddress,
        token1,
        token2,
        initialClosingPriceNum,
        initialClosingPriceDen,
        name,
        description
      )
      .send({
        from: ethereumAddressFrom,
      })
      .on('transactionHash', txHash => {
        showToastOnTxSubmitted(txHash)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        showToastOnTxConfirmation(confirmationNumber, receipt)

        if (confirmationNumber === 2) return resolve(receipt)
      })
      .on('error', (error, receipt) => {
        showToastOnTxError(receipt)
        return reject(error)
      })
  })
}
