import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    width: '100%',
    color: '#3884FF',
    'max-width': '320px',
    background: '#FFFFFF',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

function PillButton(props) {
  const { classes, children, ...rest } = props;
  return (
    <Button variant="extendedFab" aria-label="delete" className={classes.button} {...rest}>
      {children}
    </Button>
  );
}

PillButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PillButton);
