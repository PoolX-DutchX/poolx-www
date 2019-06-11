import config from './configuration'

export const getEtherscanTxLink = txHash => {
  return `${config.etherscan}/tx/${txHash}`
}
