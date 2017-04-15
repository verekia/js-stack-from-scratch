# 04 - Webpack, React и Hot Module Replacement

Кода за тази глава можете да намерите [тук](https://github.com/verekia/js-stack-walkthrough/tree/master/04-webpack-react-hmr).

## Webpack

> 💡 **[Webpack](https://webpack.js.org/)** е *module bundler* - нещо като пакетен мениджър или програма, с която сравнително лесно се настройват и използват код модули/пакети. Като входни настройки приема файловете на различни пакети (т.е. файлове с код), обработва ги и ги събира в един, обикновено JavaScript файл, наречен "пакет" (bundle), който файл е единственият, който се използва и изпълнява от вашия клиент (напр. браузъра ви).

Нека да създадем простичката програмка *hello world* и да я "пакетираме" с Webpack.

- В `src/shared/config.js`, добавете следните константи:

```js
export const WDS_PORT = 7000

export const APP_CONTAINER_CLASS = 'js-app'
export const APP_CONTAINER_SELECTOR = `.${APP_CONTAINER_CLASS}`
```

- Създайте `src/client/index.js` файл, съдържащ:

```js
import 'babel-polyfill'

import { APP_CONTAINER_SELECTOR } from '../shared/config'

document.querySelector(APP_CONTAINER_SELECTOR).innerHTML = '<h1>Hello Webpack!</h1>'
```

Ако искате да използвате едно от най-новите неща, добавени в ES, а именно `Promises`, ще трябва да включите [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/) преди всичко друго във вашия пакет.

- Изпълнете `yarn add babel-polyfill`

Ако изпълните ESLint върху този файл, ще получите грешка за това, че `document` не е дефиниран (undefined).

- Добавете следното към `env` във вашия `.eslintrc.json`, за да може да използвате `window` и `document`:

```json
"env": {
  "browser": true,
  "jest": true
}
```

Добрееем, сега ще трябва да "пакетираме" това ES6 приложение в ES5 пакет.

- Създайте `webpack.config.babel.js` файл, съдържащ:

```js
// @flow

import path from 'path'

import { WDS_PORT } from './src/shared/config'
import { isProd } from './src/shared/util'

export default {
  entry: [
    './src/client'
  ],
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProd ? '/static/' : `http://localhost:${WDS_PORT}/dist/`
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  devtool: isProd ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    port: WDS_PORT
  },
}
```

Този файл съдържа описанието на това как реално ще работи нашият пакет: `entry` е началната/входната точка на нашето приложение, `output.filename` е името на изходния файл, който ще се генерира, `output.path` и `output.publicPath` указват изходната папка и URL. Ще поставим нашия пакет в `dist` папката, която ще съдържа автоматично генерираните неща (с изключение на CSS кода, който е в `public`). `module.rules` е мястото където указвате на Webpack да приложи някои неща на някои типове файлове. Тук ние указваме, че искаме всички `.js` и `.jsx` (за React) файлове, с изключение на тези в `node_modules` да минат през нещо, наречено `babel-loader`. Също така искаме тези две разширения да бъдат използвани да `resolve`-нат модулите когато ги импортваме (`import`). И накрая, декларираме порта за Webpack Dev Server.

**Забележка**: `.babel.js` разширението е свойство на Webpack, с което прилагаме Babel трансформациите към този конфигурационен файл.

`babel-loader` е плъгин за Webpack, който "превежда" кода по същия начин, по който го правите от началото на това ръководство. Единствената разлика този път е, че кода се изпълнява в браузъра ви, а не на сървъра.

- Изпълнете `yarn add --dev webpack webpack-dev-server babel-core babel-loader`

`babel-core` е peer-dependency (`babel-loader` зависи от него, за да работи) на `babel-loader`, така че инсталираме и него.

- Добавете `/dist/` във вашия `.gitignore`

### Tasks update - обновления на задачите

В режим на разработване (development mode) ще използваме `webpack-dev-server`, за да можем да се възползваме от Hot Module Reloading (обяснен малко по-нататък в тази глава), а в производствена среда (production mode) ще използваме просто `webpack`, за да генерираме пакетите. И в двата случая флагът `--progress` е полезен, тъй като ни показва допълнителна инфромация когато Webpack компилира вашите файлове. Също така ще използваме и флага `-p`, за да укажем на `webpack` да минифицира изходния код  когато го пускаме "лайф", както и променливата `NODE_ENV` приема стойност `production`.

Хайде сега да обновим нашия `scripts` обект и да имплементираме всичко, което научихме досега. Ще подобрим и някои от съществуващите вече задачи:

```json
"scripts": {
  "start": "yarn dev:start",
  "dev:start": "nodemon -e js,jsx --ignore lib --ignore dist --exec babel-node src/server",
  "dev:wds": "webpack-dev-server --progress",
  "prod:build": "rimraf lib dist && babel src -d lib --ignore .test.js && cross-env NODE_ENV=production webpack -p --progress",
  "prod:start": "cross-env NODE_ENV=production pm2 start lib/server && pm2 logs",
  "prod:stop": "pm2 delete server",
  "lint": "eslint src webpack.config.babel.js --ext .js,.jsx",
  "test": "yarn lint && flow && jest --coverage",
  "precommit": "yarn test",
  "prepush": "yarn test && yarn prod:build"
},
```

В `dev:start` декларираме изрично кои файлови разширения да бъдат следени, както и че папката `dist` да се игнорира.

Създадохме отделна `lint` задача и добавихме `webpack.config.babel.js` към файловете, които ще се обработват от линтера.

- Следващата стъпка е да създадем контейнер за приложението ни в `src/server/render-app.js` и да включим пакета, който ще бъде генериран:

```js
// @flow

