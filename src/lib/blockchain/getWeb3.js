import Web3 from 'web3';

const getWeb3 = () => {
  Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
  const web3 = new Web3(window.web3.currentProvider);
  return web3;
};

export default getWeb3;
