# 06 - React Router, Server-Side Rendering и Helmet

Кода за тази глава можете да намерите [тук](https://github.com/verekia/js-stack-walkthrough/tree/master/06-react-router-ssr-helmet).

В тази глава ще създадем различни страници на нашето приложение и ще направим възможно навигирането между тях.

## React Router

> 💡 **[React Router](https://reacttraining.com/react-router/)** е библиотека за навигиране между страниците във вашето React приложение. Може да бъде използвано както от страна на клиента, така и от страна на сървъра.

След v4 релийз React Router получи доста нови неща и въпреки че е още в бета версия, ще използвам него, тъй като искам това ръководство да бъде валидно и в бъдеще.

- Изпълнете `yarn add react-router@next react-router-dom@next`

От страна на клиента, първо ще трябва да вмъкнем нашето приложение в `BrowserRouter` компонент.

- Редактирайте `src/client/index.jsx` файла, както следва:

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

## Страници

Нашето приложение ще има 4 страници:

- Home page - начална страница
- A Hello page - показваща бутон и съобщение за синхронните действия.
- A Hello Async - показваща бутон и съобщение за асинхронните действия.
- A 404 "Not Found" page - страница, показваща се когато търсената страница не е налична, стандартното име за такъв тип страници е 404 Not Found.

- Създайте `src/client/component/page/home.jsx` файл, съдържащ:

```js
// @flow

import React from 'react'

const HomePage = () => <p>Home</p>

export default HomePage
```

- Създайте `src/client/component/page/hello.jsx` файл, съдържащ:

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

- Създайте `src/client/component/page/hello-async.jsx` файл, съдържащ:

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

- Създайте `src/client/component/page/not-found.jsx` файл, съдържащ:

```js
// @flow

import React from 'react'

const NotFoundPage = () => <p>Page not found</p>

export default NotFoundPage
```

## Навигация

Нека да добавим пътищата (routes) в конфигурационния файл, който може да се използва от всички части на приложението ни.

- Редактирайте `src/shared/routes.js` файла, както следва:

```js
// @flow

export const HOME_PAGE_ROUTE = '/'
export const HELLO_PAGE_ROUTE = '/hello'
export const HELLO_ASYNC_PAGE_ROUTE = '/hello-async'
export const NOT_FOUND_DEMO_PAGE_ROUTE = '/404'

export const helloEndpointRoute = (num: ?number) => `/ajax/hello/${num || ':num'}`
```

`/404` пътя ще бъде използван в навигацията просто, за да се покаже какво се случва по принцип когато се кликне на неработеща хипервръзка (broken link).

- Създайте `src/client/component/nav.jsx` файл, съдържащ:

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
        { route: NOT_FOUND_DEMO_PAGE_ROUTE, label: '404 Demo' }
      ].map(link => (
        <li key={link.route}>
          <NavLink to={link.route} activeStyle={{ color: 'limegreen' }} exact>{link.label}</NavLink>
        </li>
      ))}
    </ul>
  </nav>

export default Nav
```

Тук просто създаваме няколко `NavLink` елемента, които използват пътищата, които декларирахме преди малко.

- И накрая редактирайте `src/client/app.jsx` файла, както следва:

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

const App = () =>
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

export default App
```

🏁 Изпълнете `yarn start` и `yarn dev:wds`. Отворете `http://localhost:8000` и кликнете на хипервръзките, за да навигирате между различните страници. Би трябвало да виждате, че URL адреса се променя динамично. Променете текущата страница като отидете на друга и използвайте бутона "Назад" (Back) на вашия браузър, за да се върнете на предишната страница - по този начин виждаме, че историята на браузъра (browsing history) все още работи коректно.

Now, let's say you navigated to `http://localhost:8000/hello` this way. Hit the refresh button. You now get a 404, because our Express server only responds to `/`. As you navigated between pages, you were actually only doing it on the client-side. Let's add server-side rendering to the mix to get the expected behavior.

## Server-Side Rendering

> 💡 **Server-Side Rendering** means rendering your app at the initial load of the page instead of relying on JavaScript to render it in the client's browser.

SSR is essential for SEO and provides a better user experience by showing the app to your users right away.

The first thing we're going to do here is to migrate most of our client code to the shared / isomorphic / universal part of our codebase, since the server is now going to render our React app too.

### The big migration to `shared`

- Move all the files located under `client` to `shared`, except `src/client/index.jsx`.

We have to adjust a whole bunch of imports:

- In `src/client/index.jsx`, replace the 3 occurrences of `'./app'` by `'../shared/app'`, and `'./reducer/hello'` by `'../shared/reducer/hello'`

- In `src/shared/app.jsx`, replace `'../shared/routes'` by `'./routes'` and `'../shared/config'` by `'./config'`

- In `src/shared/component/nav.jsx`, replace `'../../shared/routes'` by `'../routes'`

### Server changes

- Create a `src/server/routing.js` file containing:

