import * as Yup from 'yup';
import { addValidationRule } from 'formsy-react';
import moment from 'moment';
import Web3 from 'web3';
import { utils } from 'web3';

// Formsy validations

// Greater than number
addValidationRule('greaterThan', (formValues, inputValue, value) => parseFloat(inputValue) > value);

// Less than number
addValidationRule('lessThan', (formValues, inputValue, value) => parseFloat(inputValue) < value);

// Greater than number
addValidationRule(
  'greaterEqualTo',
  (formValues, inputValue, value) => parseFloat(inputValue) >= value,
);

addValidationRule('isMoment', (formValues, inputValue) => moment.isMoment(inputValue));

// Checks if input is a valid Ether address
// TODO: Does not support ENS! (It's hard, ENS returns promises)
addValidationRule('isEtherAddress', (formValues, inputValue, _value) =>
  Web3.utils.isAddress(inputValue),
);

// YUP validation tests
function checkEthereumAddress(message) {
  return this.test({
      message,
      name: 'ethereumAddress',
      exclusive: true,
      test(value) {
        return (value == null) || utils.isAddress(value);
      },
    });
};
Yup.addMethod(Yup.string, 'ethereumAddress', checkEthereumAddress);
export const ethereumAddress = () => Yup.string().strict(true).ethereumAddress('Invalid ethereum address');

function checkHexPrefix(message) {
  return this.test({
      message,
      name: 'hexPrefix',
      exclusive: true,
      test(value) {
        console.log('hasPrefix value', value);
        return !value || (value.slice(0, 2) === '0x');
      },
    });
}

function isHex(h) {
  var a = parseInt(h,16);
  return (a.toString(16) === h.toLowerCase())
}


function checkHexValidity(message) {
  return this.test({
      message,
      name: 'checkHexValidity',
      exclusive: true,
      test(value) {
        console.log('checkHexValidity value', value);
        const hasPrefix = value.slice(0, 2) === '0x';
        const hexString = hasPrefix ? value.slice(2) : value;
        return !value || isHex(hexString);
      },
    });
}

Yup.addMethod(Yup.string, 'hexPrefix', checkHexPrefix);
Yup.addMethod(Yup.string, 'hexValidity', checkHexValidity);
export const hexString = () => Yup.string()
  .ensure()
  .hexPrefix('Hexidecimal data must begin with 0x')
  .hexValidity('Invalid hexidecimal data')



export function isWhitelistedAddress(pool, message) {
  return this.test({
      message,
      name: 'whitelisted',
      exclusive: true,
      test(value) {

        // if (pool.hasWhitelist) {
        //   return WhitelistService
        // }

        return true;
      },
    });
};
