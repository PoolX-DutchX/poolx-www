import { Connectors } from 'web3-react'
const { InjectedConnector, NetworkOnlyConnector } = Connectors

const supportedNetworkURLs = {
  1: 'https://mainnet.infura.io/v3/60ab76e16df54c808e50a79975b4779f',
  4: 'https://rinkeby.infura.io/v3/60ab76e16df54c808e50a79975b4779f',
}

const Injected = new InjectedConnector({
  supportedNetworks: [1, 4],
})

const Network = new NetworkOnlyConnector({
  providerURL: supportedNetworkURLs[4],
})

export default { Injected, Network }