```js
// @flow

import {
  homePage,
  helloPage,
  helloAsyncPage,
  helloEndpoint,
} from './controller'

import {
  HOME_PAGE_ROUTE,
  HELLO_PAGE_ROUTE,
  HELLO_ASYNC_PAGE_ROUTE,
  helloEndpointRoute,
} from '../shared/routes'

import renderApp from './render-app'

export default (app: Object) => {
  app.get(HOME_PAGE_ROUTE, (req, res) => {
    res.send(renderApp(req.url, homePage()))
  })

  app.get(HELLO_PAGE_ROUTE, (req, res) => {
    res.send(renderApp(req.url, helloPage()))
  })

  app.get(HELLO_ASYNC_PAGE_ROUTE, (req, res) => {
    res.send(renderApp(req.url, helloAsyncPage()))
  })

  app.get(helloEndpointRoute(), (req, res) => {
    res.json(helloEndpoint(req.params.num))
  })

  app.get('/500', () => {
    throw Error('Fake Internal Server Error')
  })

  app.get('*', (req, res) => {
    res.status(404).send(renderApp(req.url))
  })

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err.stack)
    res.status(500).send('Something went wrong!')
  })
}
```

This file is where we deal with requests and responses. The calls to business logic are externalized to a different `controller` module.

**Note**: You will find a lot of React Router examples using `*` as the route on the server, leaving the entire routing handling to React Router. Since all requests go through the same function, that makes it inconvenient to implement MVC-style pages. Instead of doing that, we're here explicitly declaring the routes and their dedicated responses, to be able to fetch data from the database and pass it to a given page easily.

- Create a `src/server/controller.js` file containing:

```js
// @flow

export const homePage = () => null

export const helloPage = () => ({
  hello: { message: 'Server-side preloaded message' },
})

export const helloAsyncPage = () => ({
  hello: { messageAsync: 'Server-side preloaded message for async page' },
})

export const helloEndpoint = (num: number) => ({
  serverMessage: `Hello from the server! (received ${num})`,
})
```

Here is our controller. It would typically make business logic and database calls, but in our case we just hard-code some results. Those results are passed back to the `routing` module to be used to initialize our server-side Redux store.

- Create a `src/server/init-store.js` file containing:

```js
// @flow

import Immutable from 'immutable'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import helloReducer from '../shared/reducer/hello'

const initStore = (plainPartialState: ?Object) => {
  const preloadedState = plainPartialState ? {} : undefined

  if (plainPartialState && plainPartialState.hello) {
    // flow-disable-next-line
    preloadedState.hello = helloReducer(undefined, {})
      .merge(Immutable.fromJS(plainPartialState.hello))
  }

  return createStore(combineReducers({ hello: helloReducer }),
    preloadedState, applyMiddleware(thunkMiddleware))
}

export default initStore
```

The only thing we do here, besides calling `createStore` and applying middleware, is to merge the plain JS object we received from the `controller` into a default Redux state containing Immutable objects.

- Edit `src/server/index.js` like so:

```js
// @flow

import compression from 'compression'
import express from 'express'

import routing from './routing'
import { WEB_PORT, STATIC_PATH } from '../shared/config'
import { isProd } from '../shared/util'

const app = express()

app.use(compression())
app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))

routing(app)

app.listen(WEB_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${WEB_PORT} ${isProd ? '(production)' :
    '(development).\nKeep "yarn dev:wds" running in an other terminal'}.`)
})
```

Nothing special here, we just call `routing(app)` instead of implementing routing in this file.

- Rename `src/server/render-app.js` to `src/server/render-app.jsx` and edit it like so:

```js
// @flow

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'

import initStore from './init-store'
import App from './../shared/app'
import { APP_CONTAINER_CLASS, STATIC_PATH, WDS_PORT } from '../shared/config'
import { isProd } from '../shared/util'

