import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import hooks from 'feathers-hooks'
import io from 'socket.io-client/dist/socket.io'
import auth from 'feathers-authentication-client'
import localforage from 'localforage'
import rx from 'feathers-reactive'
import config from '../configuration'
import matcher from './matcher'

const rest = require('feathers-rest/client')

const restClient = rest(config.feathersConnection)
const fetch = require('node-fetch')

// export const socket = io(config.feathersConnection, {
//   transports: ['websocket'],
// })

// // socket IO error events
// socket.on('connect_error', () /*e*/ =>
//   console.log('Could not connect to FeatherJS'))
// socket.on('connect_timeout', () /*e*/ =>
//   console.log('Could not connect to FeatherJS: Timeout'))
// socket.on('reconnect_attempt', () /*e*/ =>
//   console.log('Trying to reconnect to FeatherJS: Timeout'))

export const feathersRest = feathers()
  .configure(restClient.fetch(fetch))
  .configure(auth({ storage: localforage }))
  .configure(hooks())
  .configure(
    rx({
      idField: '_id',
      matcher,
    })
  )

export const feathersClient = {}

// feathers()
//   .configure(socketio(socket, { timeout: 5000 }))
//   .configure(auth({ storage: localforage }))
//   .configure(hooks())
//   .configure(
//     rx({
//       idField: '_id',
//       matcher,
//     })
//   )
//   .on('authenticated', token => {
//     console.log('authenticated token', token)
//     feathersRest.passport.setJWT(token)
//   }) // set token on feathersRest whenever it is changed

// feathersClient.service('uploads').timeout = 10000
// feathersRest.service('uploads').timeout = 10000
