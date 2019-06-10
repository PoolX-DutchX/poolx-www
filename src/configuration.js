export const ENV_LOCALHOST = 'localhost'
export const ENV_STAGING = 'staging'
export const ENV_PRODUCTION = 'production'

const {
  REACT_APP_ENVIRONMENT = ENV_LOCALHOST, // optional
  REACT_APP_DECIMALS = 8, // optional
  REACT_APP_FEATHERJS_CONNECTION_URL,
  REACT_APP_ETH_NODE_CONNECTION_URL,
  REACT_APP_BLOCKEXPLORER,
  REACT_APP_BUGS_EMAIL = 'bugs@poolx.io',
} = process.env

const configurations = {
  [ENV_LOCALHOST]: {
    title: 'Ganache',
    poolFactoryAddress: '0xef14E0F46aC65C241a8A602AcF90e8AC513d126A',
    poolLibraryAddress: '0x7270FA39099bFbB8d1914c3cD99873e2d1C23184',
    dxAddress: '0x7b7DC59ADBE59CA4D0eB32042fD5259Cf5329DE1',
    dxProxyAddress: '0xaaeb2035ff394fdb2c879190f95e7676f1a9444b',
    wethAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    networkName: 'ganache',
    networkId: 123456789123456789,
    etherscan: 'https://rinkeby.etherscan.io/', // this won't work, only here so we can see links during development
    feathersConnection: 'http://localhost:3030',
    nodeConnection: 'ws://localhost:8545',
  },
  [ENV_STAGING]: {
    title: 'staging',
    poolFactoryAddress: '0xef14E0F46aC65C241a8A602AcF90e8AC513d126A',
    poolLibraryAddress: '0x7270FA39099bFbB8d1914c3cD99873e2d1C23184',
    dxAddress: '0x7b7DC59ADBE59CA4D0eB32042fD5259Cf5329DE1', // https://dutchx.readthedocs.io/en/latest/smart-contracts_addresses.html#rinkeby
    dxProxyAddress: '0xaaeb2035ff394fdb2c879190f95e7676f1a9444b', // https://dutchx.readthedocs.io/en/latest/smart-contracts_addresses.html#rinkeby
    wethAddress: '0xc778417e063141139fce010982780140aa0cd5ab', // https://dutchx.readthedocs.io/en/latest/add-token-pair.html#get-the-information-for-adding-a-token-pair
    networkName: 'rinkeby',
    networkId: 4,
    etherscan: 'https://rinkeby.etherscan.io/',
    feathersConnection: 'https://poolx-api.herokuapp.com/',
    nodeConnection: 'wss://rinkeby.infura.io/ws',
  },
  [ENV_PRODUCTION]: {
    title: 'production',
    poolFactoryAddress: '0x1ce25E5Db192BB0804aA75D0cA3C7A4f2788Fe10',
    eventEmitterAddress: '0xd84e2462b412bba3fd81f95812823f7c6a72bab9',
    networkName: 'mainnet',
    networkId: 1,
    etherscan: 'https://etherscan.io/',
    feathersConnection: 'https://feathers.mainnet.giveth.io',
    nodeConnection: 'wss://mew.giveth.io/ws',
  },
}

// Unknown environment
if (configurations[REACT_APP_ENVIRONMENT] === undefined)
  throw new Error(
    `There is no configuration object for environment: ${REACT_APP_ENVIRONMENT}. Expected REACT_APP_ENVIRONMENT to be empty or one of: ${Object.keys(
      configurations
    )}`
  )

// Create config object based on environment setup
const config = Object.assign({}, configurations[REACT_APP_ENVIRONMENT])

// Overwrite the environment values with parameters
config.etherscan = REACT_APP_BLOCKEXPLORER || config.etherscan
config.feathersConnection =
  REACT_APP_FEATHERJS_CONNECTION_URL || config.feathersConnection
config.nodeConnection =
  REACT_APP_ETH_NODE_CONNECTION_URL || config.nodeConnection
config.decimals = REACT_APP_DECIMALS
config.bugsEmail = REACT_APP_BUGS_EMAIL
config.sendErrors = [ENV_STAGING, ENV_PRODUCTION].includes(
  REACT_APP_ENVIRONMENT
)
config.env = REACT_APP_ENVIRONMENT

export default config
