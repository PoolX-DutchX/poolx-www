import React, { Component } from 'react';
import PropTypes from 'prop-types';

import User from '../../../models/User';
// import Pool from '../../../models/Pool';

import MultiStepForm from '../../MultiStepForm';
import StepOne from './components/Step_1';
import StepTwo from './components/Step_2';
import StepThree from './components/Step_3';
import StepFour from './components/Step_4';
import PoolReview from './components/PoolReview';
import { useWeb3Context } from 'web3-react'

// import validationSchemas from './validation/';

import Loader from '../../Loader';
// import { history } from '../../../lib/helpers';
// import { feathersClient } from '../../../lib/feathersClient';
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
);

// const Web3Setter = props => {
//   let web3 = null;
//   if (web3 === null) {
//     web3 = useWeb3Context();
//   }

//   return <div />;
// };

function CreatePool(props) {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     isLoading: false,
  //     web3: null,
  //     poolbaseFee: 0
  //   };
  // }

  // async componentDidMount() {
  //   this.setState({ isLoading: true });
  //   // const { data: [{ percent: percentFee }] } = await feathersClient
  //   //   .service('fees')
  //   //   .find({ query: { type: 'standard' } });

  //    const web3 = useWeb3Context();
  //     if (web3.account) {
  //       this.setState({ isLoading: false, web3 });
  //     }

  //   // this.setState({
  //   //   poolbaseFee: 0, // fee set to zero
  //   //   isLoading: false,
  //   // });
  //   // isAuthenticated(props.currentUser)
  //   //   .then(() => {
  //   //       this.setState({ isLoading: false });
  //   //   })
  //   //   .catch((err, anythingElse) => {
  //   //     console.log('err', err);
  //   //   });
  // }


    // const { isLoading, poolbaseFee } = this.state;
    let web3 = null;
    let isLoading = false
    let poolbaseFee = 0;

    if (web3 === null) {
      web3 = useWeb3Context();
    }
    console.log({web3})

    return (
      <div>
        {/* <Web3Setter /> */}
        <p>HAHAHAHA{web3.account}</p>
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
              'Fees & Admins',
              'Destination & Whitelist',
              'Name & Description',
              'Review',
            ]}
            onSubmit={(values, actions) => {
              console.log('submitting values', values);
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
            <StepTwo poolbaseFee={poolbaseFee} />
            <StepThree />
            <StepFour />
            <PoolReview />
          </MultiStepForm>
        )}
      </div>
    );
}

// CreatePool.propTypes = {
//   currentUser: PropTypes.instanceOf(User),
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       id: PropTypes.string,
//     }).isRequired,
//   }).isRequired,
// };

export default CreatePool;

const initialPoolData = {
  ownerAddress: '',
  maxAllocation: '',
  fee: '',
  feePayoutCurrency: '',
  lockPayoutAddress: false,
  payoutAddress: '',
  payoutTxData: '',
  admins: [],
  hasWhitelist: false,
  adminPayoutAddress: '',
  name: '',
  description: '',
  minContribution: '',
  maxContribution: '',
};

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
