import React from 'react';
import 'whatwg-fetch';
import { utils } from 'web3';
import { createBrowserHistory } from 'history';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import intersection from 'lodash.intersection';

import { feathersClient } from './feathersClient';
import DefaultAvatar from './../assets/defaultAvatar.svg';
import getWeb3 from './blockchain/getWeb3';
import config from '../configuration';

export const isOwner = (address, currentUser) =>
  address !== undefined && currentUser !== undefined && currentUser.address === address;

export const authenticate = wallet => {
  const authData = {
    strategy: 'web3',
    address: wallet.getAddresses()[0],
  };

  return new Promise((resolve, reject) => {
    feathersClient.authenticate(authData).catch(response => {
      // normal flow will issue a 401 with a challenge message we need to sign and send to
      // verify our identity
      if (response.code === 401 && response.data.startsWith('Challenge =')) {
        const msg = response.data.replace('Challenge =', '').trim();
        return resolve(wallet.signMessage(msg).signature);
      }
      return reject(response);
    });
  })
    .then(signature => {
      authData.signature = signature;
      return feathersClient.authenticate(authData);
    })
    .then(response => response.accessToken);
};

export const authenticateUser = ({ email, password }) => {
  const authData = {
    strategy: 'local',
    email,
    password,
  };

  return feathersClient
    .authenticate(authData)
    .then(response => {
      console.log('response', response);
      return response.accessToken;
    })
    .catch(err => {
      console.log('AuthenticateUser response error', err);
      return err;
    });
};

export const authenticateAddress = address => {
  const authData = {
    strategy: 'web3',
  };

  return new Promise((resolve, reject) => {
    getWeb3().then(web3 => {
      authData.address = web3.utils.toChecksumAddress(address);
      return feathersClient.authenticate(authData).catch(response => {
        // normal flow will issue a 401 with a challenge message we need to sign and send to
        // verify our identity
        console.log('response', response);
        if (response.code === 401 && response.data.startsWith('Challenge =')) {
          const msg = response.data.replace('Challenge =', '').trim();
          console.log('msg', msg);

          console.log('web3.currentProvider.', web3.currentProvider);
          const msgParams = [{ type: 'string', name: 'Message', value: msg }];
          return web3.currentProvider.sendAsync(
            {
              method: 'eth_signTypedData',
              params: [msgParams, authData.address],
              from: authData.address,
            },
            (err, { result }) => {
              console.log('err', err);
              console.log('result', result);
              authData.signature = result;
              authData.msgParams = msgParams;

              resolve();
            },
          );
        }
        return reject(response);
      });
    });
  })
    .then(() => feathersClient.authenticate(authData))
    .then(response => {
      console.log('response', response);
      return response.accessToken;
    })
    .catch(err => {
      console.log('err', err);
    });
};

export const getTruncatedText = (text, maxLength) => {
  const txt = text.replace(/<(?:.|\n)*?>/gm, '').trim();
  if (txt.length > maxLength) {
    return `${txt.substr(0, maxLength).trim()}...`;
  }
  return txt;
};

// displays a sweet alert with an error when the transaction goes wrong
export const displayTransactionError = txHash => {
  let msg;
  const { etherScanUrl } = config;
  if (txHash) {
    msg = (
      <p>
        Something went wrong with the transaction.
        <a href={`${etherScanUrl}tx/${txHash}`} target="_blank" rel="noopener noreferrer">
          View transaction
        </a>
      </p>
    );
    // TODO: update or remove from feathers? maybe don't remove, so we can inform the user that the
    // tx failed and retry
  } else {
    msg = <p>Something went wrong with the transaction. Is your wallet unlocked?</p>;
  }

  React.swal({
    title: 'Oh no!',
    content: React.swal.msg(msg),
    icon: 'error',
  });
};

// returns the user name, or if no user name, returns default name
export const getUserName = owner => {
  if (owner && owner.name) {
    return owner.name;
  }
  return 'Anonymous user';
};

// returns the user avatar, or if no user avatar, returns default avatar
export const getUserAvatar = owner => {
  if (owner && owner.avatar) {
    return owner.avatar;
  }
  return DefaultAvatar;
};

export const getGasPrice = () =>
  feathersClient
    .service('/gasprice')
    .find()
    .then(resp => {
      let gasPrice = resp.safeLow * 1.1;
      gasPrice = gasPrice > resp.average ? resp.average : gasPrice;
      // div by 10 b/c https://ethgasstation.info/json/ethgasAPI.json returns price in gwei * 10
      // we're only interested in gwei.
      // we round to prevent errors relating to too many decimals
      gasPrice = Math.round(gasPrice) / 10;
      return utils.toWei(`${gasPrice}`, 'gwei');
    });

export const history = createBrowserHistory();

export const removeFromArray = (array, element) => {
  return array.filter(e => e !== element);
};

export const addToArray = (array, element) => {
  console.log('array.includes(element)', array.includes(element));
  if (!array.includes(element)) {
    return [...array, element];
  } else {
    return array;
  }
};

// Get start of the day in UTC for a given date or start of current day in UTC
export const getStartOfDayUTC = date => moment.utc(date || moment()).startOf('day');

export const convertEthHelper = amount => {
  if (!amount) return 0;

  const eth = utils.fromWei(amount);
  if (eth.includes('.') && eth.split('.')[1].length > config.decimals) {
    return new BigNumber(eth).toFixed(config.decimals);
  }

  return eth;
};

export const copyToClipboard = node => {
  if (!navigator.clipboard) {
    node.select();
    document.execCommand('copy');
    return;
  }
  navigator.clipboard.writeText(node.value);
};

export const isPoolCreator = (pool, user) => {
  console.log('pool', pool);
  console.log('user', user);
  return pool.owner._id === user.id;
};

export const isPoolAdmin = (pool, user) => {
  const adminAddresses = pool.admins.map(({ address }) => address);
  const userAddresses = user.wallets.map(({ address }) => address);
  const intersectingAddresses = intersection(adminAddresses, userAddresses);

  return pool.owner._id === user.id || !!intersectingAddresses.length;
};
