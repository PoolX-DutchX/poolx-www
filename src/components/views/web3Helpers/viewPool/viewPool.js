import poolAbi from './poolAbi.json'
import isMetamasInstalled from '../../../../lib/blockchain/isMetamasInstalled'
import Web3 from 'web3'
import config from '../../../../configuration'
const web3 = isMetamasInstalled() && new Web3(Web3.givenProvider, null, {})
const { poolLibraryAddress } = config

export default () =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(poolAbi, poolLibraryAddress)
      const token1Balance = await contract.methods.token1Balance().call()
      resolve(token1Balance)
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })
