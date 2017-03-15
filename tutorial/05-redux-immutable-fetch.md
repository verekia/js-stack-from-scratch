# 05 - Redux, Immutable, and Fetch

Code for this chapter available [here](https://github.com/verekia/js-stack-walkthrough/tree/master/05-redux-immutable-fetch).

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
 *  Map {
 *    "name": "Stan",
 *    "friends": List [ "Kyle", "Cartman", "Kenny" ]
 *  }
 */
```

- Run `yarn add immutable@4.0.0-rc.2`

## Redux

> 💡 **[Redux](http://redux.js.org/)** is a library to handle the lifecycle of your application. It creates a *store*, which is the single source of truth of the state of your app at any given time.

Let's start with the easy part, declaring our Redux actions:

- Run `yarn add redux redux-actions`

- Create a `src/client/action/hello.js` file containing:

```js
// @flow

import { createAction } from 'redux-actions'

export const SAY_HELLO = 'SAY_HELLO'

export const sayHello = createAction(SAY_HELLO)
```

This file exposes an *action*, `SAY_HELLO`, and its *action creator*, `sayHello`, which is a function. We use [`redux-actions`](https://github.com/acdlite/redux-actions) to reduce the boilerplate associated with Redux actions. `redux-actions` implement the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) model, which makes *action creators* return objects with the `type` and `payload` attributes.

- Create a `src/client/reducer/hello.js` file containing:

```js
// @flow

import Immutable from 'immutable'
import type { fromJS as Immut } from 'immutable'

import { SAY_HELLO } from '../action/hello'

const initialState = Immutable.fromJS({
  message: 'Initial reducer message',
})

const helloReducer = (state: Immut = initialState, action: { type: string, payload: any }) => {
  switch (action.type) {
    case SAY_HELLO:
      return state.set('message', action.payload)
    default:
      return state
  }
}

export default helloReducer
```

In this file we initialize the state of our reducer with an Immutable Map containing one property, `message`, set to `Initial reducer message`. The `helloReducer` handles `SAY_HELLO` actions by simply setting the new `message` with the action payload. The Flow annotation for `action` destructures it into a `type` and a `payload`. The `payload` can be of `any` type. It looks funky if you've never seen this before, but it remains pretty understandable. For the type of `state`, we use the `import type` Flow instruction to get the return type of `fromJS`. We rename it to `Immut` for clarity, because `state: fromJS` would be pretty confusing. The `import type` line will get stripped out like any other Flow annotation. Note the usage of `Immutable.fromJS()` and `set()` as seen before.

## React-Redux

> 💡 **[react-redux](https://github.com/reactjs/react-redux)** *connects* a Redux store with React components. With `react-redux`, when the Redux store changes, React components get automatically updated. They can also fire Redux actions.

- Run `yarn add react-redux`

In this section we are going to create *Components* and *Containers*.

**Components** are *dumb* React components, in a sense that they don't know anything about the Redux state. **Containers** are *smart* components that know about the state and that we are going to *connect* to our dumb components.

- Create a `src/client/component/button.jsx` file containing:

```js
// @flow

import React from 'react'

type Props = {
  label: string,
  handleClick: Function,
}

const Button = ({ label, handleClick }: Props) =>
  <button onClick={handleClick}>{label}</button>

export default Button
```

**Note**: You can see a case of Flow *type alias* here. We define the `Props` type before annotating our component's destructured `props` with it.

- Create a `src/client/component/message.jsx` file containing:

```js
// @flow

import React from 'react'

type Props = {
  message: string,
}

const Message = ({ message }: Props) =>
  <p>{message}</p>

export default Message
```

These are examples of *dumb* components. They are logic-less, and just show whatever they are asked to show via React **props**. The main difference between `button.jsx` and `message.jsx` is that `Button` contains a reference to an action dispatcher in its props, where `Message` just contains some data to show.

Again, *components* don't know anything about Redux **actions** or the **state** of our app, which is why we are going to create smart **containers** that will feed the proper action dispatchers and data to these 2 dumb components.

- Create a `src/client/container/hello-button.js` file containing:

```js
// @flow

import { connect } from 'react-redux'

import { sayHello } from '../action/hello'
import Button from '../component/button'

const mapStateToProps = () => ({
  label: 'Say hello',
})

const mapDispatchToProps = dispatch => ({
  handleClick: () => { dispatch(sayHello('Hello!')) },
})

export default connect(mapStateToProps, mapDispatchToProps)(Button)
```

This container hooks up the `Button` component with the `sayHello` action and Redux's `dispatch` method.

- Create a `src/client/container/message.js` file containing:

```js
// @flow

import { connect } from 'react-redux'

import Message from '../component/message'

const mapStateToProps = state => ({
  message: state.hello.get('message'),
})

export default connect(mapStateToProps)(Message)
```

This container hooks up the Redux's app state with the `Message` component. When the state changes, `Message` will now automatically re-render with the proper `message` prop. These connections are done via the `connect` function of `react-redux`.

- Update your `src/client/app.jsx` file like so:

```js
// @flow

import React from 'react'
import HelloButton from './container/hello-button'
import Message from './container/message'
import { APP_NAME } from '../shared/config'

const App = () =>
  <div>
    <h1>{APP_NAME}</h1>
    <Message />
    <HelloButton />
  </div>

export default App
```

We still haven't initialized the Redux store and haven't put the 2 containers anywhere in our app yet:

- Edit `src/client/index.jsx` like so:

```js
// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import App from './app'
import helloReducer from './reducer/hello'
import { APP_CONTAINER_SELECTOR } from '../shared/config'
import { isProd } from '../shared/util'

const store = createStore(combineReducers({ hello: helloReducer }),
  // eslint-disable-next-line no-underscore-dangle
  isProd ? undefined : window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const rootEl = document.querySelector(APP_CONTAINER_SELECTOR)

const wrapApp = (AppComponent, reduxStore) =>
  <Provider store={reduxStore}>
    <AppContainer>
      <AppComponent />
    </AppContainer>
  </Provider>

ReactDOM.render(wrapApp(App, store), rootEl)

if (module.hot) {
  // flow-disable-next-line
  module.hot.accept('./app', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./app').default
    ReactDOM.render(wrapApp(NextApp, store), rootEl)
  })
}
```

Let's take a moment to review this. First, we create a *store* with `createStore`. Stores are created by passing reducers to them. Here we only have one reducer, but for the sake of future scalability, we use `combineReducers` to group all of our reducers together. The last weird parameter of `createStore` is something to hook up Redux to browser [Devtools](https://github.com/zalmoxisus/redux-devtools-extension), which are incredibly useful when debugging. Since ESLint will complain about the underscores in `__REDUX_DEVTOOLS_EXTENSION__`, we disable this ESLint rule. Next, we conveniently wrap our entire app inside `react-redux`'s `Provider` component thanks to our `wrapApp` function, and pass our store to it.

🏁 You can now run `yarn start` and `yarn dev:wds` and hit `http://localhost:8000`. You should see "Initial reducer message" and a button. When you click the button, the message should change to "Hello!". If you installed the Redux Devtools in your browser, you should see the app state change over time as you click on the button.

Congratulations, we finally made an app that does something! Okay it's not a *super* impressive from the outside, but we all know that it is powered by one badass stack under the hood.

## Extending our app with an asynchronous call

We are now going to add a second button to our app, which will trigger an AJAX call to retrieve a message from the server. For the sake of demonstration, this call will also send some data, the hard-coded number `1234`.

### The server endpoint

- Create a `src/shared/routes.js` file containing:

```js
// @flow

// eslint-disable-next-line import/prefer-default-export
export const helloEndpointRoute = (num: ?number) => `/ajax/hello/${num || ':num'}`
```

This function is a little helper to produce the following:

```js
helloEndpointRoute()     // -> '/ajax/hello/:num' (for Express)
helloEndpointRoute(1234) // -> '/ajax/hello/1234' (for the actual call)
```

Let's actually create a test real quick to make sure this thing works well.

- Create a `src/shared/routes.test.js` containing:

```js
import { helloEndpointRoute } from './routes'

test('helloEndpointRoute', () => {
  expect(helloEndpointRoute()).toBe('/ajax/hello/:num')
  expect(helloEndpointRoute(123)).toBe('/ajax/hello/123')
})
```

- Run `yarn test` and it should pass successfully.

- In `src/server/index.js`, add the following:

```js
import { helloEndpointRoute } from '../shared/routes'

// [under app.get('/')...]

app.get(helloEndpointRoute(), (req, res) => {
  res.json({ serverMessage: `Hello from the server! (received ${req.params.num})` })
})
```

### New containers

- Create a `src/client/container/hello-async-button.js` file containing:

```js
// @flow

import { connect } from 'react-redux'

import { sayHelloAsync } from '../action/hello'
import Button from '../component/button'

const mapStateToProps = () => ({
  label: 'Say hello asynchronously and send 1234',
})

const mapDispatchToProps = dispatch => ({
  handleClick: () => { dispatch(sayHelloAsync(1234)) },
})

export default connect(mapStateToProps, mapDispatchToProps)(Button)
```

In order to demonstrate how you would pass a parameter to your asynchronous call and to keep things simple, I am hard-coding a `1234` value here. This value would typically come from a form field filled by the user.

- Create a `src/client/container/message-async.js` file containing:

```js
// @flow

import { connect } from 'react-redux'

import MessageAsync from '../component/message'

const mapStateToProps = state => ({
  message: state.hello.get('messageAsync'),
})

export default connect(mapStateToProps)(MessageAsync)
```

You can see that in this container, we are referring to a `messageAsync` property, which we're going to add to our reducer soon.

What we need now is to create the `sayHelloAsync` action.

### Fetch

> 💡 **[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)** is a standardized JavaScript function to make asynchronous calls inspired by jQuery's AJAX methods.

We are going to use `fetch` to make calls to the server from the client. `fetch` is not supported by all browsers yet, so we are going to need a polyfill. `isomorphic-fetch` is a polyfill that makes it work cross-browsers and in Node too!

- Run `yarn add isomorphic-fetch`

Since we're using `eslint-plugin-compat`, we need to indicate that we are using a polyfill for `fetch` to not get warnings from using it.

- Add the following to your `.eslintrc.json` file:

```json
"settings": {
  "polyfills": ["fetch"]
},
```

### 3 asynchronous actions

`sayHelloAsync` is not going to be a regular action. Asynchronous actions are usually split into 3 actions, which trigger 3 different states: a *request* action (or "loading"), a *success* action, and a *failure* action.

- Edit `src/client/action/hello.js` like so:

```js
// @flow

import 'isomorphic-fetch'

import { createAction } from 'redux-actions'
import { helloEndpointRoute } from '../../shared/routes'

export const SAY_HELLO = 'SAY_HELLO'
export const SAY_HELLO_ASYNC_REQUEST = 'SAY_HELLO_ASYNC_REQUEST'
export const SAY_HELLO_ASYNC_SUCCESS = 'SAY_HELLO_ASYNC_SUCCESS'
export const SAY_HELLO_ASYNC_FAILURE = 'SAY_HELLO_ASYNC_FAILURE'

export const sayHello = createAction(SAY_HELLO)
export const sayHelloAsyncRequest = createAction(SAY_HELLO_ASYNC_REQUEST)
export const sayHelloAsyncSuccess = createAction(SAY_HELLO_ASYNC_SUCCESS)
export const sayHelloAsyncFailure = createAction(SAY_HELLO_ASYNC_FAILURE)

export const sayHelloAsync = (num: number) => (dispatch: Function) => {
  dispatch(sayHelloAsyncRequest())
  return fetch(helloEndpointRoute(num), { method: 'GET' })
    .then((res) => {
      if (!res.ok) throw Error(res.statusText)
      return res.json()
    })
    .then((data) => {
      if (!data.serverMessage) throw Error('No message received')
      dispatch(sayHelloAsyncSuccess(data.serverMessage))
    })
    .catch(() => {
      dispatch(sayHelloAsyncFailure())
    })
}
```

Instead of returning an action, `sayHelloAsync` returns a function which launches the `fetch` call. `fetch` returns a `Promise`, which we use to *dispatch* different actions depending on the current state of our asynchronous call.

### 3 asynchronous action handlers

Let's handle these different actions in `src/client/reducer/hello.js`:

```js
// @flow

import Immutable from 'immutable'
import type { fromJS as Immut } from 'immutable'

import {
  SAY_HELLO,
  SAY_HELLO_ASYNC_REQUEST,
  SAY_HELLO_ASYNC_SUCCESS,
  SAY_HELLO_ASYNC_FAILURE,
} from '../action/hello'

const initialState = Immutable.fromJS({
  message: 'Initial reducer message',
  messageAsync: 'Initial reducer message for async call',
})

const helloReducer = (state: Immut = initialState, action: { type: string, payload: any }) => {
  switch (action.type) {
    case SAY_HELLO:
      return state.set('message', action.payload)
    case SAY_HELLO_ASYNC_REQUEST:
      return state.set('messageAsync', 'Loading...')
    case SAY_HELLO_ASYNC_SUCCESS:
      return state.set('messageAsync', action.payload)
    case SAY_HELLO_ASYNC_FAILURE:
      return state.set('messageAsync', 'No message received, please check your connection')
    default:
      return state
  }
}

export default helloReducer
```

We added a new field to our store, `messageAsync`, and we update it with different messages depending on the action we receive. During `SAY_HELLO_ASYNC_REQUEST`, we show `Loading...`. `SAY_HELLO_ASYNC_SUCCESS` updates `messageAsync` similarly to how `SAY_HELLO` updates `message`. `SAY_HELLO_ASYNC_FAILURE` gives an error message.

### Redux-thunk

In `src/client/action/hello.js`, we made `sayHelloAsync`, an action creator that returns a function. This is actually not a feature that is natively supported by Redux. In order to perform these async actions, we need to extend Redux's functionality with the `redux-thunk` *middleware*.

- Run `yarn add redux-thunk`

- Update your `src/client/index.jsx` file like so:

```js
// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import App from './app'
import helloReducer from './reducer/hello'
import { APP_CONTAINER_SELECTOR } from '../shared/config'
import { isProd } from '../shared/util'

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = (isProd ? null : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const store = createStore(combineReducers({ hello: helloReducer }),
  composeEnhancers(applyMiddleware(thunkMiddleware)))

const rootEl = document.querySelector(APP_CONTAINER_SELECTOR)

const wrapApp = (AppComponent, reduxStore) =>
  <Provider store={reduxStore}>
    <AppContainer>
      <AppComponent />
    </AppContainer>
  </Provider>

ReactDOM.render(wrapApp(App, store), rootEl)

if (module.hot) {
  // flow-disable-next-line
  module.hot.accept('./app', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./app').default
    ReactDOM.render(wrapApp(NextApp, store), rootEl)
  })
}
```

Here we pass `redux-thunk` to Redux's `applyMiddleware` function. In order for the Redux Devtools to keep working, we also need to use Redux's `compose` function. Don't worry too much about this part, just remember that we enhance Redux with `redux-thunk`.

- Update `src/client/app.jsx` like so:

```js
// @flow

import React from 'react'
import HelloButton from './container/hello-button'
import HelloAsyncButton from './container/hello-async-button'
import Message from './container/message'
import MessageAsync from './container/message-async'
import { APP_NAME } from '../shared/config'

const App = () =>
  <div>
    <h1>{APP_NAME}</h1>
    <Message />
    <HelloButton />
    <MessageAsync />
    <HelloAsyncButton />
  </div>

export default App
```

🏁 Run `yarn start` and `yarn dev:wds` and you should now be able to click the "Say hello asynchronously and send 1234" button and retrieve a corresponding message from the server! Since you're working locally, the call is instantaneous, but if you open the Redux Devtools, you will notice that each click triggers both `SAY_HELLO_ASYNC_REQUEST` and `SAY_HELLO_ASYNC_SUCCESS`, making the message go through the intermediate `Loading...` state as expected.

You can congratulate yourself, that was an intense section! Let's wrap it up with some testing.

## Testing

In this section, we are going to test our actions and reducer. Let's start with the actions.

In order to isolate the logic that is specific to `action/hello.js` we are going to need to *mock* things that don't concern it, and also mock that AJAX `fetch` request which should not trigger an actual AJAX in our tests.

- Run `yarn add --dev redux-mock-store fetch-mock`

- Create a `src/client/action/hello.test.js` file containing:

```js
import fetchMock from 'fetch-mock'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'

import {
  sayHelloAsync,
  sayHelloAsyncRequest,
  sayHelloAsyncSuccess,
  sayHelloAsyncFailure,
} from './hello'

import { helloEndpointRoute } from '../../shared/routes'

const mockStore = configureMockStore([thunkMiddleware])

afterEach(() => {
  fetchMock.restore()
})

test('sayHelloAsync success', () => {
  fetchMock.get(helloEndpointRoute(666), { serverMessage: 'Async hello success' })
  const store = mockStore()
  return store.dispatch(sayHelloAsync(666))
    .then(() => {
      expect(store.getActions()).toEqual([
        sayHelloAsyncRequest(),
        sayHelloAsyncSuccess('Async hello success'),
      ])
    })
})

test('sayHelloAsync 404', () => {
  fetchMock.get(helloEndpointRoute(666), 404)
  const store = mockStore()
  return store.dispatch(sayHelloAsync(666))
    .then(() => {
      expect(store.getActions()).toEqual([
        sayHelloAsyncRequest(),
        sayHelloAsyncFailure(),
      ])
    })
})

test('sayHelloAsync data error', () => {
  fetchMock.get(helloEndpointRoute(666), {})
  const store = mockStore()
  return store.dispatch(sayHelloAsync(666))
    .then(() => {
      expect(store.getActions()).toEqual([
        sayHelloAsyncRequest(),
        sayHelloAsyncFailure(),
      ])
    })
})
```

Alright, Let's look at what's happening here. First we mock the Redux store using `const mockStore = configureMockStore([thunkMiddleware])`. By doing this we can dispatch actions without them triggering any reducer logic. For each test, we mock `fetch` using `fetchMock.get()` and make it return whatever we want. What we actually test using `expect()` is which series of actions have been dispatched by the store, thanks to the `store.getActions()` function from `redux-mock-store`. After each test we restore the normal behavior of `fetch` with `fetchMock.restore()`.

Let's now test our reducer, which is much easier.

- Create a `src/client/reducer/hello.test.js` file containing:

```js
import {
  sayHello,
  sayHelloAsyncRequest,
  sayHelloAsyncSuccess,
  sayHelloAsyncFailure,
} from '../action/hello'

import helloReducer from './hello'

let helloState

beforeEach(() => {
  helloState = helloReducer(undefined, {})
})

test('handle default', () => {
  expect(helloState.get('message')).toBe('Initial reducer message')
  expect(helloState.get('messageAsync')).toBe('Initial reducer message for async call')
})

test('handle SAY_HELLO', () => {
  helloState = helloReducer(helloState, sayHello('Test'))
  expect(helloState.get('message')).toBe('Test')
})

test('handle SAY_HELLO_ASYNC_REQUEST', () => {
  helloState = helloReducer(helloState, sayHelloAsyncRequest())
  expect(helloState.get('messageAsync')).toBe('Loading...')
})

test('handle SAY_HELLO_ASYNC_SUCCESS', () => {
  helloState = helloReducer(helloState, sayHelloAsyncSuccess('Test async'))
  expect(helloState.get('messageAsync')).toBe('Test async')
})

test('handle SAY_HELLO_ASYNC_FAILURE', () => {
  helloState = helloReducer(helloState, sayHelloAsyncFailure())
  expect(helloState.get('messageAsync')).toBe('No message received, please check your connection')
})
```

Before each test, we initialize `helloState` with the default result of our reducer (the `default` case of our `switch` statement in the reducer, which returns `initialState`). The tests are then very explicit, we just make sure the reducer updates `message` and `messageAsync` correctly depending on which action it received.

🏁 Run `yarn test`. It should be all green.

Next section: [06 - React Router, Server-Side Rendering, Helmet](06-react-router-ssr-helmet.md#readme)

Back to the [previous section](04-webpack-react-hmr.md#readme) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
