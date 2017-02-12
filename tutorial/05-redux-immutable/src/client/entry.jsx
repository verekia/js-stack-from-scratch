// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import BarkAsyncButton from './container/bark-async-button'
import BarkButton from './container/bark-button'
import Message from './container/message'
import dogReducer from './reducer/dog'

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
/* eslint-enable no-underscore-dangle */

const store = createStore(combineReducers({
  dog: dogReducer,
}), composeEnhancers(applyMiddleware(thunkMiddleware)))

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Message />
      <BarkButton />
      <BarkAsyncButton />
    </div>
  </Provider>
  , document.querySelector('.js-app'),
)
