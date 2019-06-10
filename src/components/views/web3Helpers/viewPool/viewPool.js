import poolAbi from '../shared/poolAbi.json'
import { getPoolData } from '../shared/commonWeb3Helpers'
import getWeb3 from '../../../../lib/blockchain/getWeb3'
const web3 = getWeb3()

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

const getUserTokenContribution = (poolAddress, userAddress, funcIdentifier) =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(poolAbi, poolAddress)
      const userContribution = await contract.methods[funcIdentifier](
        userAddress
      ).call()
      resolve(userContribution)
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })

export default (poolAddress, userAddress) =>
  Promise.all([
    getPoolData(poolAddress, 'token1Balance'),
    getPoolData(poolAddress, 'token2Balance'),
    getPoolData(poolAddress, 'name'),
    getPoolData(poolAddress, 'description'),
    getPoolData(poolAddress, 'currentDxThreshold'),
    getTokenBalancesInUsd(poolAddress),
    getPoolData(poolAddress, 'stage'),
    getPoolData(poolAddress, 'token1'),
    getPoolData(poolAddress, 'token2'),
    getPoolData(poolAddress, 'token1ThresholdReached'),
    getPoolData(poolAddress, 'token2ThresholdReached'),
    getUserTokenContribution(
      poolAddress,
      userAddress,
      'contributorToken1Amount'
    ),
    getUserTokenContribution(
      poolAddress,
      userAddress,
      'contributorToken2Amount'
    ),
  ])
