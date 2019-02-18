import React from 'react'
const CircleStep = ({ step }) => {
  const style = {
    position: 'relative',
    top: '3px',
    marginRight: '0.5rem',
  }
  return (
    <svg width="24" height="24" style={style}>
      <circle cx="12" cy="12" r="12" fill="#4941B8" />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        fill="white"
        fontSize="14px"
        fontFamily="Arial"
        dy=".35em"
      >
        {step}
      </text>
    </svg>
  )
}

export default CircleStep
