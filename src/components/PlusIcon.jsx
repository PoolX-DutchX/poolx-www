import React from 'react';
import AddCircle from '@material-ui/icons/AddCircle';

const PlusIcon = props => {
  const { tilt, color = 'inherit', disabled, ...rest } = props;
  const style = {
    color: disabled ? 'rgba(0, 0, 0, 0.26)' : color,
    transform: tilt ? 'rotate(45deg)' : 'none',
    cursor: 'pointer',
  };
  return <AddCircle style={style} {...rest} />;
};

export default PlusIcon;
