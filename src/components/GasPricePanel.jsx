import React, { Component } from 'react';

class GasPricePanel extends Component {
  constructor() {
    super();
    this.state = {
      gasPrice: {},
    };
  }

  componentDidMount() {
    fetch('https://ethgasstation.info/json/ethgasAPI.json')
      .then(resp => resp.json()) // Transform the data into json
      .then(({ safeLow, average: standard, fast }) => {
        this.setState({
          gasPrice: {
            safeLow: safeLow / 10,
            standard: standard / 10,
            fast: fast / 10,
          },
        });
      });
  }

  render() {
    const { gasPrice: { safeLow, standard, fast } } = this.state;

    return (
      <div className="gas-price-panel">
        <span>
          <div className="safe">SafeLow({'<'}30m)</div>
          <div>{safeLow} gwei</div>
        </span>
        <span>
          <div className="standard">Standard({'<'}5m)</div>
          <div>{standard} gwei</div>
        </span>
        <span>
          <div className="fast">Fast({'<'}2m)</div>
          <div>{fast} gwei</div>
        </span>
      </div>
    );
  }
}

export default GasPricePanel;
