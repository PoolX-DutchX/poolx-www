import dutchXAbi from '../shared/dutchXAbi.json'
import poolAbi from '../shared/poolAbi.json'
import { getPoolData } from '../shared/commonWeb3Helpers'
import getWeb3 from '../../../../lib/blockchain/getWeb3'

import config from '../../../../configuration'

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

const getAuctionIndexInDutchX = (token1, token2) =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(dutchXAbi, config.dxProxyAddress)
      const tokenBalancesInUsd = await contract.methods
        .getAuctionIndex(token1, token2)
        .call()

      resolve(tokenBalancesInUsd)
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })

const getAuctionStartInDutchX = (token1, token2) =>
  new Promise(async (resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(dutchXAbi, config.dxProxyAddress)
      const tokenBalancesInUsd = await contract.methods
        .getAuctionStart(token1, token2)
        .call()

      resolve(tokenBalancesInUsd)
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })

export default async (poolAddress, userAddress) => {
  const [token1, token2] = await Promise.all([
    getPoolData(poolAddress, 'token1'),
    getPoolData(poolAddress, 'token2'),
  ])

  return Promise.all([
    getPoolData(poolAddress, 'token1Balance'),
    getPoolData(poolAddress, 'token2Balance'),
    getPoolData(poolAddress, 'name'),
    getPoolData(poolAddress, 'description'),
    getPoolData(poolAddress, 'currentDxThreshold'),
    getTokenBalancesInUsd(poolAddress),
    getPoolData(poolAddress, 'stage'),
    Promise.resolve(token1),
    Promise.resolve(token2),
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
    getAuctionIndexInDutchX(token1, token2),
    getAuctionStartInDutchX(token1, token2),
  ])
}
