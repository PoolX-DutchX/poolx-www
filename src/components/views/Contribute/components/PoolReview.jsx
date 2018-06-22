import React from 'react';
import PropTypes from 'prop-types';

import Pool from '../../../../models/Pool';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

/**
 * Shows the statistics on DACs, Campaigns and milestonesCount
 *
 * TODO: Check the properties that are passed, sometimes they are number, sometimes strings...
 */
const PoolReview = ({ pool }) => { return (
  <Paper>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell component="th" scope="row">
            Pool Name
          </TableCell>
          <TableCell>{pool.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Wallet Address
          </TableCell>
          <TableCell>{pool.wallet}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Pool Cap
          </TableCell>
          <TableCell>{pool.cap} Ξ</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Min/Max Contribution
          </TableCell>
          <TableCell>{pool.minContribution} Ξ / {pool.maxContribution} Ξ</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Your fee
          </TableCell>
          <TableCell>{pool.fee}%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Fee payout currency
          </TableCell>
          <TableCell>{(pool.feePayoutCurrency === Pool.CURRENCY_ETHER) ? 'Ξther' : 'Token'} </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Admin Addresses
          </TableCell>
          <TableCell>
            {
                !!pool.adminAddresses.length && pool.adminAddresses.map((address, index) => {
                  return (
                    <TableRow key={index}>
                        <TableCell>{address}</TableCell>
                    </TableRow>
                  )
                })
            }
          </TableCell>
        </TableRow>
        {
          pool.destinationAddress && <TableRow>
            <TableCell component="th" scope="row">
              Desintation Address
            </TableCell>
            <TableCell>{pool.destinationAddress}</TableCell>
          </TableRow>
        }
        {
          pool.destinationData && <TableRow>
            <TableCell component="th" scope="row">
              Destination Field Data
            </TableCell>
            <TableCell>{pool.destinationData}</TableCell>
          </TableRow>
        }
        <TableRow>
          <TableCell component="th" scope="row">
            Pool Description
          </TableCell>
          <TableCell>{pool.description}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Paper>
)};

PoolReview.propTypes = {
  pool: PropTypes.object.isRequired
};

export default PoolReview;
