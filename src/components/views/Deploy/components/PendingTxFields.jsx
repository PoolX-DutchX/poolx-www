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

class PendingTxFields extends React.Component {
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
    const { classes, pendingTx } = this.props;

    return (
      <div id="deploy-data-fields">
        <div>
          {
            getFieldsArray(pendingTx).map(({label, value}, index) => {
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
                  spellCheck: "false"
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

PendingTxFields.propTypes = {
  pendingTx: PropTypes.object.isRequired
};

export default withStyles(styles)(PendingTxFields);


const getFieldsArray = ({ toAddress, amount, gasLimit, data }) => {
  return [
    {
      value: toAddress,
      label: 'To Address'
    },
    {
      value: amount,
      label: 'Amount to Send'
    },
    {
      value: gasLimit,
      label: 'Gas Limit'
    },
    {
      value: data,
      label: 'Transaction Data'
    },
  ];
}
