# 03 - Express, Nodemon, and PM2

Code for this chapter available [here](https://github.com/verekia/js-stack-walkthrough/tree/master/03-express-nodemon-pm2).

In this section we are going to create the server that will render our web app. We will also set up a development mode and a production mode for this server.

## Express

> 💡 **[Express](http://expressjs.com/)** is by far the most popular web application framework for Node. It provides a very simple and minimal API, and its features can be extended with *middleware*.

Let's set up a minimal Express server to serve an HTML page with some CSS.

- Delete everything inside `src`

Create the following files and folders:

- Create a `public/css/style.css` file containing:

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

- Create an empty `src/client/` folder.

- Create an empty `src/shared/` folder.

This folder is where we put *isomorphic / universal* JavaScript code – files that are used by both the client and the server. A great use case of shared code is *routes*, as you will see later in this tutorial when we'll make an asynchronous call. Here we simply have some configuration constants as an example for now.

- Create a `src/shared/config.js` file, containing:

```js
// @flow

export const WEB_PORT = process.env.PORT || 8000
export const STATIC_PATH = '/static'
export const APP_NAME = 'Hello App'
```

If the Node process used to run your app has a `process.env.PORT` environment variable set (that's the case when you deploy to Heroku for instance), it will use this for the port. If there is none, we default to `8000`.

- Create a `src/shared/util.js` file containing:

```js
// @flow

// eslint-disable-next-line import/prefer-default-export
export const isProd = process.env.NODE_ENV === 'production'
```

That's a simple util to test if we are running in production mode or not. The `// eslint-disable-next-line import/prefer-default-export` comment is because we only have one named export here. You can remove it as you add other exports in this file.

- Run `yarn add express compression`

`compression` is an Express middleware to activate Gzip compression on the server.

- Create a `src/server/index.js` file containing:

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

Nothing fancy here, it's almost Express' Hello World tutorial with a few additional imports. We're using 2 different static file directories here. `dist` for generated files, `public` for declarative ones.

- Create a `src/server/render-app.js` file containing:

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

You know how you typically have *templating engines* on the back-end? Well these are pretty much obsolete now that JavaScript supports template strings. Here we create a function that takes a `title` as a parameter and injects it in both the `title` and `h1` tags of the page, returning the complete HTML string. We also use a `STATIC_PATH` constant as the base path for all our static assets.

### HTML template strings syntax highlighting in Atom (optional)

It might be possible to get syntax highlighting working for HTML code inside template strings depending on your editor. In Atom, if you prefix your template string with an `html` tag (or any tag that *ends* with `html`, like `ilovehtml`), it will automatically highlight the content of that string. I sometimes use the `html` tag of the `common-tags` library to take advantage of this:

```js
import { html } from `common-tags`

const template = html`
<div>Wow, colors!</div>
`
```

I did not include this trick in the boilerplate of this tutorial, since it seems to only work in Atom, and it's less than ideal. Some of you Atom users might find it useful though.

Anyway, back to business!

- In `package.json` change your `start` script like so: `"start": "babel-node src/server",`

🏁 Run `yarn start`, and hit `localhost:8000` in your browser. If everything works as expected you should see a blank page with "Hello App" written both on the tab title and as a green heading on the page.

**Note**: Some processes – typically processes that wait for things to happen, like a server for instance – will prevent you from entering commands in your terminal until they're done. To interrupt such processes and get your prompt back, press **Ctrl+C**. You can alternatively open a new terminal tab if you want to keep them running while being able to enter commands. You can also make these processes run in the background but that's out of the scope of this tutorial.

## Nodemon

> 💡 **[Nodemon](https://nodemon.io/)** is a utility to automatically restart your Node server when file changes happen in the directory.

We are going to use Nodemon whenever we are in **development** mode.

- Run `yarn add --dev nodemon`

- Change your `scripts` like so:

```json
"start": "yarn dev:start",
"dev:start": "nodemon --ignore lib --exec babel-node src/server",
```

`start` is now just a pointer to an other task, `dev:start`. That gives us a layer of abstraction to tweak what the default task is.

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
