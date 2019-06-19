import poolXCloneFactoryAbi from '../shared/poolXCloneFactoryAbi.json'
import { getPoolData } from '../shared/commonWeb3Helpers'
import getWeb3 from '../../../../lib/blockchain/getWeb3'
import config from '../../../../configuration'

const web3 = getWeb3()
const { poolFactoryAddress } = config

export const fetchPools = () =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(
        poolXCloneFactoryAbi,
        poolFactoryAddress
      )

      const data = await contract.methods.getPools.call()
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })

export const fetchPoolNameDescriptionAddress = pool =>
  Promise.all([
    getPoolData(pool, 'name'),
    getPoolData(pool, 'description'),
    pool,
  ])
