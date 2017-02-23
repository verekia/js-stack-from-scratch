# 06 - React Router and Server-Side Rendering

In this chapter we are going to create different pages for our app and make it possible to navigate between them.

// In progress

## Pages

- Create Nav, create Pages

## Handling title changes

- Run `yarn install react-document-write`.

- `shared/util.js`

## App

- Create `client/app.jsx`

## React Router

> 💡 **[React Router](https://reacttraining.com/react-router/)** is a library to navigate between pages in your React app. It can be used on both the client and the server.

React Router has received a major update with its v4 release which is still in beta. Since I want this tutorial to be future-proof, we'll be using v4.

- Run `yarn add react-router@next react-router-dom@next`.

- Update your `src/client/index.jsx` like so:

```js
// @flow

import 'babel-polyfill'

import * as Immutable from 'immutable'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import App from '../shared/app'
import helloReducer from '../shared/reducer/hello'

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const preloadedState = window.__PRELOADED_STATE__
/* eslint-enable no-underscore-dangle */

const store = createStore(combineReducers({
  hello: helloReducer,
}), {
  hello: Immutable.fromJS(preloadedState.hello),
}, composeEnhancers(applyMiddleware(thunkMiddleware)))

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  , document.querySelector('.app'),
)
```

🏁 Run `yarn start`. Open `http://localhost:8000`, and click on the links to navigate between our different pages. You should see the URL changing dynamically. Switch between different pages and use the back button of your browser to see that the browsing history is working as expected.

Now, let's say you navigated to `http://localhost:8000/hello` this way. Hit the refresh button. You now get a 404, because our Express server only responds to `/`. As you navigated between pages, you were actually only doing it on the client-side. Let's add server-side rendering to mix to get the expected behavior.

## Server-Side Rendering

> 💡 **Server-Side Rendering** is

Mostly for SEO and fast initial load.

- Move all the files located under `client` to `shared`, except `src/client/index.jsx`.

### Explicit routes

- `shared/routes.js`

You will find a lot of React Router example using `*` as the route on the server, leaving the entire routing handling to React Router. Since all requests go through the same function, that makes it inconvenient to implement MVC-style pages. Instead, we're explicitly declaring the routes and their dedicated responses, to be able to fetch data from the database and pass it to a given page easily.

- Create `server/static-app`
- Create `server/store`
- `server/static-template`

Immutable objects implement the `toJSON()` method which means you can use `JSON.stringify` to turn them into plain JSON strings.

- `server/index.js`

🏁 Run `yarn start`.

Next section: [07 - Jest](/tutorial/07-jest#07---jest)

Back to the [previous section](/tutorial/05-redux-immutable-fetch#05---redux-immutable-fetch) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
