import React from 'react'
import ReactDOM from 'react-dom'

import registerServiceWorker from './lib/registerServiceWorker'
import ApplicationWrapper from './containers/ApplicationWrapper'
import './styles/application.css'

/* global document */
ReactDOM.render(
  <ApplicationWrapper />, // eslint-disable-line react/jsx-filename-extension
  document.getElementById('root')
)

registerServiceWorker()
