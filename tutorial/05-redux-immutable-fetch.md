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

- Създайте `src/shared/routes.test.js` файл, съдържащ:

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

- Създайте `src/client/container/message-async.js` файл, съдържащ:

```js
// @flow

import { connect } from 'react-redux'

import MessageAsync from '../component/message'

const mapStateToProps = state => ({
  message: state.hello.get('messageAsync'),
})

export default connect(mapStateToProps)(MessageAsync)
```

Както ще видите тук, използваме `messageAsync` свойството, което скоро ще добавим в нашия reducer обект.

Сега трябва да създадем действието `sayHelloAsync`.

### Fetch

> 💡 **[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)** е стандартизирана JavaScript функция, за изпълняване на асинхронни извиквания (asynchronous call), инспирирана от AJAX методите на jQuery.

Ще използваме `fetch`, за да правим извиквания (calls) от клиента към сървъра. Тъй като `fetch` не се поддържа от всички браузъри, ще използваме полифил (polyfill). `isomorphic-fetch` е такъв полифил, който работи еднакво добре както в различните браузъри, така и в Node среда!

- Изпълнете `yarn add isomorphic-fetch`

Заради използването на `eslint-plugin-compat` ще трябва да укажем изрично, че използваме полифил за `fetch`, за да не получаваме предупредителни съобщения от това, че го използваме.

- Добавете следното във вашия `.eslintrc.json` файл:

```json
"settings": {
  "polyfills": ["fetch"]
},
```

### 3 асинхронни действия (3 asynchronous actions)

`sayHelloAsync` няма да бъде обикновено действие (action). Асинхронните действия (actions) обикновено се делят на 3 фази, които инициират три различни състояния (states): "заявка" (*request*) действие или "зареждане ("loading"), *успех* действие (action) и "провал" (*failure*) действие.

- Редактирайте `src/client/action/hello.js` файла, както следва:

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

Вместо да върне действие (action), `sayHelloAsync` връща функция, която изпълнява `fetch` извикване (call). `fetch` връща `Promise` (име на тиб данни наречени "обещания" или Promises), което използваме, за да изпратим (*dispatch*) или реагираме с различки действия, в сависимост от текущата сигуацие на нашите асинхронни извиквания.

### 3 "обработвачи" на асинхронни действия (3 asynchronous action handlers)

Нека обработим различните действия в `src/client/reducer/hello.js`:

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

Добавяме ново поле в нашия store обект, `messageAsync`, и ще го обновяваме с различни съобщения в зависимост от действието (action), което получим. По време на `SAY_HELLO_ASYNC_REQUEST` показваме `Loading...`. `SAY_HELLO_ASYNC_SUCCESS` обновява `messageAsync` подобно на начина, по който `SAY_HELLO` обновява `message`. `SAY_HELLO_ASYNC_FAILURE` връща съобщение за грешка.

### Redux-thunk

В `src/client/action/hello.js` създадохме `sayHelloAsync`, което е нещо, което създава действие ("action creator"), което връща функция. Това не е нещо, което се поддържа от Redux по подразбиране. За да можем да изпълняваме подобен род действия ще трябва да разширим функционалността на Redux с `redux-thunk` *middleware*.

- Изпълнете `yarn add redux-thunk`

- Обновете `src/client/index.jsx` файла, както следва:

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

Тук подаваме `redux-thunk` на `applyMiddleware` функцията на React. За да може Redux Devtools да продължат да работят, също така трябва да използваме `compose` функцията на React. Не се притеснявайте прекалено много за тази част, просто запомнете, че разширяваме Redux с `redux-thunk`.

- Обновете `src/client/app.jsx`, както следва:

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

🏁 Изпълнете `yarn start` и `yarn dev:wds`, и сега би трябвало да можете да натиснете бутона "Say hello asynchronously and send 1234" и да получите съответното съобщение от сървъра! Тъя като работим на локалните си машини, извикването и резултата се получават моментално. Но ако отворите Redux Devtools ще забележите, че всяко натискане на бутона е причина за нови `SAY_HELLO_ASYNC_REQUEST` и `SAY_HELLO_ASYNC_SUCCESS` събития, карайки съобщенията да минават през междинната фаза `Loading...` на състояниего, както се очаква.

Можете да се поздравите, това беше една доста трудна и изморителна глава! Нека да обобщим резултатите с малко тестване.

## Тестване / Testing

В тази секция ще тестваме нашите дествия (actions) и reducer обект. Нека да започнем с действията.

За да можем да изолираме логиката, която е специфична за `action/hello.js` ще имаме нужда от *mock* неща, които нямат връзка с него и също така могат да симулират AJAX `fetch` извикване, което не би трябвало да инициира истинско AJAX извикване.

- Изпълнете `yarn add --dev redux-mock-store fetch-mock`

- Създайте `src/client/action/hello.test.js` файл, съдържащ:

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

Добре, нека да видим какво се случва тук. Като за начало "мокваме" (изкуствено създаваме източник на информация, която се използва при създаването на тестове) Redux store обекта, използвайки `const mockStore = configureMockStore([thunkMiddleware])`. Това ще ни позволи да можем изпращаме действия (actions), без те да стартиртат каквато и да била reducer логика. За всеки тест, използваме спациални програми за управление на входната информация, като например "мокването" на `fetch`, използвайки `fetchMock.get()` и правейки го да върне като резултат каквото ние поискаме. Това, което всъщност тестваме, използвайки `expect()`, е кои серии от дествия са били изпратени от store обекта благодарение на `store.getActions()` функцията от `redux-mock-store`. След всеки тест възтановяваме нормалното състояние на `fetch` с `fetchMock.restore()`.

Хайде сега да изтестваме reducer обектите, което е доста по-лесна.

- Създайте` `src/client/reducer/hello.test.js` файл, съдържащ:

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

Преди всеки тест инициализираме `helloState` с резултата, който се връща от reducer обекта ни по подразбиране (`default` стойността от `switch` операцията в reducer обекта, който връща `initialState`). Иначе самите тестове са сравнително ясни - просто проверяваме дали reducer-а обновява `message` и `messageAsync` правилно, в зависимост от това кое действие (action) е получено.

🏁 Изпълнете `yarn test`. Всичко би трябвало да е зелено.

Следваща глава: [06 - React Router, Server-Side Rendering, Helmet](06-react-router-ssr-helmet.md#readme)

Назад към [предишната глава](04-webpack-react-hmr.md#readme) или към [съдържанието](https://github.com/verekia/js-stack-from-scratch#table-of-contents).