import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import InformationIcon from '@material-ui/icons/Info';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  relative: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
    top: '-10px',
  },
});

function WithTooltip({
  children,
  title,
  placement = 'bottom-start',
  iconColor = 'inherit',
  classes,
}) {
  return (
    <span className={classes.relative}>
      {children}
      <Tooltip placement={placement} title={title}>
        <InformationIcon color={iconColor} className={classes.absolute} />
      </Tooltip>
    </span>
  );
}

export default withStyles(styles)(WithTooltip);
