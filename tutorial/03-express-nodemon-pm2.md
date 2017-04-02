# 03 - Express, Nodemon, and PM2

Кода за тази глава можете да намерите [тук](https://github.com/verekia/js-stack-walkthrough/tree/master/03-express-nodemon-pm2).

В тази секция ще създадем сървърът, който ще отговаря за показването на нашето уеб приложение. Също така ще настроим сървъра, така че да поддържа режими на разработка (development mode) и на производство (production mode).

## Express

> 💡 **[Express](http://expressjs.com/)** е може би най-известният фреймуърк за уеб приложения за Node. Предоставя много опростен и изчистен интерфейс за програмиране (API), и неговите свойства могат да бъдат надградени с *middleware*.

Сега ще настроим минимален Express сървър за сервиране на една HTML страница с малко CSS код.

- Изтрийте всичко от папката `src`

Създайте следните файлове и директории:

- Създайте `public/css/style.css` файб, съдържащ:

```css
body {
  width: 960px;
  margin: auto;
  font-family: sans-serif;
}

h1 {
  color: limegreen;
}
```

- Създайте празна папка `src/client/`.

- Създайте празна папка `src/shared/`.

Това е папката къдато ще поставяме *isomorphic / universal* JavaScript код – файлове, които се използват и от клиентската част, и от сървърната. Чудесен пример за такъв споделен код са *routes*, както ще видите малко по-късно в това ръководство когато ще правим асинхронни извиквания. Тук имаме просто някои конфигурационни константи, служещи за пример.

- Създайте `src/shared/config.js` файл, съдържащ:

```js
// @flow

export const WEB_PORT = process.env.PORT || 8000
export const STATIC_PATH = '/static'
export const APP_NAME = 'Hello App'
```

Ако Node процеса използван за стартиране на вашето приложение има променлива `process.env.PORT` (такъв би бил случая ако използвате Heroku например), ще използва нея за порта. Ако няма такава, по подразбиране порта ще бъде `8000`.

- Създайте `src/shared/util.js` файл, съдържащ:

```js
// @flow

// eslint-disable-next-line import/prefer-default-export
export const isProd = process.env.NODE_ENV === 'production'
```

Това е една полезна опция, с която да тествате дали сте в продукционен режим (production mode) или не. Коментарът `// eslint-disable-next-line import/prefer-default-export` е сложен, тъй като в момента имаме само един наименован файл, който експортираме. Можете да го премахнете когато добавяте други експорти в този файл.

- Изпълнете `yarn add express compression`

`compression` е Express middleware за активиране на Gzip компресия на сървъра.

- Създайте `src/server/index.js` файл, съдържащ:

```js
// @flow

import compression from 'compression'
import express from 'express'

import { APP_NAME, STATIC_PATH, WEB_PORT } from '../shared/config'
import { isProd } from '../shared/util'
import renderApp from './render-app'

const app = express()

app.use(compression())
app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))

app.get('/', (req, res) => {
  res.send(renderApp(APP_NAME))
})

app.listen(WEB_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${WEB_PORT} ${isProd ? '(production)' : '(development)'}.`)
})
```

Нищо чрезвичайно тук, това е почти Express варианта на Hello World с няколко допълнения. Тук ще използваме 2 различни директории за статични файлове. `dist` за генерирани файлове и `public` за декларирани такива.

- Създайте `src/server/render-app.js` файл, съдържащ:

```js
// @flow

import { STATIC_PATH } from '../shared/config'

const renderApp = (title: string) =>
`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="${STATIC_PATH}/css/style.css">
  </head>
  <body>
    <h1>${title}</h1>
  </body>
</html>
`

export default renderApp
```

Може би знаете, че обикновено се използваха *темплейт енджини* в бек-енд часта? Сега това вече не е нужно, тъй като JavaScript поддържа темплейт стрингове. Тук създаваме функция, която взима `title`(заглавието) като параметър и го инжектира в `title` и `h1` таговете на страницата, връщайки завършен HTML стринг. Също така използваме константата `STATIC_PATH`, която служи за основен път към всички наши статични ресурси.

### Осветяване (highlighting) на HTML синтаксис за темплейт стрингове в Atom (незадължително)

В зависимост от вашия редактор, можете да имате осветяване на синтаксиса, което да е в сила за HTML код в темплейт стринговете. В Atom, ако поставите `html` таг преди темплейт стринг (или какъвто и да било таг *завършващ* с `html`, като например `ilovehtml`), съдържанието ще се освети. Понякога използвам `html` таг от `common-tags` библиотеката, за да се възползвам от тази опция:

```js
import { html } from `common-tags`

