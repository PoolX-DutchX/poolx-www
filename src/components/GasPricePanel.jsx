import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  paper: {
    margin: '20px 0',
  },
  root: {
    flexGrow: 1,
  },
  item: {
    textAlign: 'center'
  }
});

class GasPricePanel extends Component {
  constructor() {
    super();
    this.state = {
      gasPrice: {}

    };
  }

  componentDidMount() {
    fetch("https://ethgasstation.info/json/ethgasAPI.json")
      .then((resp) => resp.json()) // Transform the data into json
      .then(({safeLow, average: standard, fast}) => {
        this.setState({
          gasPrice: {
            safeLow: safeLow/10,
            standard: standard/10,
            fast: fast/10
          }
        });
      });
  }

  render() {
    const { classes } = this.props;

    const { gasPrice: { safeLow, standard, fast }} = this.state;

    return <Paper className={classes.paper}>
      <Typography variant="title" gutterBottom>Recommended gas prices</Typography>
      <Typography variant="subheading" gutterBottom>(based on current network conditions)</Typography>
      <Grid container spacing={16} justify="space-between" className={classes.root} >
        <Grid item md={4} className={classes.item}>
          <Typography variant="subheading" gutterBottom>SafeLow(30m)</Typography>
          <Typography variant="title" gutterBottom>{(safeLow)} gwei</Typography>
        </Grid>
        <Grid item md={4} className={classes.item}>
        <Typography variant="subheading" gutterBottom>Standard(5m)</Typography>
        <Typography variant="title" gutterBottom>{(standard)} gwei</Typography>
        </Grid>
        <Grid item md={4} className={classes.item}>
        <Typography variant="subheading" gutterBottom>Fast(2m)</Typography>
        <Typography variant="title" gutterBottom>{(fast)} gwei</Typography>
        </Grid>
      </Grid>
    </Paper>
  }
}

GasPricePanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GasPricePanel);
