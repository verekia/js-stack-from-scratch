# 06 - React Router, Server-Side Rendering, oraz Helmet

Kod dla tego rozdziału dostępny jest [tutaj](https://github.com/verekia/js-stack-walkthrough/tree/master/06-react-router-ssr-helmet).

W tym rozdziale utworzymy różne strony dla naszej aplikacji i umożliwimy nawigację między nimi.

## React Router

> 💡 **[React Router](https://reacttraining.com/react-router/)** to biblioteka do nawigacji między stronami w aplikacji React. Można go używać zarówno na kliencie, jak i na serwerze.

- Uruchom `yarn add react-router react-router-dom`

Po stronie klienta musimy najpierw owinąć naszą aplikację wewnątrz `BrowserRouter` komponentu.

- Zaktualizuj swój `src/client/index.jsx` w ten sposób:

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

## Strony

Nasza aplikacja będzie miała 4 strony:

- Strona główna.
- Strona Hello wyświetlająca przycisk i komunikat dla akcji synchronicznej.
- Strona Hello Async pokazująca przycisk i komunikat dla akcji asynchronicznej.
- Strona 404 'Nie znaleziono'.

- Stwórz plik `src/client/component/page/home.jsx` zawierający:

```js
// @flow

import React from 'react'

const HomePage = () => <p>Home</p>

export default HomePage
```

- Stwórz plik `src/client/component/page/hello.jsx` zawierający:

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

- Stwórz plik `src/client/component/page/hello-async.jsx` zawierający:

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

- Stwórz plik `src/client/component/page/not-found.jsx` zawierający:

```js
// @flow

import React from 'react'

const NotFoundPage = () => <p>Page not found</p>

export default NotFoundPage
```

## Nawigacja

Dodajmy trasy w udostępnionym pliku konfiguracyjnym.

- Edytuj swój `src/shared/routes.js` tak:

```js
// @flow

export const HOME_PAGE_ROUTE = '/'
export const HELLO_PAGE_ROUTE = '/hello'
export const HELLO_ASYNC_PAGE_ROUTE = '/hello-async'
export const NOT_FOUND_DEMO_PAGE_ROUTE = '/404'

export const helloEndpointRoute = (num: ?number) => `/ajax/hello/${num || ':num'}`
```

Trasa `/404` zostanie po prostu użyta w linku nawigacyjnym w celu zademonstrowania, co się stanie, gdy klikniesz uszkodzony link.

- Stwórz plik `src/client/component/nav.jsx` zawierający:

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

Tutaj po prostu tworzymy kilka `NavLink` korzystające z wcześniej zadeklarowanych tras.

- Końcowo, edytuj `src/client/app.jsx` w ten sposób:

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

🏁 Uruchom `yarn start` i `yarn dev:wds`. Otwórz `http://localhost:8000`, i klikaj łącza, aby nawigować między naszymi różnymi stronami. Powinieneś zobaczyć adres URL zmieniający się dynamicznie. Przełączaj się między różnymi stronami i użyj przycisku Wstecz przeglądarki, aby sprawdzić, czy historia przeglądania działa zgodnie z oczekiwaniami.

Powiedzmy, że nawigujesz do `http://localhost:8000/hello` tą drogą. Naciśnij przycisk odświeżania. Otrzymujesz teraz 404, ponieważ nasz serwer Express odpowiada tylko na `/`. Gdy nawigowałeś między stronami, robiłeś to tylko po stronie klienta. Dodajmy renderowanie po stronie serwera do miksu, aby uzyskać oczekiwane zachowanie.

## Server-Side Rendering

> 💡 **Server-Side Rendering** oznacza renderowanie aplikacji przy początkowym załadowaniu strony zamiast polegania na JavaScript do renderowania jej w przeglądarce klienta.

SSR jest niezbędny dla SEO (search engine optimization, przyp. tłum.) i zapewnia lepsze wrażenia użytkownika, wyświetlając aplikację użytkownikom.

Pierwszą rzeczą, którą tutaj zrobimy, jest migracja większości naszego kodu klienta do wspólnej / izomorficznej / uniwersalnej części naszej bazy kodów, ponieważ serwer będzie teraz renderował również naszą aplikację React.

### Duża migracja do `shared`

- Przenieś wszystkie pliki znajdujące się pod `client` do `shared`, z wyjątkiem `src/client/index.jsx`.

Musimy dostosować całą masę importu:

- W `src/client/index.jsx`, zamień 3 wystąpienia `'./app'` przez `'../shared/app'`, i `'./reducer/hello'` przez `'../shared/reducer/hello'`

- W `src/shared/app.jsx`, zamień `'../shared/routes'` przez `'./routes'` i `'../shared/config'` przez `'./config'`

- W `src/shared/component/nav.jsx`, zamień `'../../shared/routes'` przez `'../routes'`

### Zmiany serwera

- Stwórz plik `src/server/routing.js` zawierający:

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

W tym pliku mamy do czynienia z żądaniami i odpowiedziami. Połączenia z logiką biznesową są uzewnętrzniane na inny moduł `controller`.

**Uwaga**: Znajdziesz wiele przykładów React Routera, używając `*` jako trasy na serwerze, pozostawiając całą obsługę routingu React Routerowi. Ponieważ wszystkie żądania przechodzą przez tę samą funkcję, utrudnia to implementację stron w stylu MVC. Zamiast tego, tutaj wyraźnie deklarujemy trasy i ich dedykowane odpowiedzi, aby móc łatwo pobrać dane z bazy danych i przekazać je na daną stronę.

- Stwórz plik `src/server/controller.js` zawierający:

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

Oto nasz kontroler. Zwykle wykonuje logikę biznesową i połączenia z bazą danych, ale w naszym przypadku po prostu zapisujemy niektóre wyniki. Wyniki te są przekazywane z powrotem do modułu `routing`, który służy do inicjalizacji naszego sklepu Redux po stronie serwera.

- Stwórz plik `src/server/init-store.js` zawierający:

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

Jedyne, co tu robimy, oprócz wywoływania `createStore` i zastosowania oprogramowania pośredniego polega na scaleniu prostego obiektu JS, który otrzymaliśmy z kontrolera, do domyślnego stanu Redux zawierającego niezmienne obiekty.

- Edytuj `src/server/index.js` tak jak poniżej:

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

Nic specjalnego tutaj, po prostu wywołujemy `routing(app)` zamiast implementować routing w tym pliku.

- Zmień nazwę `src/server/render-app.js` na `src/server/render-app.jsx` i zedytuj tak:

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

`ReactDOMServer.renderToString` jest tam, gdzie dzieje się magia. Reakcja oceni naszą całość `shared`` App` i zwróci zwykły ciąg elementów HTML. `Provider` działa tak samo jak na kliencie, ale na serwerze opakowujemy naszą aplikację w `StaticRouter` zamiast `BrowserRouter`. Aby przekazać sklep Redux z serwera do klienta, przekazujemy go do `window .__ PRELOADED_STATE__`, który jest tylko nazwą dowolnej zmiennej.

**Uwaga**: Niezmienne obiekty implementują metodę `toJSON ()`, co oznacza, że możesz użyć `JSON.stringify`, aby przekształcić je w zwykłe ciągi JSON.

- Edytuj `src/client/index.jsx` aby użyć tego stanu wstępnie załadowanego:

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

Tutaj z kanałem do naszego sklepu po stronie klienta z 'preloadedState', który został otrzymany z serwera.

🏁 Możesz teraz uruchomić `yarn start` oraz `yarn dev:wds` i nawigować pomiędzy stronami. Odświeżenie strony `/hello`, `/hello-async`, i `/404` (lub każdego innego URI), nie powinno działać prawidłowo. Zauważ jak `message` i `messageAsync` różnią się w zależności od tego, czy użytkownik przeszedł do tej strony z klienta, czy pochodzi z renderowania po stronie serwera.

### React Helmet

> 💡 **[React Helmet](https://github.com/nfl/react-helmet)**: Biblioteka do wstrzykiwania treści do `head` aplikacji React, zarówno na kliencie, jak i na serwerze.

Celowo kazałem ci pisać `FIX ME` w tytule, aby podkreślić fakt, że chociaż wykonujemy rendering po stronie serwera, obecnie nie wypełniamy go tagiem `title`  oprawnie (lub dowolny z tagów w `head`, które różnią się w zależności od strony, na której jesteś).

- Uruchom `yarn add react-helmet`

- Edytuj `src/server/render-app.jsx` w ten sposób:

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

React Helmet używa [react-side-effect](https://github.com/gaearon/react-side-effect)'s `rewind` aby usunąć niektóre dane z renderowania naszej aplikacji, które wkrótce będą zawierać niektóre komponenty `<Helmet />`. Te komponenty `<Helmet />`  są tam, gdzie ustawiamy `title` i inne szczegóły `head` dla każdej strony. Zauważ jak `Helmet.rewind()` *musi* pojawić się po `ReactDOMServer.renderToString()`.

- Edytuj `src/shared/app.jsx` tak:

```js
import Helmet from 'react-helmet'
// [...]
const App = () =>
  <div>
    <Helmet titleTemplate={`%s | ${APP_NAME}`} defaultTitle={APP_NAME} />
    <Nav />
    // [...]
```

- Edytuj `src/shared/component/page/home.jsx` tak:

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

- Edytuj `src/shared/component/page/hello.jsx` tak:

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

- Edytuj `src/shared/component/page/hello-async.jsx` tak:

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

- Edytuj `src/shared/component/page/not-found.jsx` tak:

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

Komponent `<Helmet>` tak naprawdę nic nie renderuje, po prostu wstrzykuje zawartość do `head` twojego dokumentu i udostępnia te same dane serwerowi.

🏁 Uruchom `yarn start` oraz `yarn dev:wds` i przełączaj się pomiędzy stronami. Tytuł na karcie powinien się zmieniać podczas nawigacji, a także powinien pozostać niezmieniony podczas odświeżania strony. Pokaż źródło strony, aby zobaczyć, jak React Helmet ustawia tagi `title` i `meta` nawet do renderowania po stronie serwera.

Następna sekcja: [07 - Socket.IO](07-socket-io.md#readme)

Powrót do [poprzedniej sekcji](05-redux-immutable-fetch.md#readme) lub do [spisu treści](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
