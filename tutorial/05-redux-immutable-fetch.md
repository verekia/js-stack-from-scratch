# 05 - Redux, Immutable, and Fetch

Кода за тази глава можете да намерите [тук](https://github.com/verekia/js-stack-walkthrough/tree/master/05-redux-immutable-fetch).

В тази глава ще свържем React с Redux и ще направим едно простичко приложение. Приложението ще се състои от едно съобщение и един бутон. Съобщението ще се променя когато потребителя натисне бутона.

Преди да започнем, ви предлагам едно много бързо въведение за ImmutableJS, което няма нищо обще с React и Redux, но ще бъде използвано в тази глава.

## ImmutableJS

> 💡 **[ImmutableJS](https://facebook.github.io/immutable-js/)** (или само Immutable) е библиотека, създадена от Facebook, за манипулиране на непроменящи се колекции (immutable collections), като например списъци (lists) и карти (maps). Всяка промяна направена върху такъв обект (immutable) дава като резултат нов обект без да променя оригиналния такъв.

Например следното, вместо да го направите така:

```js
const obj = { a: 1 }
obj.a = 2 // Mutates `obj`
```

Бихте го направили така:

```js
const obj = Immutable.Map({ a: 1 })
obj.set('a', 2) // Returns a new object without mutating `obj`
```

Този подход се осланя на парадигмата от **функционалното програмиране**, което се получава доста добре с Redux.

Когато създавате immutable колекции можете да използвате един много удобен метод, а именно `Immutable.fromJS()`, който метод взима като входен артумент всеки стандартен JS обект или масив и връща "непроменяща" се негова версия (deeply immutable version):

```js
const immutablePerson = Immutable.fromJS({
  name: 'Stan',
  friends: ['Kyle', 'Cartman', 'Kenny']
})

console.log(immutablePerson)

/*
 *  Map {
 *    "name": "Stan",
 *    "friends": List [ "Kyle", "Cartman", "Kenny" ]
 *  }
 */
```

- Изпълнете `yarn add immutable@4.0.0-rc.2`

## Redux

> 💡 **[Redux](http://redux.js.org/)** е библиотека за работа с процесите по време на живота на вашето приложение. Създава обект наречен *store*, чиято идея е да бъде основният източник на информация за състоянието на вашето приложение във всеки един момент (single source of truth of the state of your app).

Нека да започнем с лесната част, декларирането на нашите Redux actions:

- Изпълнете `yarn add redux redux-actions`

- Създайте `src/client/action/hello.js` файл, съдържащ следното:

```js
// @flow

import { createAction } from 'redux-actions'

export const SAY_HELLO = 'SAY_HELLO'

export const sayHello = createAction(SAY_HELLO)
```

Този файл ни позволява да използваме "действие" (*action*), `SAY_HELLO`, и неговия създадел (*action creator*), `sayHello`, което е функция. Използваме [`redux-actions`](https://github.com/acdlite/redux-actions), за да редуцираме т.нар. boilerplate код (нещо което се трябва да се направи първо, за да може да се използва друго нещо), който е свързан с използването на Redux actions. `redux-actions` имплементира [Flux Standard Action](https://github.com/acdlite/flux-standard-action) модела, който позволява на *action creators* или функциите за създаване на действия (actions) да връщат като резултат обекти с атрибути `type` и `payload`.

- Създайте `src/client/reducer/hello.js` файл, който съдържа следното:

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

В този файл инициализираме състоянието на нашия reducer с Immutable Map обект, съдържащ едно свойство, `message`, чиято стойност е `Initial reducer message`. `helloReducer` обработва `SAY_HELLO` действията като просто прилага на `message` нова стойност, идваща от свойството payload на обекта action. Flow анотацията за `action` го деструктурира до `type` и `payload`. `payload` може да бъде от всякакъв (`any`) тип type. Изглежда странно ако не сте виждали такова нещо преди, но все пак остава разбираемо. За типа на `state` използваме `import type` Flow инструкцията, за да го вземем типа, който се връща от `fromJS`. Преименуваме го на `Immut` за по-голяма яснота, тъй като `state: fromJS` би било доста объркващо. `import type` реда ще беда премахнат както и всички останали Flow анотации. Обърнете внимание на начина, по който се използват `Immutable.fromJS()` и `set()`, както беше показано по-горе.

## React-Redux

> 💡 **[react-redux](https://github.com/reactjs/react-redux)** *свързва* Redux "склада" (store) с React компонентите. Чрез `react-redux` си гарантираме, че когато се промени Redux store обекта, React компонентите ще се обновят автоматично, отразявайки тази промяна. Също така те могат да предизвикват Redux действия (actions).

- Изпълнете `yarn add react-redux`

В тази секция ще създадем компоненти (*Components*) и контейнери (*Containers*).

**Компонентите** са *глупави* React компоненти, в смисъл такъв, че те не знаят нищо за състоянието на Redux (Redux state). **Контейнерите** са *умни* компоненти, които знаят за състоянието и които ще *свържем* с нашите "глупави" компоненти.

- Създайте `src/client/component/button.jsx` файл, съдържащ:

```js
// @flow

import React from 'react'

type Props = {
  label: string,
  handleClick: Function
}

const Button = ({ label, handleClick }: Props) =>
  <button onClick={handleClick}>{label}</button>

export default Button
```

**Забележка**: Тук можете да видите пример за Flow *type alias*. Дефинираме `Props` типа преди да анотираме деструктурираните свойства (`props`) на нашия компонент с него.

- Създайте `src/client/component/message.jsx` файл, който съдържа следното:

```js
// @flow

import React from 'react'

type Props = {
  message: string
}

const Message = ({ message }: Props) =>
  <p>{message}</p>

export default Message
```

Това са примери за "глупави" (*dumb*) компоненти. В тях няма логика и просто показват това, за което са направени да показват чрез React **props**. Основната разлика между `button.jsx` и `message.jsx` е това, че `Button` съдържа референция към изпращач на действия (action dispatcher) в своите свойства, докато `Message` просто съдържа информация, която ще показва.

Отново споменаваме, че компонентите (*components*) не знаят нищо за Redux действията (**actions**) или за състоянието (**state**) на нашето приложение, което е причината, поради която ще създадем и "умни" контейнери (**containers**), които ще предоставят необходимите изпращачи на действия (action dispatchers) и информация на двата "глупави" компонента.

- Създайте `src/client/container/hello-button.js` файл, съдържащ:

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

Този бутон свързва комтонента `Button` с `sayHello` действието и метода `dispatch` на Redux.

- Създайте `src/client/container/message.js` файл, съдържащ:

```js
// @flow

import { connect } from 'react-redux'

import Message from '../component/message'

const mapStateToProps = state => ({
  message: state.hello.get('message'),
})

export default connect(mapStateToProps)(Message)
```

Този контейнер свързва състоянието (state) на приложението на Redux с `Message` компонента. Когато се промени състоянието, `Message` ще се обнови автоматично с новата стойност идваща от `message` свойството (prop). Тези връзки са осъществени чрез използването на `connect` функцията от `react-redux`.

- Обновете `src/client/app.jsx` файла, както следва:

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

Все още не сме инициализирали Redux store обекта и не сме добавили в приложението нашите два контенейра:

- Редактирайте `src/client/index.jsx`, както следва:

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

Нека да отделим малко време и да разгледаме това по-подробно. Като начало, създаваме *store*, използвайки `createStore`. Store обектите се създават, чрез подаване на reducers обекти към тях. В нашия пример имаме само един reducer обект, но за да покажем как това би се направило в едно бъдещо приложение с много redurer обекти, използваме `combineReducers`, за да групираме всички reducer обекти заедно. Последния странен параметър, който се използва от `createStore` е нещо, което използваме, за да свържем Redux с интрументите за дебъгване на нашия браузър - [Devtools](https://github.com/zalmoxisus/redux-devtools-extension), тези инструменти са много полезни когато дебъгваме приложенията си. За да може ESLint да не се оплаква от използването на подчерти в`__REDUX_DEVTOOLS_EXTENSION__`, забраняваме това ESLint правило. След това поставяме цялото приложение в `Provider` компонента на `react-redux`, брагодарение на нашата `wrapApp` функция, и подаваме store обекта като входен параметър.

🏁 Сега вече можете да изпълните `yarn start` и `yarn dev:wds` и да отворите `http://localhost:8000`. Би трябвало да видите "Initial reducer message" и един бутон. Когато натиснете бутона съобщението трябва да се промени на "Hello!". Ако сте инсталирали Redux Devtools във вашия браузър, би трябвало да виждате как се променя състоянието (state) на приложението всеки път когато се натисне бутона.

Поздравления, най-накрая направихме приложение, което прави нещо наистина! Добре де, не е *super* впечатляващо погледнато отвън, но поне всички знаем, че е разработено чрез използването на "супер-дуперския" пакет от инструменти описвани в това ръководство :).

## Разширяване на нашето приложение чрез използване на асинхронни извиквания (Extending our app with an asynchronous call)

Тук ще добавим втори бутон в нашето приложение, който ще стартира AJAX извикване (call), за да изтегли ново съобщение от сървъра. За по-добра демонстрация, това извикване (call) и ще изпрати информация към сървъра - статично число `1234`.

### The server endpoint

- Създайте `src/shared/routes.js` файл, който да съдържа следното:

```js
// @flow

// eslint-disable-next-line import/prefer-default-export
export const helloEndpointRoute = (num: ?number) => `/ajax/hello/${num || ':num'}`
```

Тази функция ще ни помага да създаваме следното:

```js
helloEndpointRoute()     // -> '/ajax/hello/:num' (for Express)
helloEndpointRoute(1234) // -> '/ajax/hello/1234' (for the actual call)
```

Всъщност, нека набързо да създадем тест за това, за да сме сигурни, че работи както трябва.

- Create a `src/shared/routes.test.js` containing:

```js
import { helloEndpointRoute } from './routes'

test('helloEndpointRoute', () => {
  expect(helloEndpointRoute()).toBe('/ajax/hello/:num')
  expect(helloEndpointRoute(123)).toBe('/ajax/hello/123')
})
```

- Изпълнете `yarn test`, би трябвало да се изпълни успешно.

- В `src/server/index.js` файла добавете следното:

```js
import { helloEndpointRoute } from '../shared/routes'

// [under app.get('/')...]

app.get(helloEndpointRoute(), (req, res) => {
  res.json({ serverMessage: `Hello from the server! (received ${req.params.num})` })
})
```

### Нови контейнери

- Създайте `src/client/container/hello-async-button.js` файл, съдържащ следното:

```js
// @flow

import { connect } from 'react-redux'

import { sayHelloAsync } from '../action/hello'
import Button from '../component/button'

const mapStateToProps = () => ({
  label: 'Say hello asynchronously and send 1234',
})

const mapDispatchToProps = dispatch => ({
  handleClick: () => { dispatch(sayHelloAsync(1234)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Button)
```

За да демонстрираме как бихте изпратили параметър към асинхронната функция и да се придържаме към простички примери, отново използвам статична стойност `1234`. Обикновено стойности като тази бихме взимали от поле във форма попълвана от потребителя.

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
