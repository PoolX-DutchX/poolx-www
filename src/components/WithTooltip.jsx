import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import InformationIcon from '@material-ui/icons/Info';

function WithTooltip({children, title, placement = 'bottom-start', iconColor = 'inherit'}) {
  return <span>
    {children}
    <Tooltip placement={placement} title={title}>
      <InformationIcon color={iconColor}/>
    </Tooltip>
    </span>;
}

export default WithTooltip;
