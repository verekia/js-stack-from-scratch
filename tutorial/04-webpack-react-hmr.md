# 04 - Webpack, React, and Hot Module Replacement

Кода за тази глава можете да намерите [тук](https://github.com/verekia/js-stack-walkthrough/tree/master/04-webpack-react-hmr).

## Webpack

> 💡 **[Webpack](https://webpack.js.org/)** е *module bundler* - нещо като пакетен мениджър или програма, с която сравнително лесно се настройват и използват код модули/пакети. Като входни настройки приема файловете на различни пакет (т.е. файлове с код), обработва ги и ги събира в един, обикновено JavaScript, файл, наречен "пакет" (bundle), който файл е единствения, който се използва и изпълнява от вашия клиент (напр. браузъра ви).

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

Добрееем, сега ще трябва "пакетираме" това ES6 приложение в ES5 пакет.

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

`babel-loader` е плъгин за Webpack, който транспелира кода по същия начин, по който го правите от началото на това ръководство. Единствената разлика този път е, че кода се изпълнява в браузъра ви, а не на сървъра.

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

🏁 Изпълнете `yarn start` в терминала. Отворете още един прозорец на терминала и изпълнете `yarn dev:wds` в него. Когато Webpack Dev Server приключи с генерирането на пакетите (които би трябвало да са файлове с размер приблизително ~600kB) и двата процеса са готови за работа, отворете `http://localhost:8000/` в браузъра и би трябвало да видите "Hello Webpack!". Отворете конзолата на вашия Chrome и вижте кои файлове са включени в Source таба. Би трябвало да виждате само `static/css/style.css` под `localhost:8000/`, а всички ES6 файломе да са под `webpack://./src`. Това означава, че sourcemaps работят правилно. Във вашия редактор, в `src/client/index.js`, променете `Hello Webpack!` като напишете нещо друго. В момента, в който запазите вашите промени, Webpack Dev Server би трябвало да генерира нов пакет терминала и Chrome таба трябва да опресни съдържанието си автоматично.

- Kill the previous processes in your terminals with Ctrl+C, then run `yarn prod:build`, and then `yarn prod:start`. Open `http://localhost:8000/` and you should still see "Hello Webpack!". In the Source tab of the Chrome console, you should this time find `static/js/bundle.js` under `localhost:8000/`, but no `webpack://` sources. Click on `bundle.js` to make sure it is minified. Run `yarn prod:stop`.

Good job, I know this was quite dense. You deserve a break! The next section is easier.

**Note**: I would recommend to have at least 3 terminals open, one for your Express server, one for the Webpack Dev Server, and one for Git, tests, and general commands like installing packages with `yarn`. Ideally, you should split your terminal screen in multiple panes to see them all.

## React

> 💡 **[React](https://facebook.github.io/react/)** is a library for building user interfaces by Facebook. It uses the **[JSX](https://facebook.github.io/react/docs/jsx-in-depth.html)** syntax to represent HTML elements and components while leveraging the power of JavaScript.

In this section we are going to render some text using React and JSX.

First, let's install React and ReactDOM:

- Run `yarn add react react-dom`

Rename your `src/client/index.js` file into `src/client/index.jsx` and write some React code in it:

```js
// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'
import { APP_CONTAINER_SELECTOR } from '../shared/config'

ReactDOM.render(<App />, document.querySelector(APP_CONTAINER_SELECTOR))
```

- Create a `src/client/app.jsx` file containing:

```js
// @flow

import React from 'react'

const App = () => <h1>Hello React!</h1>

export default App
```

Since we use the JSX syntax here, we have to tell Babel that it needs to transform it with the `babel-preset-react` preset. And while we're at it, we're also going to add a Babel plugin called `flow-react-proptypes` which automatically generates PropTypes from Flow annotations for your React components.

- Run `yarn add --dev babel-preset-react babel-plugin-flow-react-proptypes` and edit your `.babelrc` file like so:

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

🏁 Run `yarn start` and `yarn dev:wds` and hit `http://localhost:8000`. You should see "Hello React!".

Now try changing the text in `src/client/app.jsx` to something else. Webpack Dev Server should reload the page automatically, which is pretty neat, but we are going to make it even better.

## Hot Module Replacement

> 💡 **[Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)** (*HMR*) is a powerful Webpack feature to replace a module on the fly without reloading the entire page.

To make HMR work with React, we are going to need to tweak a few things.

- Run `yarn add react-hot-loader@next`

- Edit your `webpack.config.babel.js` like so:

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

- Edit your `src/client/index.jsx` file:

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

We need to make our `App` a child of `react-hot-loader`'s `AppContainer`, and we need to `require` the next version of our `App` when hot-reloading. To make this  process clean and DRY, we create a little `wrapApp` function that we use in both places it needs to render `App`. Feel free to move the `eslint-disable global-require` to the top of the file to make this more readable.

🏁 Restart your `yarn dev:wds` process if it was still running. Open `localhost:8000`. In the Console tab, you should see some logs about HMR. Go ahead and change something in `src/client/app.jsx` and your changes should be reflected in your browser after a few seconds, without any full-page reload!

Next section: [05 - Redux, Immutable, Fetch](05-redux-immutable-fetch.md#readme)

Back to the [previous section](03-express-nodemon-pm2.md#readme) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
