import React from 'react';

import Pool from '../../../../models/Pool';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

/**
 * Shows the statistics on DACs, Campaigns and milestonesCount
 *
 * TODO: Check the properties that are passed, sometimes they are number, sometimes strings...
 */
const PoolReview = ({ formik: { values } }) => {
  const {
    name,
    description,
    ownerAddress,
    maxAllocation,
    minContribution,
    maxContribution,
    fee,
    feePayoutCurrency,
    admins,
    lockPayoutAddress,
    payoutAddress,
    payoutTxData,
    hasWhitelist,
    whitelist
  } = values;
  return (
    <Paper>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              Pool Name
            </TableCell>
            <TableCell>{name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Pool Description
            </TableCell>
            <TableCell>{description}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Wallet Address
            </TableCell>
            <TableCell>{ownerAddress}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Max allocation
            </TableCell>
            <TableCell>{maxAllocation} Ξ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Min/Max Contribution
            </TableCell>
            <TableCell>{minContribution} Ξ / {maxContribution} Ξ</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Your fee
            </TableCell>
            <TableCell>{fee}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Fee payout currency
            </TableCell>
            <TableCell>{(feePayoutCurrency === Pool.CURRENCY_ETHER) ? 'Ether' : 'Token'} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Admins
            </TableCell>
            <Table>
              <TableBody>
                {
                    !!admins.length && admins.map(({address, name}, index) => {
                      return (
                        <TableRow key={index}>
                            <TableCell>{address}</TableCell>
                            <TableCell>{name}</TableCell>
                        </TableRow>
                      )
                    })
                }
              </TableBody>
            </Table>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              Lock destination
            </TableCell>
            <TableCell>{String(lockPayoutAddress)}</TableCell>
          </TableRow>
          {
            lockPayoutAddress && payoutAddress && <TableRow>
              <TableCell component="th" scope="row">
                Desintation Address
              </TableCell>
              <TableCell>{payoutAddress}</TableCell>
            </TableRow>
          }
          {
            lockPayoutAddress && payoutTxData && <TableRow>
              <TableCell component="th" scope="row">
                Destination Tx Data
              </TableCell>
              <TableCell>{payoutTxData}</TableCell>
            </TableRow>
          }
          {
            hasWhitelist && !!whitelist.length && <TableRow>
              <TableCell component="th" scope="row">
                Whitelist
              </TableCell>
              <Table>
                <TableBody>
                  {
                      whitelist.map(({address, name}, index) => {
                        return (
                          <TableRow key={index}>
                              <TableCell>{address}</TableCell>
                              <TableCell>{name}</TableCell>
                          </TableRow>
                        )
                      })
                  }
                </TableBody>
              </Table>
            </TableRow>
          }
        </TableBody>
      </Table>
    </Paper>
)};
//
// PoolReview.propTypes = {
//   pool: PropTypes.object.isRequired
// };

export default PoolReview;
