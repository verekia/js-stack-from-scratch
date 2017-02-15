# 05 - Redux, Immutable, Fetch

In this chapter we will hook up React and Redux to make a very simple app. The app will consist of a message and a button. The message changes when the user clicks the button.

Before we start, here is a very quick introduction to ImmutableJS, which is completely unrelated to React and Redux, but will be used in this chapter.

## ImmutableJS

> 💡 **[ImmutableJS](https://facebook.github.io/immutable-js/)** (or just Immutable) is a library by Facebook to manipulate immutable collections, like lists and maps. Any change made on an immutable object returns a new object without mutating the original object.

For instance, instead of doing:

```js
const obj = { a: 1 }
obj.a = 2 // Mutates `obj`
```

You would do:

```js
const obj = Immutable.Map({ a: 1 })
obj.set('a', 2) // Returns a new object without mutating `obj`
```

This approach follows the **functional programming** paradigm, which works really well with Redux.

When creating immutable collections, a very convenient method is `Immutable.fromJS()`, which takes any regular JS object or array and returns a deeply immutable version of it:

```js
const immutablePerson = Immutable.fromJS({
  name: 'Stan',
  friends: ['Kyle', 'Cartman', 'Kenny'],
})

console.log(immutablePerson)

/*
 * Map {
 *   "name": "Stan",
 *   "friends": List [ "Kyle", "Cartman", "Kenny" ]
 * }
 */
```

- Run `yarn add immutable`.

**Note**: Due to the implementation of ImmutableJS, Flow does not accept importing it with `import Immutable from 'immutable'`, so use this syntax instead: `import * as Immutable from 'immutable'`. Let's cross fingers for a [fix](https://github.com/facebook/immutable-js/issues/863) soon.

## Redux

> 💡 **[Redux](http://redux.js.org/)** is a library to handle the lifecycle of your application. It creates a *store*, which is the single source of truth of the state of your app at any given time.

Let's start with the easy part, declaring our Redux actions:

- Run `yarn add redux redux-actions`.

- Create a `src/client/action/dog.js` file containing:

```js
// @flow

import { createAction } from 'redux-actions'

export const BARK = 'BARK'
export const bark = createAction(BARK)
```

This file exposes an *action*, `BARK`, and its *action creator*, `bark`, which is a function. We use [`redux-actions`](https://github.com/acdlite/redux-actions) to reduce the boilerplate associated with Redux actions. `redux-actions` implement the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) model, which makes *action creators* return objects with the `type` and `payload` attributes.

- Create a `src/client/reducer/dog.js` file containing:

```js
// @flow

import * as Immutable from 'immutable'

import { BARK } from '../action/dog'

const initialState = Immutable.fromJS({
  barkMessage: 'The dog is quiet',
})

const dogReducer = (state: Object = initialState, action: { type: string, payload: any }) => {
  switch (action.type) {
    case BARK:
      return state.set('barkMessage', action.payload)
    default:
      return state
  }
}

export default dogReducer
```

In this file we initialize the state of our reducer with an Immutable Map containing one property, `barkMessage`, set to `The dog is quiet`. The `dogReducer` handles `BARK` actions by simply setting the new `barkMessage` with the action payload. The Flow annotation for `action` destructures it into a `type` and a `payload`. The `payload` can be of `any` type. It looks funky if you've never seen this before, but it remains pretty understandable. Note the usage of `Immutable.fromJS()` and `set()` as seen before.

## React-Redux

> 💡 **[react-redux](https://github.com/reactjs/react-redux)** *connects* a Redux store with React components. With `react-redux`, when the Redux store changes, React components get automatically updated. They can also fire Redux actions.

- Run `yarn add react-redux`.

In this section we are going to create *Components* and *Containers*.

**Components** are *dumb* React components, in a sense that they don't know anything about the Redux state. **Containers** are *smart* components that know about the state and that we are going to *connect* to our dumb components.

- Create a `src/client/component/bark-button.jsx` file containing:

```js
// @flow

import React, { PropTypes } from 'react'

const BarkButton = ({ bark }: { bark: Function }) =>
  <button onClick={bark}>Bark</button>

BarkButton.propTypes = {
  bark: PropTypes.func.isRequired,
}

export default BarkButton
```

**Note**: You can see another case of destructuring with Flow annotations here. If `props` contains `bark`, instead of writing `const BarkButton = (props) => { props.bark() }`, we write `const BarkButton = ({ bark }: { bark: Function }) => { bark() }`. The syntax is a bit cumbersome but worth it.

- Create a `src/client/component/message.jsx` file containing:

```js
// @flow

import React, { PropTypes } from 'react'

const Message = ({ message }: { message: string }) =>
  <div>{message}</div>

Message.propTypes = {
  message: PropTypes.string.isRequired,
}

export default Message
```

These are examples of *dumb* components. They are logic-less, and just show whatever they are asked to show via React **props**. The main difference between `bark-button.jsx` and `message.jsx` is that `BarkButton` contains an reference to an action dispatcher in its props, where `Message` contains some data to show.

Again, *components* don't know anything about Redux **actions** or the **state** of our app, which is why we are going to create smart **containers** that will feed the proper action dispatchers and data to these 2 dumb components.

- Create a `src/client/container/bark-button.js` file containing:

```js
// @flow

import { connect } from 'react-redux'

import { bark } from '../action/dog'
import BarkButton from '../component/bark-button'

const mapDispatchToProps = dispatch => ({
  bark: () => { dispatch(bark('Wah wah!')) },
})

export default connect(null, mapDispatchToProps)(BarkButton)
```

This container hooks up the `BarkButton` component with the `bark` action and Redux's `dispatch` method.

- Create a `src/client/container/message.js` file containing:

```js
// @flow

import { connect } from 'react-redux'

import Message from '../component/message'

const mapStateToProps = state => ({
  message: state.dog.get('barkMessage'),
})

export default connect(mapStateToProps)(Message)
```

This container hooks up the Redux's app state with the `Message` component. When the state changes, `Message` will now automatically re-render with the proper `message` prop. These connections are done via the `connect` function of `react-redux`.

We still haven't initialized the Redux store and haven't put the 2 containers anywhere in our app yet:

- Edit `entry.jsx` like so:

```js
// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import BarkButton from './container/bark-button'
import Message from './container/message'
import dogReducer from './reducer/dog'

/* eslint-disable no-underscore-dangle */
const store = createStore(combineReducers({
  dog: dogReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
/* eslint-enable no-underscore-dangle */

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Message />
      <BarkButton />
    </div>
  </Provider>
  , document.querySelector('.js-app'))
```

Let's take a moment to review this. First, we create a *store* with `createStore`. Stores are created by passing reducers to them. Here we only have one reducer, but for the sake of future scalability, we use `combineReducers` to group all of our reducers together. The last weird parameter of `createStore` is something to hook up Redux to browser [Devtools](https://github.com/zalmoxisus/redux-devtools-extension), which are incredibly useful when debugging. Since ESLint will complain about the underscores in `__REDUX_DEVTOOLS_EXTENSION__`, we surround that block with comments to temporarily disable this ESLint rule.

Next, we wrap our entire app inside `react-redux`'s `Provider` component and pass it our store. We put our 2 **containers** in a `<div>` because `Provider` must have a single child.

🏁 You can now run `yarn start` and open `http://localhost:8000`. You should see "The dog is quiet" and a button. When you click the button, the message should change to "Wah wah!". If you installed the Redux Devtools in your browser, you should see the app state change over time as you click on the button.

Congratulations, we finally made an app that does something! Okay it's not a *super* impressive from the outside, but we all know that it is powered by one badass stack under the hood.

## Extending our app with an asynchronous call

We are now going to add a second button to our app, which will trigger an AJAX call to retrieve a message from the server. Let's start with the easy part: creating the component and container for the button. It's pretty much exactly the same as the other button.

### The server endpoint

- Create a `src/shared/routes.js` file containing:

```js
// @flow

export default {
  asyncBark: '/async/bark',
}
```

- In `src/server/index.js`, add the following:

```js
import routes from '../shared/routes'

// ...

app.get(routes.asyncBark, (req, res) => {
  res.send({ message: 'Wah wah! (from the server)' })
})
```

### Fetch

> 💡 **[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)** is a standardized JavaScript function to make asynchronous calls inspired by jQuery's AJAX methods.

We are going to use `fetch` to make calls to the server from the client. `fetch` is not supported by all browsers yet, so we are going to need a polyfill. `isomorphic-fetch` is a polyfill that makes it work cross-browsers and in Node too!

- Run `yarn add isomorphic-fetch`.

### The React bits

- Create a `src/client/component/bark-async-button.jsx` file containing:

```js
// @flow

import React, { PropTypes } from 'react'

const BarkAsyncButton = ({ barkAsync }: { barkAsync: Function }) =>
  <button onClick={barkAsync}>Bark Async</button>

BarkAsyncButton.propTypes = {
  barkAsync: PropTypes.func.isRequired,
}

export default BarkAsyncButton
```

- Create a `src/client/container/bark-async-button.jsx` file containing:

```js
// @flow

import { connect } from 'react-redux'

import { barkAsync } from '../action/dog'
import BarkAsyncButton from '../component/bark-async-button'

const mapDispatchToProps = dispatch => ({
  barkAsync: () => { dispatch(barkAsync()) },
})

export default connect(null, mapDispatchToProps)(BarkAsyncButton)
```

What we need now is to create this `barkAsync` action.

### 3 asynchronous actions

`barkAsync` is not going to be a regular action. Asynchronous actions are usually split into 3 actions, which trigger 3 different states: a *request* action (or "loading"), a *success* action, and a *failure* action.

- Edit `src/client/action/dog.js` like so:

```js
// @flow

import 'isomorphic-fetch'

import { createAction } from 'redux-actions'
import routes from '../../shared/routes'

export const BARK = 'BARK'
export const BARK_ASYNC_REQUEST = 'BARK_ASYNC_REQUEST'
export const BARK_ASYNC_SUCCESS = 'BARK_ASYNC_SUCCESS'
export const BARK_ASYNC_FAILURE = 'BARK_ASYNC_FAILURE'

export const bark = createAction(BARK)
export const barkAsyncRequest = createAction(BARK_ASYNC_REQUEST)
export const barkAsyncSuccess = createAction(BARK_ASYNC_SUCCESS)
export const barkAsyncFailure = createAction(BARK_ASYNC_FAILURE)

export const barkAsync = () => (dispatch: Function) =>
  fetch(routes.asyncBark, { method: 'GET' })
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText)
      }
      dispatch(barkAsyncRequest())
      return res.json()
    })
    .then((data) => {
      if (!data.message) {
        throw Error('No message received')
      }
      dispatch(barkAsyncSuccess(data.message))
    })
    .catch(() => {
      dispatch(barkAsyncFailure())
    })
```

Instead of returning an action, `barkAsync` returns a function which launches the `fetch` call. `fetch` returns a `Promise`, which we use to *dispatch* different actions depending on the current state of our asynchronous call.

### 3 asynchronous action handlers

Let's handle these different actions in `src/client/reducer/dog.js`:

```js
// @flow

import * as Immutable from 'immutable'

import { BARK, BARK_ASYNC_REQUEST, BARK_ASYNC_SUCCESS, BARK_ASYNC_FAILURE } from '../action/dog'

const initialState = Immutable.fromJS({
  barkMessage: 'The dog is quiet',
})

const dogReducer = (state: Object = initialState, action: { type: string, payload: any }) => {
  switch (action.type) {
    case BARK:
      return state.set('barkMessage', action.payload)
    case BARK_ASYNC_REQUEST:
      return state.set('barkMessage', '...')
    case BARK_ASYNC_SUCCESS:
      return state.set('barkMessage', action.payload)
    case BARK_ASYNC_FAILURE:
      return state.set('barkMessage', 'Could not bark, please check your connection')
    default:
      return state
  }
}

export default dogReducer
```

This part doesn't look as scary as the previous one, does it? Here we simply update `barkMessage` with different messages depending on the action we receive. During `BARK_ASYNC_REQUEST`, we show `...`, which is a cheap way to represent a "Loading" state. `BARK_ASYNC_SUCCESS` updates `barkMessage` just like `BARK` would do normally. `BARK_ASYNC_FAILURE` gives an error message.

### Redux-thunk

In `src/client/action/dog.js`, we made `barkAsync`, an action creator that returns a function. This is actually not a feature that is natively supported by Redux. In order to perform these async actions, we need to extend Redux's functionality with the `redux-thunk` *middleware*.

- Run `yarn add redux-thunk`.

- Update your `entry.jsx` file like so:

```js
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
```

Here we pass `redux-thunk` to Redux's `applyMiddleware` function. In order for the Redux Devtools to keep working, we also need to use Redux's `compose` function. Don't worry too much about this part, just remember that we enhancing Redux with `redux-thunk`.

🏁 Run `yarn start` or `yarn prod` and you should now be able to click the "Bark Async" button and retrieve a message from the server! Since you're working locally, the call is instantaneous, but if you open the Redux Devtools, you will notice that each click triggers both `BARK_ASYNC_REQUEST` and `BARK_ASYNC_SUCCESS`, making the message go through the intermediate `...` loading state as expected.

That's it! This is our entire app. You've made it, good job!

Now we'll just add some unit tests to make sure things keep running as expected.

Next section: [06 - React Router, Server-Side Rendering](/tutorial/06-react-router-ssr#06---react-router-and-server-side-rendering)

Back to the [previous section](/tutorial/04-webpack-react#04---webpack-and-react) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
