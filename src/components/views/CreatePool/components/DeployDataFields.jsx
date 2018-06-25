import React from 'react';
import PropTypes from 'prop-types';

import { copyToClipboard } from '../../../../lib/helpers';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

/**
 * Shows the statistics on DACs, Campaigns and milestonesCount
 *
 * TODO: Check the properties that are passed, sometimes they are number, sometimes strings...
 */
class DeployDataFields extends React.Component {
  constructor(props) {
    super(props);
    this._nodes = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(index) {
    return  () => {
        copyToClipboard(this._nodes[index]);
    }
  }
  render() {
    const { data } = this.props;

    return (
      <Grid container spacing={24} direction="column">
        {
          data.map(({label, value}, index) => {
            return (<Grid container spacing={8} alignItems="flex-end" key={index}>
               <Grid item sm={11}>
                 <TextField
                   label={label}
                   value={value}
                   inputRef={node => this._nodes[index] = node}
                   fullWidth
                 />
               </Grid>
               <Grid item sm={1}>
                 <Button variant="contained" size="small" color="primary" onClick={this.handleClick(index)}>
                   Copy
                 </Button>
               </Grid>
             </Grid>)
          })
        }
       </Grid>
     );
  }

}

DeployDataFields.propTypes = {
  data: PropTypes.array.isRequired
};

export default DeployDataFields;
