export const ENV_LOCALHOST = 'localhost';
export const ENV_STAGING = 'staging';
export const ENV_PRODUCTION = 'production';

const {
  REACT_APP_ENVIRONMENT = ENV_LOCALHOST, // optional
  REACT_APP_DECIMALS = 8, // optional
  REACT_APP_FEATHERJS_CONNECTION_URL,
  REACT_APP_ETH_NODE_CONNECTION_URL,
  REACT_APP_BLOCKEXPLORER,
  REACT_APP_BUGS_EMAIL = 'bugs@poolbase.io',
} = process.env;

const configurations = {
  [ENV_LOCALHOST]: {
    title: 'Ganache',
    poolFactoryAddress: '0x5904adeba7bc0550607c611e906e317338b8e6c2',
    eventEmitterAddress: '0xd84e2462b412bba3fd81f95812823f7c6a72bab9',
    networkName: 'ganache',
    networkId: 123456789123456789,
    etherscan: 'https://etherscan.io/', // this won't work, only here so we can see links during development
    feathersConnection: 'http://localhost:3030',
    nodeConnection: 'ws://localhost:8545',
  },
  [ENV_STAGING]: {
    title: 'staging',
    poolFactoryAddress: '0x1ce25E5Db192BB0804aA75D0cA3C7A4f2788Fe10',
    eventEmitterAddress: '0xd84e2462b412bba3fd81f95812823f7c6a72bab9',
    networkName: 'rinkeby',
    networkId: 4,
    etherscan: 'https://rinkeby.etherscan.io/',
    feathersConnection: 'https://poolbase-api.herokuapp.com/',
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
  }
};

// Unknown environment
if (configurations[REACT_APP_ENVIRONMENT] === undefined)
  throw new Error(
    `There is no configuration object for environment: ${REACT_APP_ENVIRONMENT}. Expected REACT_APP_ENVIRONMENT to be empty or one of: ${Object.keys(
      configurations,
    )}`,
  );

// Create config object based on environment setup
const config = Object.assign({}, configurations[REACT_APP_ENVIRONMENT]);

// Overwrite the environment values with parameters
config.etherscan = REACT_APP_BLOCKEXPLORER || config.etherscan;
config.feathersConnection = REACT_APP_FEATHERJS_CONNECTION_URL || config.feathersConnection;
config.nodeConnection = REACT_APP_ETH_NODE_CONNECTION_URL || config.nodeConnection;
config.decimals = REACT_APP_DECIMALS;
config.bugsEmail = REACT_APP_BUGS_EMAIL;
config.sendErrors = [ENV_STAGING, ENV_PRODUCTION].includes(REACT_APP_ENVIRONMENT);
config.env = REACT_APP_ENVIRONMENT;

export default config;
