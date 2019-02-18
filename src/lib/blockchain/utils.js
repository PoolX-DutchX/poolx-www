import Web3 from 'web3'

const MAINNET_ID = 1
const MORDEN_ID = 2
const ROPSTEN_ID = 3
const RINKEBY_ID = 4
const KOVAN_ID = 42

async function getNetwork(networkId) {
  const web3 = await getWeb3()
  const id = networkId || (await web3.eth.net.getId())

  let name
  let etherscan
  console.log('id', id)
  switch (id) {
    case MAINNET_ID:
      name = 'Mainnet'
      etherscan = 'https://etherscan.io/'
      break
    case MORDEN_ID:
      name = 'Morden Test Network'
      break
    case ROPSTEN_ID:
      name = 'Ropsten Test Network'
      etherscan = 'https://ropsten.etherscan.io/'
      break
    case RINKEBY_ID:
      name = 'Rinkeby Test Network'
      etherscan = 'https://rinkeby.etherscan.io/'
      break
    case KOVAN_ID:
      name = 'Kovan Test Network'
      etherscan = 'https://kovan.etherscan.io/'
      break
    default:
      name = 'ganache' // a.k.a. localhost
      break
  }
  return { id, name, etherscan }
}

function getWeb3() {
  Web3.providers.HttpProvider.prototype.sendAsync =
    Web3.providers.HttpProvider.prototype.send
  const web3 = new Web3(window.web3.currentProvider)
  return web3
}

function isMetamaskInstalled() {
  const { web3 } = window

  if (
    web3 === undefined ||
    web3.currentProvider.constructor.name !== 'MetamaskInpageProvider'
  ) {
    return false
  } else {
    return true
  }
}

export { getNetwork, getWeb3, isMetamaskInstalled }
