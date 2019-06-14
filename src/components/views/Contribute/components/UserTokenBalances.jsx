import React, { useState, useEffect, useContext } from 'react'
import { fetchUserTokenBalances } from '../../web3Helpers/contributePool/contribute'
import { TokenBalancesContext } from '../TokenBalancesContext'

const UserTokenBalances = ({ token1, token2, account, web3 }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [tokenBalances, setTokenBalances] = useContext(TokenBalancesContext)

  const transfromFromWei = number => {
    const result = web3.utils.fromWei(number.toString(), 'ether')
    return Number(result)
  }

  useEffect(() => {
      fetchUserTokenBalances({ token1, token2, account })
      .then(values => {
        const [
          token1Data,
          token2Data,
        ] = values

        setTokenBalances({
          token1Name: token1Data.tokenName,
          token2Name: token2Data.tokenName,
          token1Balance: transfromFromWei(token1Data.userBalance),
          token2Balance: transfromFromWei(token2Data.userBalance),
        })

        setIsLoading(false)
      })
  }, [token1, token2, account])

  if (isLoading) return (<div>Loading Balances ...</div>)
  const { token1Name, token2Name, token1Balance, token2Balance } = tokenBalances

  return (
    <div>
      <h3>Your {token1Name} balance: {token1Balance}</h3>
      <h3>Your {token2Name} balance: {token2Balance}</h3>
    </div>
  )
}

export default UserTokenBalances