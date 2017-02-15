// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import HelloButton from './container/hello-button'
import HelloAsyncButton from './container/hello-async-button'
import Message from './container/message'
import MessageAsync from './container/message-async'
import helloReducer from './reducer/hello'
import { APP_NAME } from '../shared/config'

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
/* eslint-enable no-underscore-dangle */

const store = createStore(combineReducers({
  hello: helloReducer,
}), composeEnhancers(applyMiddleware(thunkMiddleware)))

ReactDOM.render(
  <Provider store={store}>
    <div>
      <h1>{APP_NAME}</h1>
      <Message />
      <HelloButton />
      <MessageAsync />
      <HelloAsyncButton />
    </div>
  </Provider>
  , document.querySelector('.app'))