import { APP_CONTAINER_CLASS, STATIC_PATH, WDS_PORT } from '../shared/config'
import { isProd } from '../shared/util'

const renderApp = (title: string) =>
`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="${STATIC_PATH}/css/style.css">
  </head>
  <body>
    <div class="${APP_CONTAINER_CLASS}"></div>
    <script src="${isProd ? STATIC_PATH : `http://localhost:${WDS_PORT}/dist`}/js/bundle.js"></script>
  </body>
</html>
`

export default renderApp
```

Избираме дали да включим Webpack Dev Server пакета или този за продукционната среда според зависимост от средата, в която сме. Обърнете внимание, че пътя до Webpack Dev Server пакета е *виртуален*, `dist/js/bundle.js` не съществува физически на твърдия ви диск когато сте в среда за разработка (development mode). Също така е необходимо да дадете на Webpack Dev Server различен от основния ви уеб порт.

- И накрая, в `src/server/index.js`, напишете вашите `console.log` съобщения по следния начин:

```js
console.log(`Server running on port ${WEB_PORT} ${isProd ? '(production)' :
  '(development).\nKeep "yarn dev:wds" running in an other terminal'}.`)
```

Tова ще помогне на други програмисти да разберат какво да правят ако просто са стартирали `yarn start` без Webpack Dev Server.

Окей, това бяха доста промени, нека да видим сега дали всичко работи както се очаква:

🏁 Изпълнете `yarn start` в терминала. Отворете още един прозорец на терминала и изпълнете `yarn dev:wds` в него. Когато Webpack Dev Server приключи с генерирането на пакетите (които би трябвало да са файлове с размер приблизително ~600kB) и двата процеса са готови за работа, отворете `http://localhost:8000/` в браузъра и би трябвало да видите "Hello Webpack!". Отворете конзолата на вашия Chrome и вижте кои файлове са включени в Source таба. Би трябвало да виждате само `static/css/style.css` под `localhost:8000/`, а всички ES6 файлове да са под `webpack://./src`. Това означава, че sourcemaps работят правилно. Във вашия редактор, в `src/client/index.js`, променете `Hello Webpack!` като напишете нещо друго. В момента, в който запазите вашите промени, Webpack Dev Server би трябвало да генерира нов пакет терминала и Chrome таба трябва да опресни съдържанието си автоматично.

- Прекратете стартираните процеси в отворените прозорци на терминала ви като използвате клавишната комбинация Ctrl+C, след това изпълнете `yarn prod:build` и `yarn prod:start`. Отворете `http://localhost:8000/`, все още би трябвало да виждате "Hello Webpack!". В Source таба на конзолата на Chrome този път би трябвало да видите `static/js/bundle.js` под `localhost:8000/` вместо `webpack://` генериран код (sources). Кликнете на `bundle.js`, за да проверите дали е минифициран. Изпълнете `yarn prod:stop`.

Добра работа! Заслужавате почивка! Следващата секция ще бъде по-лесна.

