import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'

const styles = theme => ({
  button: {
    margin: theme.spacing(),
    width: '100%',
    color: '#3884FF',
    'max-width': '320px',
    background: '#FFFFFF',
  },
  extendedIcon: {
    marginRight: theme.spacing(),
  },
})

function PillButton(props) {
  const { classes, children, ...rest } = props
  return (
    <Fab
      variant="extended"
      aria-label="delete"
      className={classes.button}
      {...rest}
    >
      {children}
    </Fab>
  )
}

PillButton.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(PillButton)
