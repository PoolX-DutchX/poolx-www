import React from 'react'

const WrongStage = ({ stage }) => (
  <center>
    <h1>{`Pool is not in Contributing stage, but rather in stage ${stage}`}</h1>
  </center>
)

export default WrongStage