**Забележка**: Препоръчвам да имате поне 3 отворени терминала, един за вашия Express сървър, един за Webpack Dev Server и един за Git, тестове и общи команди, като например инсталиране на пакети с `yarn`. Идеална ситуация би била ако можете да резделите екрана с терминала си на няколко панела и да ги виждате всичките едновременно.

## React

> 💡 **[React](https://facebook.github.io/react/)** е библиотека за създаване на потребителски интерфейси, създадена от Фейсбук. Използва **[JSX](https://facebook.github.io/react/docs/jsx-in-depth.html)** синтаксис за работа с HTML елементи и компоненти докато в същото време изплозва силата на JavaScript.

В тази секция ще покажем малко текст използвайки React и JSX.

Първо нека инсталираме React и ReactDOM:

- Изпълнете `yarn add react react-dom`

Преименувайте вашия `src/client/index.js` файл на `src/client/index.jsx` и напишете следния React код в него:

```js
// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'
import { APP_CONTAINER_SELECTOR } from '../shared/config'

ReactDOM.render(<App />, document.querySelector(APP_CONTAINER_SELECTOR))
```

- Създайте `src/client/app.jsx` файл, съдържащ:

```js
// @flow

import React from 'react'

const App = () => <h1>Hello React!</h1>

export default App
```

Тъй като тук използваме JSX синтаксис, трябва да укажем на Babel, че трябва да го трансформира, използвайки `babel-preset-react` пакета. И докато все още сме на това, ще инсталираме още един Babel плъгин, наречен `flow-react-proptypes`, който автоматично генерира PropTypes от Flow анотации за вашите React компоненти.

- Изпълнете `yarn add --dev babel-preset-react babel-plugin-flow-react-proptypes` и редактирайте вашия `.babelrc` файл, както следва:

```json
{
  "presets": [
    "env",
    "flow",
    "react"
  ],
  "plugins": [
    "flow-react-proptypes"
  ]
}
```

🏁 Изпълнете `yarn start` и `yarn dev:wds` и отворете `http://localhost:8000`. Би трябвало да видите "Hello React!".

Сега променете текста в `src/client/app.jsx` на нещо друго. Webpack Dev Server би трябвало да опресни страницата автоматично, което е доста яко, но ние ще го направим още по-яко :).

## Hot Module Replacement

> 💡 **[Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)** (*HMR*) е мощно средство на Webpack, с което може да се замести един модул с друг по време на работа, без да се налага да се опреснява цялата страница.

За да може HMR да работи с React ще трябва да настроим няколко неща.

- Изпълнете `yarn add react-hot-loader@next`

- Редактирайте вашия `webpack.config.babel.js`, както следва:

```js
import webpack from 'webpack'
// [...]
entry: [
  'react-hot-loader/patch',
  './src/client',
],
// [...]
devServer: {
  port: WDS_PORT,
  hot: true,
},
plugins: [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
],
```

- Редактирайте вашия `src/client/index.jsx` файл:

```js
// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './app'
import { APP_CONTAINER_SELECTOR } from '../shared/config'

const rootEl = document.querySelector(APP_CONTAINER_SELECTOR)

const wrapApp = AppComponent =>
  <AppContainer>
    <AppComponent />
  </AppContainer>

ReactDOM.render(wrapApp(App), rootEl)

if (module.hot) {
  // flow-disable-next-line
  module.hot.accept('./app', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./app').default
    ReactDOM.render(wrapApp(NextApp), rootEl)
  })
}
```

Трябва да направим нашия `App` да е "дете" на `AppContainer`-а на `react-hot-loader` и да изискаме (`require`) следващата версия на `App` когато използваме моменталното презареждане (hot-reloading). За да направим този процес чист и DRY (don't repeat yourself), ще създаден една малка функция `wrapApp` function, която ще използваме на двете места където трябва да се интерпретира (render) `App`. Можете да преместите `eslint-disable global-require` в горната част на файла, за да го направите по-четим.

🏁 Рестартирайте вашия `yarn dev:wds` процес ако все още се изпълнява. Отворете `localhost:8000`. В Console таба би трябвало да виждате логове за HMR. Променете нещо в `src/client/app.jsx` и вашите промени би трябвало да се отразят в браузъра ви след няколко секунди, без да се опреснява цялата страница!

Следваща глава: [05 - Redux, Immutable, Fetch](05-redux-immutable-fetch.md#readme)

Назад към [предишната глава](03-express-nodemon-pm2.md#readme) или към [съдържанието](https://github.com/mihailgaberov/js-stack-from-scratch#Съдържание).