const renderApp = (location: string, plainPartialState: ?Object, routerContext: ?Object = {}) => {
  const store = initStore(plainPartialState)
  const appHtml = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={location} context={routerContext}>
        <App />
      </StaticRouter>
    </Provider>)

  return (
    `<!doctype html>
    <html>
      <head>
        <title>FIX ME</title>
        <link rel="stylesheet" href="${STATIC_PATH}/css/style.css">
      </head>
      <body>
        <div class="${APP_CONTAINER_CLASS}">${appHtml}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState())}
        </script>
        <script src="${isProd ? STATIC_PATH : `http://localhost:${WDS_PORT}/dist`}/js/bundle.js"></script>
      </body>
    </html>`
  )
}

export default renderApp
```

`ReactDOMServer.renderToString` is where the magic happens. React will evaluate our entire `shared` `App`, and return a plain string of HTML elements. `Provider` works the same as on the client, but on the server, we wrap our app inside `StaticRouter` instead of `BrowserRouter`. In order to pass the Redux store from the server to the client, we pass it to `window.__PRELOADED_STATE__` which is just some arbitrary variable name.

**Note**: Immutable objects implement the `toJSON()` method which means you can use `JSON.stringify` to turn them into plain JSON strings.

- Edit `src/client/index.jsx` to use that preloaded state:

```js
import Immutable from 'immutable'
// [...]

/* eslint-disable no-underscore-dangle */
const composeEnhancers = (isProd ? null : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
const preloadedState = window.__PRELOADED_STATE__
/* eslint-enable no-underscore-dangle */

const store = createStore(combineReducers(
  { hello: helloReducer }),
  { hello: Immutable.fromJS(preloadedState.hello) },
  composeEnhancers(applyMiddleware(thunkMiddleware)))
```

Here with feed our client-side store with the `preloadedState` that was received from the server.

🏁 You can now run `yarn start` and `yarn dev:wds` and navigate between pages. Refreshing the page on `/hello`, `/hello-async`, and `/404` (or any other URI), should now work correctly. Notice how the `message` and `messageAsync` vary depending on if you navigated to that page from the client or if it comes from server-side rendering.

### React Helmet

> 💡 **[React Helmet](https://github.com/nfl/react-helmet)**: A library to inject content to the `head` of a React app, on both the client and the server.

I purposely made you write `FIX ME` in the title to highlight the fact that even though we are doing server-side rendering, we currently do not fill the `title` tag properly (or any of the tags in `head` that vary depending on the page you're on).

- Run `yarn add react-helmet`

- Edit `src/server/render-app.jsx` like so:

```js
import Helmet from 'react-helmet'
// [...]
const renderApp = (/* [...] */) => {
  // [...]
  const appHtml = ReactDOMServer.renderToString(/* [...] */)
  const head = Helmet.rewind()

  return (
    `<!doctype html>
    <html>
      <head>
        ${head.title}
        ${head.meta}
        <link rel="stylesheet" href="${STATIC_PATH}/css/style.css">
      </head>
    [...]
    `
  )
}
```

React Helmet uses [react-side-effect](https://github.com/gaearon/react-side-effect)'s `rewind` to pull out some data from the rendering of our app, which will soon contain some `<Helmet />` components. Those `<Helmet />` components are where we set the `title` and other `head` details for each page. Note that `Helmet.rewind()` *must* come after `ReactDOMServer.renderToString()`.

- Edit `src/shared/app.jsx` like so:

```js
import Helmet from 'react-helmet'
// [...]
const App = () =>
  <div>
    <Helmet titleTemplate={`%s | ${APP_NAME}`} defaultTitle={APP_NAME} />
    <Nav />
    // [...]
```

- Edit `src/shared/component/page/home.jsx` like so:

```js
// @flow

import React from 'react'
import Helmet from 'react-helmet'

import { APP_NAME } from '../../config'

const HomePage = () =>
  <div>
    <Helmet
      meta={[
        { name: 'description', content: 'Hello App is an app to say hello' },
        { property: 'og:title', content: APP_NAME },
      ]}
    />
    <h1>{APP_NAME}</h1>
  </div>

export default HomePage

```

- Edit `src/shared/component/page/hello.jsx` like so:

```js
// @flow

import React from 'react'
import Helmet from 'react-helmet'

import HelloButton from '../../container/hello-button'
import Message from '../../container/message'

const title = 'Hello Page'

const HelloPage = () =>
  <div>
    <Helmet
      title={title}
      meta={[
        { name: 'description', content: 'A page to say hello' },
        { property: 'og:title', content: title },
      ]}
    />
    <h1>{title}</h1>
    <Message />
    <HelloButton />
  </div>

export default HelloPage
```

- Edit `src/shared/component/page/hello-async.jsx` like so:

```js
// @flow

import React from 'react'
import Helmet from 'react-helmet'

import HelloAsyncButton from '../../container/hello-async-button'
import MessageAsync from '../../container/message-async'

const title = 'Async Hello Page'

const HelloAsyncPage = () =>
  <div>
    <Helmet
      title={title}
      meta={[
        { name: 'description', content: 'A page to say hello asynchronously' },
        { property: 'og:title', content: title },
      ]}
    />
    <h1>{title}</h1>
    <MessageAsync />
    <HelloAsyncButton />
  </div>

export default HelloAsyncPage

```

- Edit `src/shared/component/page/not-found.jsx` like so:

```js
// @flow

import React from 'react'
import Helmet from 'react-helmet'

const title = 'Page Not Found'

const NotFoundPage = () =>
  <div>
    <Helmet
      title={title}
      meta={[
        { name: 'description', content: 'A page to say hello' },
        { property: 'og:title', content: title },
      ]}
    />
    <h1>{title}</h1>
  </div>

export default NotFoundPage
```

The `<Helmet>` component doesn't actually render anything, it just injects content in the `head` of your document and exposes the same data to the server.

🏁 Run `yarn start` and `yarn dev:wds` and navigate between pages. The title on your tab should change when you navigate, and it should also stay the same when you refresh the page. Show the source of the page to see how React Helmet sets the `title` and `meta` tags even for server-side rendering.

Следваща глава: [07 - Socket.IO](07-socket-io.md#readme)

Назад към [предишната глава](05-redux-immutable-fetch.md#readme) или към [съдържанието](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
