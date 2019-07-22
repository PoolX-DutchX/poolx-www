import React, { useState, useEffect, useContext } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

import { fetchUserTokenBalances } from '../../web3Helpers/contributePool/contribute'
import { TokenBalancesContext } from '../TokenBalancesContext'

const SpacedPaper = styled(Paper)`
  margin-left: 20px;
`

const UserTokenBalances = ({ token1, token2, account, web3 }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [tokenBalances, setTokenBalances] = useContext(TokenBalancesContext)

  const transfromFromWei = number => {
    const result = web3.utils.fromWei(number.toString(), 'ether')
    return Number(result)
  }

  useEffect(() => {
    fetchUserTokenBalances({ token1, token2, account }).then(values => {
      const [token1Data, token2Data] = values

      setTokenBalances({
        token1Name: token1Data.tokenName,
        token2Name: token2Data.tokenName,
        token1Balance: transfromFromWei(token1Data.userBalance),
        token2Balance: transfromFromWei(token2Data.userBalance),
      })

      setIsLoading(false)
    })
  }, [token1, token2, account, setTokenBalances, transfromFromWei])

  if (isLoading) return <div>Loading Balances ...</div>
  const { token1Name, token2Name, token1Balance, token2Balance } = tokenBalances

  return (
    <SpacedPaper>
      <Typography component="p">
        Your {token1Name} balance: {token1Balance}
      </Typography>
      <Typography component="p">
        Your {token2Name} balance: {token2Balance}
      </Typography>
      <Typography Typography component="h3">
        <strong>
          NOTE: any surplus amount from reaching the contribution threshold will
          be sent back to you
        </strong>
      </Typography>
    </SpacedPaper>
  )
}

export default UserTokenBalances
