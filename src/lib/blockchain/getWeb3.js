import Web3 from 'web3'
import config from '../../configuration'
const { nodeConnection } = config

const getWeb3 = () => {
  Web3.providers.HttpProvider.prototype.sendAsync =
    Web3.providers.HttpProvider.prototype.send
  let provider

  if (window.ethereum) {
    provider = new Web3(window.ethereum)
    window.ethereum.enable().catch(() => {})
  } else if (window.web3) {
    provider = new Web3(window.web3.currentProvider)
  } else {
    provider = new Web3(nodeConnection)
  }
  return provider
}

export default getWeb3
