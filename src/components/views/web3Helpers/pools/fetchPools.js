import poolXCloneFactoryAbi from '../shared/poolXCloneFactoryAbi.json'
import getWeb3 from '../../../../lib/blockchain/getWeb3'
import config from '../../../../configuration'

const web3 = getWeb3()
const { poolFactoryAddress } = config

export default () =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(
        poolXCloneFactoryAbi,
        poolFactoryAddress
      )

      const data = await contract.methods.getPools.call()
      console.log({ data })
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
