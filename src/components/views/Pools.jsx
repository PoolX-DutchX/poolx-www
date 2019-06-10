import React, { useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Loader from '../Loader'

import { Link } from 'react-router-dom'
import fetchPools from './web3Helpers/pools/fetchPools'
import isEmpty from 'lodash/isEmpty'

export default () => {
  const [isLoading, setIsLoading] = useState(true)
  const [pools, setPools] = useState(null)

  useEffect(() => {
    fetchPools().then(pools => {
      setPools(pools)
      setIsLoading(false)
    })
  }, [isEmpty(pools)])

  if (isLoading) return <Loader className="fixed" />

  return (
    <div id="multi-step-form">
      <div className="header">
        <div className="row">
          <section className="col-8 offset-2">
            <div>
              <h1 className="font-xl">Pools</h1>
              <p className="font-m">List of all pools</p>
            </div>
          </section>
        </div>
      </div>
      <div className="container main-wrap">
        <div className="row">
          <div className="col-md-12">
            { isEmpty(pools) &&
              <div className="fixed">
                <Link to={`/pools/create`}>
                  No pools created yet. Be the first one!
                </Link>
              </div>
            }
            <Paper>
              <Table>
                <TableBody>
                  {pools.map((pool, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {pool}
                      </TableCell>
                      <TableCell>
                        <Link to={`/pools/view-pool/${pool}`}>{pool}</Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  )
}