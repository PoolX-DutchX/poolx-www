import React from 'react'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

const rowTitleMapping = {
  token1: 'Token 1',
  token2: 'Token 2',
  initialClosingPrice: 'Token1 / Token 2 Initial Price',
  willUseWeth: 'Using Wrapped ETH (WETH)'
}

export default ({ formik: { values } }) => (
  <Paper>
    <Table>
      <TableBody>
        {Object.entries(values).map(([key, value], index) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              {rowTitleMapping[key]}
            </TableCell>
            <TableCell>{`${value}`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
)
