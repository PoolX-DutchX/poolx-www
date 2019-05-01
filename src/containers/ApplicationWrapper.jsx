import React from 'react';
import Web3Provider from 'web3-react'
import connectors from './connectors'
import Application from './Application'

export default function AppWrapper () {
  return (
    <Web3Provider
      connectors={connectors}
      libraryName={'ethers.js'}
    >
      <Application />
    </Web3Provider>
  )
}