import React from 'react';
import { history } from '../lib/helpers';

/**
 * Check if there is a currentUser. If not, routes back. If yes, resolves returned promise
 *
 * @param currentUser {object} Current User object
 * @param history     {object} Standard browser history object
 *
 * @return new Promise
 *
 * usage:
 *    isLoggedIn(currentUser, wallet)
 *      .then(()=> ...do something when loggedIn)
 */

 // ToDo: This does not to be a promise task: remove all promisified usage of this in app
export const isLoggedIn = currentUser =>
  new Promise(resolve => {
    if (currentUser) resolve(); // && currentUser.email
    else history.goBack();
  });

/**
 * Check if currentUser is authenticated. If not, routes back. If yes, resolves returned promise
 *
 * @param currentUser {object} Current User object
 * @param history     {object} Standard browser history object
 * @param wallet      {object} Wallet object
 *
 * @return new Promise
 *
 * usage:
 *    isAuthenticated(currentUser, wallet)
 *      .then(()=> ...do something when authenticated)
 */
export const isAuthenticated = (currentUser) =>
  new Promise(resolve => {
    if (currentUser ) resolve(); //&& currentUser.email
    else history.goBack();
  });


/**
 * Confirms blockchain tx with user before making the tx
 *
 * @param wallet  {object} Wallet object
 * @param history {object} Standard history object
 *
 */
export const confirmBlockchainTransaction = (onConfirm, onCancel) =>
  React.swal({
    title: 'Send transaction?',
    text:
      'The action you are trying to perform will create a blockchain transaction. Please confirm to make the transaction.',
    icon: 'warning',
    dangerMode: true,
    buttons: ['Cancel', 'Yes, execute transaction'],
  }).then(isConfirmed => {
    if (isConfirmed) onConfirm();
    else onCancel();
  });
