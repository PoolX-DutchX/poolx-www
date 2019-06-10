import poolAbi from './poolAbi.json'
import getWeb3 from '../../../../lib/blockchain/getWeb3'
const web3 = getWeb3()

const mapPoolStage = {
  0: 'Initialization',
  1: 'Contribution',
  2: 'Collection',
  3: 'Claim',
}

export const getPoolStage = stageIndex => mapPoolStage[stageIndex]

export const getPoolData = (poolAddress, funcIdentifier) => {
  new Promise((resolve, reject) => {
    try {
      const contract = new web3.eth.Contract(poolAbi, poolAddress)
      contract.methods[funcIdentifier]()
        .call()
        .then(data => {
          console.log({ data, funcIdentifier })
          resolve(data)
        })
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })
}
