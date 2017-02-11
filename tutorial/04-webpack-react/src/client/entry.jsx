// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <div>
    The dog says: Wah wah
  </div>
  , document.querySelector('.js-app'))
