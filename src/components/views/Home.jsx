import React from 'react'
import PillButton from '../PillButton.jsx'

const Home = ({ history }) => (
  <div id="home-view">
    <div className="page-wrap">
      <div className="top-section bg-color-light box-shadow">
        <div className="relative">
          <div className="container">
            <div className="row">
              <div className="col-sm-5 ">
                <h1>Powered by the Ethereum blockchain!</h1>
                <p>
                  Pool digital currency today with the security of smart
                  contracts
                </p>
                <PillButton onClick={() => history.push('/pools/create')}>
                  Create a Pool
                </PillButton>
              </div>
            </div>
          </div>

          <div className="bottom-banner">
            <div className="skew2 cover-all bg-color-medium" />
            <div className="relative">
              <div className="container wallet-providers" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default Home
