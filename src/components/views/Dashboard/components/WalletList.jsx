import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import WalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import blue from '@material-ui/core/colors/blue';

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  primary: {
    overflow: 'hidden',
  },
};

class WalletList extends React.Component {
  render() {
    const { wallets = [], classes } = this.props;
    return (
      <List subheader={<ListSubheader component="div">Wallets</ListSubheader>}>
        {!!wallets.length &&
          wallets.map(({ address, name }) => (
            <ListItem key={address}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <WalletIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={address} secondary={name} className={classes.primary} />
            </ListItem>
          ))}
        <ListItem button onClick={() => this.handleListItemClick('addAccount')}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="add wallet" />
        </ListItem>
      </List>
    );
  }
}

WalletList.propTypes = {
  classes: PropTypes.object.isRequired,
  wallets: PropTypes.array,
};

export default withStyles(styles)(WalletList);
