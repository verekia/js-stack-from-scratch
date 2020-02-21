# 05 - Redux, Immutable, and Fetch

Kod dla tego rozdziału dostępny jest [tutaj](https://github.com/verekia/js-stack-walkthrough/tree/master/05-redux-immutable-fetch).

W tym rozdziale połączymy React i Redux, aby stworzyć bardzo prostą aplikację. Aplikacja będzie składać się z wiadomości i przycisku. Komunikat zmienia się, gdy użytkownik kliknie przycisk.

Zanim zaczniemy, oto bardzo szybkie wprowadzenie do ImmutableJS, które jest całkowicie niezwiązane z React i Redux, ale zostanie wykorzystane w tym rozdziale.

## ImmutableJS

> 💡 **[ImmutableJS](https://facebook.github.io/immutable-js/)** (lub poprostu Immutable) to biblioteka Facebooka do manipulowania niezmiennymi kolekcjami, takimi jak listy i mapy. Każda zmiana dokonana na niezmiennym obiekcie zwraca nowy obiekt bez mutowania oryginalnego obiektu.

Na przykład zamiast robić:

```js
const obj = { a: 1 }
obj.a = 2 // Mutates `obj`
```

Możesz tak:

```js
const obj = Immutable.Map({ a: 1 })
obj.set('a', 2) // Returns a new object without mutating `obj`
```

Podejście to jest zgodne z paradygmatem **programowania funkcyjnego**, który działa naprawdę dobrze z Redux.

Podczas tworzenia niezmiennych kolekcji bardzo wygodną metodą jest `Immutable.fromJS ()`, która pobiera dowolny zwykły obiekt JS lub tablicę i zwraca jego głęboko niezmienną wersję:

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

- Uruchom `yarn add immutable@4.0.0-rc.2`

## Redux

> 💡 **[Redux](http://redux.js.org/)** to biblioteka do obsługi cyklu życia aplikacji. Tworzy *magazyn*, który jest jedynym źródłem prawdy o stanie twojej aplikacji w danym momencie.

Zacznijmy od prostej części, ogłaszając nasze działania Redux:

- Uruchom `yarn add redux redux-actions`

- Stwórz plik `src/client/action/hello.js` zawierający:

```js
// @flow

import { createAction } from 'redux-actions'

export const SAY_HELLO = 'SAY_HELLO'

export const sayHello = createAction(SAY_HELLO)
```

  Ten plik ujawnia *action*, `SAY_HELLO`, i jej *action creator*, `sayHello`, co jest funkcją. Użyjemy [`redux-actions`](https://github.com/acdlite/redux-actions) aby zmniejszyć boilerplate związaną z działaniami Redux. `redux-actions` implementuje model [Flux Standard Action](https://github.com/acdlite/flux-standard-action), który robi *action creators* zwraca obiekty z atrybutami `type` i `payload`.

- Utwórz plik `src/client/reducer/hello.js` zawierający:

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

W tym pliku inicjujemy stan naszego reduktora za pomocą Immutable Map zawierający jedną właściwość, `message`, ustawiające `Initial reducer message`. `helloReducer` obsługuje `SAY_HELLO` działania po prostu ustawiając nowe `message` z akcją ładowania. The Flow anotacja dla `action` niszczy `type` i `payload`. `payload` może być typem `any`. Wygląda odjechanie, jeśli nigdy wcześniej tego nie widziałeś, ale nadal jest całkiem zrozumiałe. Dla rodzaju `state`, używamy `import type` Flow instrukcji do zwrotu typu `fromJS`. Zmienimy nazwę `Immut` dla klarowności, ponieważ `state: fromJS` byłoby dość mylące. Linia `import type`  zostanie usunięta jak każda inna adnotacja Flow. Zwróć uwagę na użycie `Immutable.fromJS()` i `set()` tak jak wcześniej.

## React-Redux

> 💡 **[react-redux](https://github.com/reactjs/react-redux)** *połączenie* Redux store z komponentami React. Z `react-redux`, wtedy gdy Redux store zmienia, komponenty React będą automatycznie aktualizowane. Mogą także wystrzelić akcje Redux.

- uruchom `yarn add react-redux`

W tej sekcji zamierzamy stworzyć *Komponenty* and *Kontenery*.

**Komponenty** są *głupimi* komponentami React, w tym sensie, że nic nie wiedzą o stanie Redux. **Kontenery** to *inteligentne* komponenty, które wiedzą o stanie i zamierzamy *połączyć* nasze głupie komponenty.

- Stwórz plik `src/client/component/button.jsx` zawierający:

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

**Uwaga**: Tutaj możesz zobaczyć przypadek Flow *type alias*. Definiujemy typ `Rekwizyty` przed dodaniem do niego adnotacji zniszczonych rekwizytów naszego komponentu.

- Stwórz plik `src/client/component/message.jsx` zawierający:

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

To są przykłady *głupich* komponentów. Są pozbawione logiki i po prostu pokazują wszystko, o co proszą o pokazanie za pomocą React **props**. Główna różnica pomiędzy `button.jsx` i `message.jsx` jest taka że `Button` zawiera odniesienie do dyspozytora akcji w jego rekwizytach, gdzie 'Wiadomoś' zawiera tylko pewne dane do pokazania.

Ponownie, *komponenty* nie wiedzą nic o **akcjach** lub **stanie** Reduxa naszej aplikacji, dlatego stworzymy inteligentne **kontenery**, które będą dostarczać odpowiednie dyspozytory działań i dane do tych 2 głupich komponentów.

- Utwórz plik `src/client/container/hello-button.js` zawierający:

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

Ten kontener łączy komponent `Button` z akcją `sayHello` i metodą `dispatch` Redux.

- Stwórz plik `src/client/container/message.js` zawierający:

```js
// @flow

import { connect } from 'react-redux'

import Message from '../component/message'

const mapStateToProps = state => ({
  message: state.hello.get('message'),
})

export default connect(mapStateToProps)(Message)
```

Ten kontener łączy stan aplikacji Redux ze składnikiem 'Wiadomość'. Kiedy stan się zmienia, `Wiadomość` będzie teraz automatycznie ponownie renderowana z odpowiednim prop. Połączenia te są wykonywane za pośrednictwem `connect` funkcji `react-redux`.

- Zaktualizuj swój plik `src/client/app.jsx` tak oto:

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

Nadal nie zainicjowaliśmy store Reduxa i nie umieściliśmy jeszcze 2 pojemników w naszej aplikacji:

- Edytuj `src/client/index.jsx` tak:

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

Poświęćmy chwilę na przejrzenie tego. Najpierw tworzymy *store* z `createStore`. Store są tworzone przez przekazywanie do nich reduktorów. Tutaj mamy tylko jeden reduktor, ale ze względu na przyszłą skalowalność, używamy `CombineReducers` do grupowania wszystkich naszych reduktorów. Ostatni dziwny parametr `createStore` to coś do podłączenia Redux do przeglądarki [Devtools](https://github.com/zalmoxisus/redux-devtools-extension), które są niezwykle przydatne podczas debugowania. Ponieważ ESLint będzie narzekać na podkreślenia w `__REDUX_DEVTOOLS_EXTENSION__`, wyłączamy tę regułę ESLint. Następnie wygodnie zawijamy całą naszą aplikację do komponentu `Provider` programu 'reag-redux' dzięki naszej funkcji `wrapApp` i przekazujemy do niego nasz sklep.

🏁 Możesz teraz uruchomić `yarn start` i `yarn dev:wds` oraz załadować `http://localhost:8000`. Powinien zostać wyświetlony komunikat 'Początkowa wiadomość reduktora' i przycisk. Po kliknięciu przycisku wiadomość powinna zmienić się na 'Cześć!'. Jeśli zainstalowałeś Redux Devtools w swojej przeglądarce, powinieneś zobaczyć zmianę stanu aplikacji w miarę upływu czasu po kliknięciu przycisku.

Gratulacje, w końcu stworzyliśmy aplikację, która coś robi! Okej, to nie jest *super* imponujące z zewnątrz, ale wszyscy wiemy, że jest zasilany przez jeden stos 'badassów' pod maską.

## Rozszerzanie naszej aplikacji o połączenie asynchroniczne

Teraz dodamy drugi przycisk do naszej aplikacji, który uruchomi wywołanie AJAX w celu pobrania wiadomości z serwera. W celu zademonstrowania połączenie to wyśle również pewne dane, zakodowany numer „1234”.

### Punkt końcowy serwera

- Utwórz plik `src/shared/routes.js` zawierający:

```js
// @flow

// eslint-disable-next-line import/prefer-default-export
export const helloEndpointRoute = (num: ?number) => `/ajax/hello/${num || ':num'}`
```

Ta funkcja jest małym pomocnikiem w tworzeniu następujących:

```js
helloEndpointRoute()     // -> '/ajax/hello/:num' (for Express)
helloEndpointRoute(1234) // -> '/ajax/hello/1234' (for the actual call)
```

Stwórzmy test naprawdę szybko, aby upewnić się, że to działa dobrze.

- Stwórz `src/shared/routes.test.js` zawierający:

```js
import { helloEndpointRoute } from './routes'

test('helloEndpointRoute', () => {
  expect(helloEndpointRoute()).toBe('/ajax/hello/:num')
  expect(helloEndpointRoute(123)).toBe('/ajax/hello/123')
})
```

- Uruchom `yarn test` i powinno przejść pomyślnie.

- W `src/server/index.js`, dodaj następująco:

```js
import { helloEndpointRoute } from '../shared/routes'

// [under app.get('/')...]

app.get(helloEndpointRoute(), (req, res) => {
  res.json({ serverMessage: `Hello from the server! (received ${req.params.num})` })
})
```

### Nowe kontenery

- Stwórz plik `src/client/container/hello-async-button.js` zawierający:

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

Aby zademonstrować, jak przekazać parametr do wywołania asynchronicznego i dla uproszczenia, tutaj mocno wpisuję wartość `1234`. Ta wartość zazwyczaj pochodzi z pola formularza wypełnionego przez użytkownika.

- Stwórz plik `src/client/container/message-async.js` zawierający:

```js
// @flow

import { connect } from 'react-redux'

import MessageAsync from '../component/message'

const mapStateToProps = state => ({
  message: state.hello.get('messageAsync'),
})

export default connect(mapStateToProps)(MessageAsync)
```

Możesz zobaczyć, że w tym kontenerze mamy na myśli właściwość `messageAsync`, którą wkrótce dodamy do naszego reduktora.

Teraz potrzebujemy stworzyć akcję `sayHelloAsync`.

### Fetch

> 💡 **[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)** jest znormalizowaną funkcją JavaScript do wykonywania wywołań asynchronicznych inspirowanych metodami AJAX jQuery.

Będziemy używać `fetch` do wykonywania połączeń z serwerem od klienta. `fetch` nie jest jeszcze obsługiwany przez wszystkie przeglądarki, więc będziemy potrzebować wielokrotnego wypełniania. `isomorphic-fetch` jest polifillem, który sprawia, że działa w różnych przeglądarkach, a także w Node!

- Uruchom `yarn add isomorphic-fetch`

Od kiedy używamy `eslint-plugin-compat`, musimy wskazać, że używamy polyfill dla `fetch`, aby nie otrzymywać ostrzeżeń przed jego użyciem.

- Dodaj w następujący sposób linijki do pliku `.eslintrc.json`:

```json
"settings": {
  "polyfills": ["fetch"]
},
```

### 3 asynchroniczne akcje

`sayHelloAsync` nie będzie regularną akcją. Działania asynchroniczne są zwykle podzielone na 3 działania, które wyzwalają 3 różne stany: działanie *żądanie* (lub 'ładowanie'), działanie *sukces* i działanie *niepowodzenie*.

- Edytuj `src/client/action/hello.js` tak:

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

Zamiast zwracać akcję, `sayHelloAsync` zwraca funkcję, która uruchamia wywołanie` fetch`. `fetch` zwraca obietnicę, której używamy do *wysyłania* różnych akcji w zależności od aktualnego stanu naszego asynchronicznego wywołania.

### 3 procedury obsługi akcji asynchronicznych

Zajmijmy się tymi różnymi działaniami w `src/client/reducer/hello.js`:

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

Dodaliśmy nowe pole do naszego sklepu, `messageAsync`, i aktualizujemy je o różne wiadomości w zależności od otrzymywanego działania. Podczas `SAY_HELLO_ASYNC_REQUEST` pokazujemy 'Ładowanie ...'. `SAY_HELLO_ASYNC_SUCCESS` aktualizuje `messageAsync` podobnie jak `SAY_HELLO` aktualizuje `message`. `SAY_HELLO_ASYNC_FAILURE` wyświetla komunikat o błędzie.

### Redux-thunk

W `src/client/action/hello.js`, stworzyliśmy `sayHelloAsync`, twórca akcji, który zwraca funkcję. W rzeczywistości nie jest to funkcja natywnie obsługiwana przez Redux. Aby wykonać te działania asynchroniczne, musimy rozszerzyć funkcjonalność Redux o *middleware* `redux-thunk`.

- Uruchom `yarn add redux-thunk`

- Zaktualizuj swój plik `src/client/index.jsx` tak:

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

Tutaj przekazujemy `redux-thunk` do Redux-owej funkcji `applyMiddleware`. Aby narzędzia Redux Devtools mogły dalej działać, musimy również użyć funkcji 'compose' Reduxa. Nie przejmuj się zbytnio tą częścią, pamiętaj tylko, że ulepszamy Redux z `redux-thunk`.

- Zaktualizuj `src/client/app.jsx` tak oto:

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

🏁 Uruchom `yarn start` i `yarn dev:wds` i powinieneś być teraz w stanie kliknąć przycisk 'Przywitaj się asynchronicznie i wyślij 1234' i pobierz odpowiednią wiadomość z serwera! Ponieważ pracujesz lokalnie, połączenie jest natychmiastowe, ale jeśli otworzysz Redux Devtools, zauważysz, że każde kliknięcie wyzwala oba `SAY_HELLO_ASYNC_REQUEST` oraz `SAY_HELLO_ASYNC_SUCCESS`, sprawiając, że wiadomość przechodzi przez `Loading...` stan jak oczekiwano.

Możesz pogratulować sobie, to była intensywna sekcja! Zakończmy to testami.

## Testowanie

W tej sekcji będziemy testować nasze działania i reduktor. Zacznijmy od działań.

Aby wyizolować logikę, która jest specyficzna dla `action/hello.js` będziemy musieli *mockować* rzeczy, które go nie dotyczą, a także mockować to żądanie pobierania AJAX, które nie powinno wyzwalać rzeczywistego AJAX w naszych testach.

- Uruchom `yarn add --dev redux-mock-store fetch-mock`

- Stwórz plik `src/client/action/hello.test.js` zawierający:

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

Dobra, spójrzmy na to, co się tutaj dzieje. Najpierw mockujemy Redux store za pomocą`const mockStore = configureMockStore([thunkMiddleware])`. W ten sposób możemy wywoływać działania bez wyzwalania jakiejkolwiek logiki reduktora. Do każdego testu mockujemy `fetch` używając `fetchMock.get()` i sprawi, że zwróci wszystko, czego chcemy. Co faktycznie testujemy przy użyciu `expect()`, która seria akcji została wysłana przez store, dzięki funkcji `store.getActions()` z `redux-mock-store`. Po każdym teście przywracamy normalne zachowanie `fetch` z `fetchMock.restore()`.

Przetestujmy teraz nasz reduktor, co jest znacznie łatwiejsze.

- Utwórz plik `src/client/reducer/hello.test.js` zawierający:

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

Przed każdym testem inicjujemy `helloState` z domyślnym wynikiem naszego reduktora (`default` naszego `switch` instrukcja w reduktorze, która zwraca `initialState`). Testy są wtedy bardzo wyraźne, upewniamy się tylko, że reduktor poprawnie aktualizuje `message` i` messageAsync` w zależności od tego, jakie działanie otrzymał.

🏁 Uruchom `yarn test`. Wszystko powinno być na zielono.

Następna sekcja: [06 - React Router, Server-Side Rendering, Helmet](06-react-router-ssr-helmet.md#readme)

Powrót do [poprzedniej sekcji](04-webpack-react-hmr.md#readme) albo [spisu treści](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
