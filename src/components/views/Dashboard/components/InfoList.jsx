import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import blue from '@material-ui/core/colors/blue';

const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  primary: {
    overflow: 'hidden',
  }
};

class WalletList extends React.Component {
  render() {
    const { items = [], classes } = this.props;
    return (
      <List>
        {!!items.length && items.map(({icon, text, action}, index) => (
          <ListItem button key={index} onClick={action}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                {icon}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={text} className={classes.primary} />
          </ListItem>
        ))}
      </List>
    );
  }
}

WalletList.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array
};

export default withStyles(styles)(WalletList);
