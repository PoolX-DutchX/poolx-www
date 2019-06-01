import poolXCloneFactoryAbi from './poolXCloneFactoryAbi.json'
import config from '../../../../configuration'
import { wholeNumberToFractionArray } from './fraction'
import Web3 from 'web3'
import { toast } from 'react-toastify'
const { poolFactoryAddress, dxAddress, etherscan } = config
const web3 = new Web3(Web3.givenProvider, null, {})

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
      .once('transactionHash', hash => {
        toast.info(
          `Transaction created please see whether it has been confirmed at ${etherscan}/${hash}`,
          {
            autoClose: false,
          }
        )
        return resolve(hash)
      })
      .on('error', error => {
        toast.error(error.message, {
          autoClose: false,
        })
        return reject(error)
      })
  })
}
