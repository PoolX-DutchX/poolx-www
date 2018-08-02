import React from 'react';
import PropTypes from 'prop-types';

import Pool from '../../../../models/Pool';
import { copyToClipboard } from '../../../../lib/helpers';

import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    margin: '0 1rem',
  },
  input: {
    'text-align': 'right',
  }
};

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
    const { classes, data } = this.props;
    console.log('data', data);
    console.log('data.length', data.length);
    return (
      <div id="deploy-data-fields">
        <div>
          {
            data.map(({label, value}, index) => {
              return (<div key={index} className="data-field">
                <span className='label'>{label}</span>
                <Input
                className="input"
                classes={{
                  root: classes.root,
                  input: classes.input
                }}
                value={value}
                inputRef={node => this._nodes[index] = node}
                inputProps={{
                  spellcheck: "false"
                }}
                fullWidth
                />
                <Button variant="contained" size="small" color="primary" onClick={this.handleClick(index)}>
                  Copy
                </Button>
              </div>)
            })
          }
        </div>
      </div>
    );
  }
}

DeployDataFields.propTypes = {
  data: PropTypes.array.isRequired
};

export default withStyles(styles)(DeployDataFields);
