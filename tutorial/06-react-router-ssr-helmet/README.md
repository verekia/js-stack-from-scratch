# 06 - React Router, Server-Side Rendering, and Helmet

In this chapter we are going to create different pages for our app and make it possible to navigate between them.

## React Router

> 💡 **[React Router](https://reacttraining.com/react-router/)** is a library to navigate between pages in your React app. It can be used on both the client and the server.

React Router has received a major update with its v4 release which is still in beta. Since I want this tutorial to be future-proof, we'll be using v4.

- Run `yarn add react-router@next react-router-dom@next`

- Update your `src/client/index.jsx` like so:

```js
// [...]
import { BrowserRouter } from 'react-router-dom'
// [...]
const wrapApp = (AppComponent, reduxStore) =>
  <Provider store={reduxStore}>
    <BrowserRouter>
      <AppContainer>
        <AppComponent />
      </AppContainer>
    </BrowserRouter>
  </Provider>
```

## Pages

- Create a `src/client/component/page/home.jsx` file containing:

```js
// @flow

import React from 'react'

const HomePage = () => <p>Home</p>

export default HomePage
```

- Create a `src/client/component/page/hello.jsx` file containing:

```js
// @flow

import React from 'react'

import HelloButton from '../../container/hello-button'
import Message from '../../container/message'

const HelloPage = () =>
  <div>
    <Message />
    <HelloButton />
  </div>

export default HelloPage

```

- Create a `src/client/component/page/hello-async.jsx` file containing:

```js
// @flow

import React from 'react'

import HelloAsyncButton from '../../container/hello-async-button'
import MessageAsync from '../../container/message-async'

const HelloAsyncPage = () =>
  <div>
    <MessageAsync />
    <HelloAsyncButton />
  </div>

export default HelloAsyncPage
```

- Create a `src/client/component/page/not-found.jsx` file containing:

```js
// @flow

import React from 'react'

const NotFoundPage = () => <p>Page not found</p>

export default NotFoundPage
```

## Navigation

- Edit your `src/shared/routes.js` like so:

```js
// @flow

export const HOME_PAGE_ROUTE = '/'
export const HELLO_PAGE_ROUTE = '/hello'
export const HELLO_ASYNC_PAGE_ROUTE = '/hello-async'
export const NOT_FOUND_DEMO_PAGE_ROUTE = '/404'

export const helloEndpointRoute = (num: ?number) => `/ajax/hello/${num || ':num'}`
```

- Create a `src/client/component/nav.jsx` file containing:

```js
// @flow

import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  HOME_PAGE_ROUTE,
  HELLO_PAGE_ROUTE,
  HELLO_ASYNC_PAGE_ROUTE,
  NOT_FOUND_DEMO_PAGE_ROUTE,
} from '../../shared/routes'

const Nav = () =>
  <nav>
    <ul>
      {[
        { route: HOME_PAGE_ROUTE, label: 'Home' },
        { route: HELLO_PAGE_ROUTE, label: 'Say Hello' },
        { route: HELLO_ASYNC_PAGE_ROUTE, label: 'Say Hello Asynchronously' },
        { route: NOT_FOUND_DEMO_PAGE_ROUTE, label: '404 Demo' },
      ].map(link => (
        <li key={link.route}>
          <NavLink to={link.route} activeStyle={{ color: 'limegreen' }} exact>{link.label}</NavLink>
        </li>
      ))}
    </ul>
  </nav>

export default Nav
```

And finally, edit `src/client/app.jsx` like so:

```js
// @flow

import React from 'react'

import { Switch } from 'react-router'
import { Route } from 'react-router-dom'
import { APP_NAME } from '../shared/config'
import Nav from './component/nav'
import HomePage from './component/page/home'
import HelloPage from './component/page/hello'
import HelloAsyncPage from './component/page/hello-async'
import NotFoundPage from './component/page/not-found'
import {
  HOME_PAGE_ROUTE,
  HELLO_PAGE_ROUTE,
  HELLO_ASYNC_PAGE_ROUTE,
} from '../shared/routes'

const App = () => (
  <div>
    <h1>{APP_NAME}</h1>
    <Nav />
    <Switch>
      <Route exact path={HOME_PAGE_ROUTE} render={() => <HomePage />} />
      <Route path={HELLO_PAGE_ROUTE} render={() => <HelloPage />} />
      <Route path={HELLO_ASYNC_PAGE_ROUTE} render={() => <HelloAsyncPage />} />
      <Route component={NotFoundPage} />
    </Switch>
  </div>
)

export default App
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

### React Helmet

🏁 Run `yarn start`.

Next section: [07 - Socket.IO](/tutorial/07-socket-io)

Back to the [previous section](/tutorial/05-redux-immutable-fetch) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