const template = html`
<div>Wow, colors!</div>
`
```

Нарочно не включих този трик в основата на това ръководство, тъй като изглежда, че работи само в Atom, а и не е идеално. Някои от вас потребителите на Atom могат да го намерят за полезно.

Както и да е, обратно на работа!

- В `package.json` променете вашия `start` скрипт както следва: `"start": "babel-node src/server",`

🏁 Изпълнете `yarn start` и отворете `localhost:8000` във вашия браузър. Ако всичко работи както се очаква би трябвало да видите празна страница с "Hello App" написано на заглавната лента и на самата страница, във вид на зелен текст.

**Забележка**: Някои процеси – обикновено процеси, които очакват нещо да се случи, като например сървърните процеси – няма да ви позволят да въвеждате команди във вашия терминал докато не приключат работата си. За да прекратите такива процеси и да можете да използвате терминала си отново натиснете **Ctrl+C**. Ако искате да можете да въвеждате команди докато тези процеси работят можете да отворите нов таб на терминалния прозорец и да пишете в него. Също така има възможност тези процеси да бъдат стартирани и да работят в бекграунда, но това не е в скоупа на това ръководство.

## Nodemon

> 💡 **[Nodemon](https://nodemon.io/)** е инструмент, чрез който вашия Node сървър да се рестартира автоматично когато настъпят промени в даден файл в директорията.

Ще използваме Nodemon докато сме в режим на **разработка** (**development** mode).

- Изпълнете `yarn add --dev nodemon`

- Променете вашият `scripts` обект, както следва:

```json
"start": "yarn dev:start",
"dev:start": "nodemon --ignore lib --exec babel-node src/server",
```

Сега `start` е просто указател към друга задача, `dev:start`. Това ни дава слой на абстракция когато настройваме какво прави основната ни задача.

In `dev:start`, the `--ignore lib` flag is to *not* restart the server when changes happen in the `lib` directory. You don't have this directory yet, but we're going to generate it in the next section of this chapter, so it will soon make sense. Nodemon typically runs the `node` binary. In our case, since we're using Babel, we can tell Nodemon to use the `babel-node` binary instead. This way it will understand all the ES6/Flow code.

🏁 Run `yarn start` and open `localhost:8000`. Go ahead and change the `APP_NAME` constant in `src/shared/config.js`, which should trigger a restart of your server in the terminal. Refresh the page to see the updated title. Note that this automatic restart of the server is different from *Hot Module Replacement*, which is when components on the page update in real-time. Here we still need a manual refresh, but at least we don't need to kill the process and restart it manually to see changes. Hot Module Replacement will be introduced in the next chapter.

## PM2

> 💡 **[PM2](http://pm2.keymetrics.io/)** is a Process Manager for Node. It keeps your processes alive in production, and offers tons of features to manage them and monitor them.

We are going to use PM2 whenever we are in **production** mode.

- Run `yarn add --dev pm2`

In production, you want your server to be as performant as possible. `babel-node` triggers the whole Babel transpilation process for your files at each execution, which is not something you want in production. We need Babel to do all this work beforehand, and have our server serve plain old pre-compiled ES5 files.

One of the main features of Babel is to take a folder of ES6 code (usually named `src`) and transpile it into a folder of ES5 code (usually named `lib`).

This `lib` folder being auto-generated, it's a good practice to clean it up before a new build, since it may contain unwanted old files. A neat simple package to delete files with cross platform support is `rimraf`.

- Run `yarn add --dev rimraf`

Let's add the following `prod:build` task to our `scripts`:

```json
"prod:build": "rimraf lib && babel src -d lib --ignore .test.js",
```

- Run `yarn prod:build`, and it should generate a `lib` folder containing the transpiled code, except for files ending in `.test.js` (note that `.test.jsx` files are also ignored by this parameter).

- Add `/lib/` to your `.gitignore`

One last thing: We are going to pass a `NODE_ENV` environment variable to our PM2 binary. With Unix, you would do this by running `NODE_ENV=production pm2`, but Windows uses a different syntax. We're going to use a small package called `cross-env` to make this syntax work on Windows as well.

- Run `yarn add --dev cross-env`

Let's update our `package.json` like so:

```json
"scripts": {
  "start": "yarn dev:start",
  "dev:start": "nodemon --ignore lib --exec babel-node src/server",
  "prod:build": "rimraf lib && babel src -d lib --ignore .test.js",
  "prod:start": "cross-env NODE_ENV=production pm2 start lib/server && pm2 logs",
  "prod:stop": "pm2 delete server",
  "test": "eslint src && flow && jest --coverage",
  "precommit": "yarn test",
  "prepush": "yarn test"
},
```

🏁 Run `yarn prod:build`, then run `yarn prod:start`. PM2 should show an active process. Go to `http://localhost:8000/` in your browser and you should see your app. Your terminal should show the logs, which should be "Server running on port 8000 (production).". Note that with PM2, your processes are run in the background. If you press Ctrl+C, it will kill the `pm2 logs` command, which was the last command our our `prod:start` chain, but the server should still render the page. If you want to stop the server, run `yarn prod:stop`

Now that we have a `prod:build` task, it would be neat to make sure it works fine before pushing code to the repository. Since it is probably unnecessary to run it for every commit, I suggest adding it to the `prepush` task:

```json
"prepush": "yarn test && yarn prod:build"
```

🏁 Run `yarn prepush` or just push your files to trigger the process.

**Note**: We don't have any test here, so Jest will complain a bit. Ignore it for now.

Next section: [04 - Webpack, React, HMR](04-webpack-react-hmr.md#readme)

Back to the [previous section](02-babel-es6-eslint-flow-jest-husky.md#readme) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
