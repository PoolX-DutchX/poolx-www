import React from 'react'

import Pool from '../../../../models/Pool'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

/**
 * Shows the statistics on DACs, Campaigns and milestonesCount
 *
 * TODO: Check the properties that are passed, sometimes they are number, sometimes strings...
 */
const PoolReview = ({ formik: { values } }) => {
  const {
    dutchXAddress,
    sellPriceDenominator,
    sellPriceNumerator,
    token1Address,
    token2Address,
  } = values

  console.log({ values })
  return (
    <Paper>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              Pool dutchXAddress
            </TableCell>
            <TableCell>{dutchXAddress}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Pool token1Address
            </TableCell>
            <TableCell>{token1Address}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Pool token2Address
            </TableCell>
            <TableCell>{token2Address}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Pool sellPriceNumerator
            </TableCell>
            <TableCell>{sellPriceNumerator}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Pool sellPriceDenominator
            </TableCell>
            <TableCell>{sellPriceDenominator}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}
//
// PoolReview.propTypes = {
//   pool: PropTypes.object.isRequired
// };

export default PoolReview
