import { Connectors } from 'web3-react'
const { InjectedConnector, NetworkOnlyConnector } = Connectors

const supportedNetworkURLs = {
  4: 'https://rinkeby.infura.io/v3/a7fc9e96cb5b4b95b0d40b8a76e25747',
}

const Injected = new InjectedConnector({
  supportedNetworks: [4],
})

const Network = new NetworkOnlyConnector({
  providerURL: supportedNetworkURLs[4],
})

export default { Injected, Network }
