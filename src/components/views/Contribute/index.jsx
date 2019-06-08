import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BigNumber from 'bignumber.js'

import * as Yup from 'yup'

import User from '../../../models/User'
import ERC20Abi from './ERC20Abi.json'
import poolAbi from '../web3Helpers/viewPool/poolAbi.json'

import MultiStepForm from '../../MultiStepForm'
import StepOne from './components/Step_1'

import WrongStage from './WrongStage'
import Loader from '../../Loader'

import {
  showToastOnTxSubmitted,
  showToastOnTxConfirmation,
  showToastOnTxError,
} from '../web3Helpers/createPool/showToasts'

import getWeb3 from '../../../lib/blockchain/getWeb3'

import fetchPoolData from '../web3Helpers/viewPool/viewPool'
const web3 = getWeb3()

const mapPoolStage = {
  0: 'Initialization',
  1: 'Contribution',
  2: 'Collection',
  3: 'Claim',
}

/**
 * View flow to create a Contribution
 *
 * @param id       URL parameter which is an id of a pool object
 */

const Header = () => {
  return (
    <div>
      <h1 className="font-xl">Contribute</h1>
      <p className="font-m">...And get in on some of the action</p>
    </div>
  )
}

class Contribute extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      pool: {},
    }
  }

  componentDidMount() {
    web3.eth.getAccounts().then(accounts => {
      fetchPoolData(this.props.match.params.poolAddress, accounts[0]).then(
        values => {
          const [
            token1BalanceResult,
            token2BalanceResult,
            name,
            description,
            currentDxThreshold,
            tokenBalancesInUsd,
            stage,
            token1,
            token2,
            token1ThresholdReached,
            token2ThresholdReached,
            userContributionForToken1Amount,
            userContributionForToken2Amount,
          ] = values

          console.log({
            token1BalanceResult,
            token2BalanceResult,
            name,
            description,
            currentDxThreshold,
            tokenBalancesInUsd,
            stage,
            token1,
            token2,
            token1ThresholdReached,
            token2ThresholdReached,
            userContributionForToken1Amount,
            userContributionForToken2Amount,
          })

          const tokenBalanceArray = Object.entries(tokenBalancesInUsd).map(
            ([, value]) => value
          )
          const [token1BalanceInUsd, token2BalanceInUsd] = tokenBalanceArray

          this.setState({
            name,
            description,
            currentDxThreshold,
            token1BalanceInUsd,
            token2BalanceInUsd,
            stage: mapPoolStage[stage],
            userContributionForToken1Amount,
            userContributionForToken2Amount,
            token1,
            token2,
            token1ThresholdReached,
            token2ThresholdReached,
            isLoading: false,
          })
        }
      )
    })
  }

  render() {
    const {
      isLoading,
      pool: { minContribution, maxContribution },
      stage,
    } = this.state

    return (
      <div>
        {isLoading && <Loader className="fixed" />}
        {!isLoading && stage !== 'Contribution' && <WrongStage stage={stage} />}
        {!isLoading && stage === 'Contribution' && (
          <MultiStepForm
            header={<Header />}
            initialValues={{
              isContributingToken2: '',
              amount: '',
            }}
            stepLabels={['Contribution Details', 'Perform transaction']}
            onSubmit={({ amount, isContributingToken2 }) => {
              return new Promise((res, rej) =>
                web3.eth.getAccounts().then(accounts => {
                  console.log({ amount, isContributingToken2 })
                  console.log({ state: this.state })

                  const amountInWei = new BigNumber(amount)
                    .times(1e18)
                    .toString()

                  const { token1, token2 } = this.state
                  const { poolAddress } = this.props.match.params

                  const tokenContract = new web3.eth.Contract(
                    ERC20Abi,
                    isContributingToken2 ? token2 : token1
                  )
                  const poolContract = new web3.eth.Contract(
                    poolAbi,
                    poolAddress
                  )

                  tokenContract.methods
                    .approve(poolAddress, amountInWei)
                    .send({ from: accounts[0] })

                    .on('transactionHash', txHash => {
                      showToastOnTxSubmitted(txHash)
                    })
                    .once('confirmation', () => {
                      poolContract.methods
                        .contribute(
                          isContributingToken2 ? 0 : amountInWei,
                          isContributingToken2 ? amountInWei : 0
                        )
                        .send({
                          from: accounts[0],
                        })
                        .on('confirmation', (confirmationNumber, receipt) => {
                          showToastOnTxConfirmation(confirmationNumber, receipt)

                          if (confirmationNumber === 5) return res(receipt)
                        })
                        .on('error', (error, receipt) => {
                          showToastOnTxError(receipt)
                          return rej(error)
                        })
                    })
                    .on('error', (error, receipt) => {
                      showToastOnTxError(receipt)
                      return rej(error)
                    })
                })
              )
            }}
            validationSchemas={[
              Yup.object().shape({
                amount: Yup.number()
                  .min(0.00001, 'Token amount too small!')
                  .required('Required'),
              }),
            ]}
          >
            <StepOne
              currentUser={this.props.currentUser}
              minContribution={minContribution}
              maxContribution={maxContribution}
            />
          </MultiStepForm>
        )}
      </div>
    )
  }
}

Contribute.propTypes = {
  currentUser: PropTypes.instanceOf(User),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export default Contribute
