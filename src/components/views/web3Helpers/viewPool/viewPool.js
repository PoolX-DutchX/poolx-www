import poolAbi from './poolAbi.json'
import isMetamasInstalled from '../../../../lib/blockchain/isMetamasInstalled'
import Web3 from 'web3'
const web3 = isMetamasInstalled() && new Web3(Web3.givenProvider, null, {})

const getPoolData = (poolAddress, funcIdentifier) =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(poolAbi, poolAddress)
      const data = await contract.methods[`${funcIdentifier}()`]().call()
      resolve(data)
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })

const getTokenBalancesInUsd = poolAddress =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(poolAbi, poolAddress)
      const tokenBalancesInUsd = await contract.methods
        .getFundedValueInUsd()
        .call()
      resolve(tokenBalancesInUsd)
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })

export default poolAddress =>
  Promise.all([
    getPoolData(poolAddress, 'token1Balance'),
    getPoolData(poolAddress, 'token2Balance'),
    getPoolData(poolAddress, 'name'),
    getPoolData(poolAddress, 'description'),
    getPoolData(poolAddress, 'currentDxThreshold'),
    getTokenBalancesInUsd(poolAddress),
  ])
