import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js';

import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import Loader from '../Loader'
import WithTooltip from '../WithTooltip'

import fetchPoolData from './web3Helpers/viewPool/viewPool'
import isEmpty from 'lodash/isEmpty'

BigNumber.config({ DECIMAL_PLACES: 18 });
const ViewPool = ({ match }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [poolData, setPoolData] = useState({})

  useEffect(() => {
    const {
      params: { poolAddress },
    } = match

    fetchPoolData(poolAddress).then(values => {
      console.log(values)

      const [
        token1BalanceResult,
        token2BalanceResult,
        name,
        description,
        currentDxThreshold,
        tokenBalancesInUsd,
      ] = values

      const tokenBalanceArray = Object.entries(tokenBalancesInUsd).map(
        ([, value]) => value
      )
      const [token1BalanceInUsd, token2BalanceInUsd] = tokenBalanceArray

      console.log({ token1BalanceInUsd, token2BalanceInUsd, tokenBalanceArray })

      setPoolData({
        token1Balance: token1BalanceResult.toNumber(),
        token2Balance: token2BalanceResult.toNumber(),
        name,
        description,
        currentDxThreshold: currentDxThreshold,
        token1BalanceInUsd: token1BalanceInUsd,
        token2BalanceInUsd: token2BalanceInUsd,
      })

      setIsLoading(false)
    })
  }, [isEmpty(poolData)])

  // const contribute = () => {
  //   const { history } = this.props;
  //   if (!this.props.currentUser) {
  //     React.swal({
  //       title: "You're almost there...",
  //       content: React.swal.msg(
  //         <p>
  //           It&#8217;s great to see that you want to contribute, however, if you first sign in or
  //           sign up, you'll get the benefit of tracking your contributions after they're made.{' '}
  //           <br />
  //           <br />
  //           You can also continue anonymously.
  //         </p>,
  //       ),
  //       icon: 'info',
  //       buttons: {
  //         signin: {
  //           text: 'Signin',
  //         },
  //         signup: {
  //           text: 'Signup',
  //         },
  //         continue: {
  //           text: 'Continue',
  //         },
  //       },
  //     }).then(value => {
  //       switch (value) {
  //         case 'signin':
  //           history.push('/signin');
  //           break;
  //         case 'signup':
  //           history.push('/signup');
  //           break;
  //         case 'continue':
  //           history.push(`/pools/${this.state.pool.id}/contribute`);
  //           break;
  //         default:
  //           break;
  //       }
  //     });
  //   } else {
  //     history.push(`/pools/${this.state.pool.id}/contribute`);
  //   }
  // }
  const contribute = () => console.log('I have been clicked')

  if (isLoading) return <Loader className="fixed" />

  const {
    token1Balance,
    token2Balance,
    name,
    description,
    currentDxThreshold,
    token1BalanceInUsd,
    token2BalanceInUsd,
  } = poolData

  const poolProgress = token1BalanceInUsd.add(token2BalanceInUsd).div(currentDxThreshold).mul(100).toNumber();
  console.log({ currentDxThreshold, poolProgress })

  return (
    <div id="view-pool-view" className="container">
      <div>
        <div className="row justify-content-between">
          <div className="col-md-6 ">
            <h1>
              <strong>{name}</strong>
            </h1>
            {/* <div className="pool-creator">
                  Pool Creator Verified{' '}
                  <img src="/img/telegram_logo.png" width="20" alt="Telegram logo" /> KYC
                </div> */}
            {/* !!this.state.myContributions.length && (
                  <div className="alert alert-success row my-contributions-panel" role="alert">
                    <div className="col-md-4 ">
                      <h6>
                        <WithTooltip title="Sum total of all your contributions for this pool">
                          My Contribution
                        </WithTooltip>
                      </h6>
                      <h2>{this.state.myContributionTotal.toFixed(2)} Eth</h2>
                    </div>
                    <div className="col-md-8 ">
                      <h6>My Transactions</h6>
                      {this.state.myContributions.map((contribution, index) => (
                        <div key={index}>Deposit {contribution.amount.toFixed(2)} Eth</div>
                      ))}
                    </div>
                  </div>
                      )*/}
            <p className="info-disclaimer">
              The following information is provided by the pool creator
            </p>
            <p>{description}</p>
          </div>
          <div className="col-md-5 pool-action-panel">
            <h3>
              <strong>Progress to reach threshold</strong>
            </h3>
            <LinearProgress variant="determinate" value={poolProgress} />
            <div className="total-invested-section">
              <h4 className="invested">
                <strong>
                  {token1BalanceInUsd.add(token2BalanceInUsd).toString()} USD
                </strong>
              </h4>
              <div className="subheading">
                of { currentDxThreshold.toString() } USD threshold
              </div>
            </div>
            <div className="min-max-section">
              <span>
                <h4>
                  <strong>{token1Balance}</strong>
                </h4>
                <div className="subheading">Token1 balance</div>
              </span>
              <span>
                <h4>
                  <strong>{token2Balance}</strong>
                </h4>
                <div className="subheading">Token2 balance</div>
              </span>
            </div>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={contribute}
              disabled={false}
            >
              Contribute to Pool
            </Button>
            <div className="row margin-top-bottom">
              <div className="col">
                <Button variant="outlined" fullWidth>
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewPool
