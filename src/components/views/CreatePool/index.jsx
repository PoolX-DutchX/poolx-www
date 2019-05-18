import React from 'react'

import MultiStepForm from '../../MultiStepForm'
import StepOne from './components/Step_1'
import StepThree from './components/Step_3'
import StepFour from './components/Step_4'
import PoolReview from './components/PoolReview'
import { useWeb3Context, Web3Consumer } from 'web3-react'

import Loader from '../../Loader'
/**
 * View flow to create a Contribution
 *
 * @param id URL parameter which is an id of a pool object
 */

const Header = () => (
  <div>
    <h1 className="font-xl">Create Pool</h1>
    <p className="font-m">...And get that money!</p>
  </div>
)

function Web3ConsumerComponent() {
  return (
    <Web3Consumer>
      {context => {
        const { active, connectorName, account, networkId } = context
        return (
          active && (
            <React.Fragment>
              <p>Active Connector: {connectorName}</p>
              <p>Account: {account || 'None'}</p>
              <p>Network ID: {networkId}</p>
            </React.Fragment>
          )
        )
      }}
    </Web3Consumer>
  )
}

function CreatePool(props) {
  const context = useWeb3Context()
  const { active } = context

  let isLoading = active ? false : true
  let poolbaseFee = 0

  return (
    <div>
      <Web3ConsumerComponent />

      {isLoading && <Loader className="fixed" />}
      {!isLoading && (
        <MultiStepForm
          header={<Header />}
          initialValues={{
            ...initialPoolData,
            // ...samplePoolData
          }}
          stepLabels={[
            'Wallet & Limits',
            'Destination & Whitelist',
            'Name & Description',
            'Review',
          ]}
          onSubmit={(values, actions) => {
            console.log('submitting values', values)
            // const pool = new Pool(values);
            // console.log('pool', pool);
            // pool
            //   .save()
            //   .then(newPool => {
            //     console.log('newPool', newPool);
            //     history.push(`/pools/${newPool._id}/pendingTx`); // maybe ._id
            //     // actions.setSubmitting(false);
            //   })
            //   .catch(err => {
            //     console.log('err', err);
            //     React.toast.error(
            //       <p>
            //         {err.message} <br />
            //         <p>
            //           Please sign up to create a pool<br />
            //         </p>
            //       </p>,
            //     );
            //   });
          }}
          validationSchemas={{}}
        >
          <StepOne currentUser={props.currentUser} />
          <StepThree />
          <StepFour />
          <PoolReview />
        </MultiStepForm>
      )}
    </div>
  )
}

export default CreatePool

const initialPoolData = {
  dutchXAddress: '',
  sellPriceDenumerator: '',
  sellPriceNumerator: '',
  token1Address: '',
  token2Address: '',
}

// const samplePoolData = {
//   ownerAddress: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
//   maxAllocation: 200,
//   fee: 0.25,
//   feePayoutCurrency: 'ether',
//   lockPayoutAddress: true,
//   payoutAddress: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
//   payoutTxData: '0xAA',
//   admins: [
//     { address: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', name: 'Hootie' },
//     { address: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', name: 'Supports' },
//     { address: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', name: 'Sooch' },
//     { address: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', name: 'Norkie' },
//     { address: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', name: 'Lovely' },
//   ],
//   hasWhitelist: true,
//   whitelist: [
//     { address: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', name: 'John' },
//     { address: '0xb8844811b02e85fcd5b0a32079ab2a11d11b4d05', name: 'Mary' },
//     { address: '0x5841043711276f5d02c30c14f4e2a2740f0587c2', name: 'Hooch' },
//     { address: '0xf95052a6c661e9e83fdfb3d8bc42a8155d9482b9', name: 'Calibri' },
//     { address: '0x564a1866bec2f50f0e623a484849338b94d5fdb2', name: 'Concort' },
//     { address: '0x38912ed602cad553000bc8432312f7e0bd698efe', name: 'Calep' },
//     { address: '0x3e102a5d4b02fb03f7ee1feecd8eeb86565948c1', name: 'Hinree' },
//     { address: '0x84f5bc98b064a9897116496a4e18caf3627cfd43', name: 'Storeee' },
//     { address: '0x02013a01a66122b3e7b1ed80c092250a3f9fe02d', name: 'hoomplee' },
//     { address: '0x38ec11e246eda8b215a0b24afd093bd7cd6c1ee1', name: 'Garchoff' },
//     { address: '0x36596eEBd695aDCd03B3e42260Aa2468885100dd', name: 'Sickldor' },
//   ],
//   adminPayoutAddress: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
//   name: 'IIOC',
//   description: 'This is the best pool you could ever hope for.',
//   minContribution: 5,
//   maxContribution: 30,
// };
