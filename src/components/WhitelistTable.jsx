import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableFooter from '@material-ui/core/TableFooter';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    display: 'block'
  }
});


const WhitelistTable = ({whitelist, classes}) => {
  return (
    <Paper className={classes.root}>
      <Table fixedheader="false" style={{ width: "auto", tableLayout: "auto" }}>
        <TableHead>
          <TableRow>
          <TableCell>Whitelisted Address</TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {whitelist.map((n, index) => {
            return (
              <TableRow key={index}>
                <TableCell padding="dense">{n.address}</TableCell>
                <TableCell padding="dense">
                {n.name}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default  withStyles(styles)(WhitelistTable);
