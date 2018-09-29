function isMetamasInstalled() {
  const { web3 } = window;

  if (web3 === undefined || web3.currentProvider.constructor.name !== 'MetamaskInpageProvider') {
    return false;
  } else {
    return true;
  }
}

export default isMetamasInstalled;
