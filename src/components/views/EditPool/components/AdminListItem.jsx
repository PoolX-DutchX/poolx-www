import React, { Component } from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

import PlusIcon from '../../../PlusIcon';

const addRemoveButtonStyles = {
  height: '43px',
  position: 'relative',
  top: '-1px',
};

class AdminListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovering: false,
    };
    this.handleMouseHover = this.handleMouseHover.bind(this);
  }
  handleMouseHover(entering) {
    return () => {
      this.setState({
        hovering: entering,
      });
    };
  }
  render() {
    const {
      admin,
      index,
      formik: { values, handleChange, handleBlur, touched, errors },
      fieldArrayHelpers: { push, remove },
      disabledFields,
    } = this.props;

    const { address, name } = admin;

    const touchedAdmin = touched.admins && touched.admins[index];
    const adminError = errors.admins && errors.admins[index];
    const getError = key => touchedAdmin && touchedAdmin[key] && adminError && adminError[key];
    const autoFocusProps = index !== 0 ? { autoFocus: true } : {};
    return (
      <div onMouseEnter={this.handleMouseHover(true)} onMouseLeave={this.handleMouseHover(false)}>
        <div className="row">
          <div className={!address ? 'd-flex col' : 'col-md-8'}>
            <TextField
              name={`admins.${index}.address`}
              label=""
              value={address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!getError('address')}
              helperText={getError('address')}
              placeholder="Add admin address (max 5)"
              autoComplete="Off"
              spellCheck="false"
              type="text"
              margin="dense"
              fullWidth
              disabled={disabledFields.admins}
              {...autoFocusProps}
            />
            {!address &&
              !disabledFields.admins &&
              this.state.hovering && (
                <div style={addRemoveButtonStyles}>
                  <Tooltip title="Remove">
                    <div>
                      <IconButton
                        aria-label="Remove item"
                        onClick={() => remove(index)}
                        disableRipple
                      >
                        <PlusIcon tilt color="grey" />
                      </IconButton>
                    </div>
                  </Tooltip>
                </div>
              )}
          </div>
          {address && (
            <div className="d-flex col-md-4">
              <TextField
                name={`admins.${index}.name`}
                label=""
                value={name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!getError('name')}
                helperText={getError('name')}
                placeholder="Name"
                autoComplete="Off"
                spellCheck="false"
                type="text"
                margin="dense"
                fullWidth
              />
              {!disabledFields.admins && (
                <div className="d-flex" style={{ height: '43px' }}>
                  {values.admins &&
                    values.admins.length < 5 &&
                    index === values.admins.length - 1 && (
                      <div style={this.state.hovering ? { marginRight: '-12px' } : {}}>
                        <Tooltip title="Add another">
                          <div>
                            <IconButton
                              aria-label="Add item"
                              onClick={() => {
                                if (errors.admins && errors.admins.length) return;
                                // if (values.admins && values.admins.length < 5) return
                                push({ address: '', name: '' });
                              }}
                              disabled={!address || !!errors.admins}
                              disableRipple
                            >
                              <PlusIcon disabled={!address || !!errors.admins} color="#3f51b5" />
                            </IconButton>
                          </div>
                        </Tooltip>
                      </div>
                    )}
                  {this.state.hovering && (
                    <Tooltip title="Remove">
                      <div>
                        <IconButton
                          aria-label="Remove item"
                          onClick={() => remove(index)}
                          disableRipple
                        >
                          <PlusIcon tilt color="grey" />
                        </IconButton>
                      </div>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AdminListItem;
//
// <div className="col-md-8 offset-md-4">
//   <ListItem dense disableGutters>
//     <CircleStep step={index}/>
//     <ListItemText
//       primary={label}
//       secondary={address}
//     />
//     { this.state.hovering && <div className="list-remove-button">
//         <Tooltip title="Remove">
//           <IconButton aria-label="Remove item" onClick={() => remove(index)} disableRipple>
//             <PlusIcon tilt color="grey" />
//           </IconButton>
//         </Tooltip>
//       </div>
//     }
//   </ListItem>
// </div>
