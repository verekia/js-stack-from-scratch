# 03 - Express, PM2

In this section we are going to create the server that will render our web app. We will also set up a development mode and a production mode for this server.

## Express

> 💡 **[Express](http://expressjs.com/)** is by far the most popular web application framework for Node. It provides a very simple and minimal API, and its features can be extended with *middleware*.

Let's set up a minimal Express server to serve an HTML page with some CSS.

- Delete `src/index.js` and `src/dog.js`, we won't need those anymore.

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

- Create a `src/shared/config.js` file, containing:

```js
// @flow

export const WEB_PORT = process.env.PORT || 8000
export const STATIC_PATH = '/static'
export const APP_NAME = 'Hello App'
```

This `shared` folder is where we put *isomorphic / universal* JavaScript code – files that are accessible by both the client and the server. A great use case of shared code is *routes*, as you will see later in this tutorial when we'll make an asynchronous call. Here we simply have some configuration constants as an example for now.

- Run `yarn add express`.

- Create a `src/server/index.js` file containing:

```js
// @flow

/* eslint-disable no-console */

import express from 'express'

import { APP_NAME, STATIC_PATH, WEB_PORT } from '../shared/config'
import staticTemplate from './static-template'

const app = express()

app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))

app.get('/', (req, res) => {
  res.send(staticTemplate(APP_NAME))
})

app.listen(WEB_PORT, () => {
  console.log(`Express running on port ${WEB_PORT}.`)
})
```

Nothing fancy here, it's almost Express' Hello World tutorial with a few additional imports. We're using 2 different static file directories here. `dist` for generated files, `public` for declarative ones.

- Create a `src/server/static-template.js` file containing:

```js
// @flow

import { STATIC_PATH } from '../shared/config'

export default (title: string) => `
<!doctype html>
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

- In `package.json` change your `start` script like so: `"start": "babel-node src/server"`

🏁 Run `yarn start`, and hit `localhost:8000` in your browser. If everything works as expected you should see a blank page with "Hello App" written both on the tab title and as a green heading on the page.

**Note**: Some processes – typically processes that wait for things to happen, like a server for instance – will prevent you from entering commands in your terminal until they're done. To interrupt such processes and get your prompt back, press **Ctrl+C**. You can alternatively open a new terminal tab if you want to keep them running while being able to enter commands. You can also make these processes run in the background but that's out of the scope of this tutorial.

## PM2

> 💡 **[PM2](http://pm2.keymetrics.io/)** is a Process Manager for Node. It keeps your processes alive in production, and offers tons of features to manage them and monitor them.

PM2 is not only great for production, it can also be used in development thanks to its *watch* feature which restarts the server automatically when files are changed. And if you ever need to run multiple processes, like a separate websocket server for instance, PM2 makes it very easy as well.

- Run `yarn add --dev pm2`.

### Development mode

Right now, we use the `babel-node` binary to interpret our ES6/Flow code. PM2 typically uses `node` to run applications. Even though it is possible to make PM2 use an alternative interpreter like `babel-node`, it's unfortunately not working so great, and would sometimes mess up and leave the `babel-node` process hanging, when it was supposed to have been killed. This might get fixed at some point, but in the meantime, we are going to use a more reliable solution, thanks to Babel's *require hook*.

#### The Babel require hook

The Babel require hook (or `babel-register`) is an override of `node`'s native `require` function. Once you include it somewhere in your code, any `require` happening after that will trigger Babel transformations of the requested code. Pretty trippy! What's great about it is that we can now let PM2 use the regular `node` binary instead of `babel-node`. Let's set that up.

- Create a `src/server/require-hook.js` file containing:

```js
/* eslint-disable import/no-extraneous-dependencies */

require('babel-register')
require('./index.js')
```

Try to run `node src/server` in your terminal. `node` should choke on `Unexpected token import`, which is expected.

- Now run `node src/server/require-hook` instead. This time it's going through the require hook and you should see your server starting. Magic!

#### Development configuration file

PM2 can be configured with command-line parameters or config files. Since we try to keep our `package.json` as lean as possible, we're going to use config files, one per environment.

- Create a `pm2-dev.yaml` file, containing:

```yaml
apps:
  - name: dev
    script: ./src/server/require-hook.js
    out_file: logs/server-dev.log
    error_file: logs/server-dev.log
    combine_logs: true
    watch: true
    ignore_watch: logs/
    env:
      NODE_ENV: development
```

`name` is an arbitrary given name. `script` is the entry point of our server process. Then we declare that we want our server logs stored in the `logs/` folder. `combine_logs` is a parameter to not use process ID suffixes in the log filename. `watch` enables the auto-restart of the server when **any** file changes in the directory. `ignore_watch` lets us exclude the `logs` directory to avoid infinite loops due the constant rewriting of logs. Finally, `env.NODE_ENV` is your regular NODE_ENV environment variable.

- Add `/logs/` to your `.gitignore`.

The log file is going to grow bigger and bigger over time, and it's probably a good idea to clear it (delete it) every time we start the server. A neat simple package that lets us delete files with cross platform support us `rimraf`.

- Run `yarn add --dev rimraf`.

#### Development scripts

Let's update our `package.json` like so:

```json
"scripts": {
  "start": "yarn dev",
  "dev": "yarn stop && pm2 start pm2-dev.yaml",
  "stop": "rimraf logs/* && pm2 delete all || true",
  "test": "eslint src && flow",
  "precommit": "yarn test",
  "prepush": "yarn test"
},
```

`start` is now just a pointer to some other task, which is `dev` here. That gives us a layer of abstraction to tweak what the default task is.

`dev` is our main task for development. It calls `stop` to get rid of any previous process, and starts our PM2 process based on the config file.

In `stop`, `rimraf logs/* && pm2 delete all` clears the logs folder and deletes all processes. If there was no processes running, it returns an error exit code. Since we don't want this error to interrupt our chain of tasks, we force it to pass with `|| true`.

🏁 Go to `http://localhost:8000/` in your browser. If you have no hanging process currently running it should give you a 404. Run `yarn start`, which should trigger `dev`, which triggers, `stop`, and finally launches the process of our server. Note that with PM2, your processes are run in the background so you still have control over your terminal. Hit `http://localhost:8000/` and it should now show your app. Take a look at the `logs/server-dev.log` file, which should contain `Express running on port 8000.`.

Since we enabled PM2's *watch* feature, you can modify the `APP_NAME` string in `src/shared/config.js`, save the file, reload your browser tab, and see the updated string. Without watching, this would require restarting the whole process.

- Run `yarn stop` to stop your server. If everything works well, it should now give you a 404 again in your browser.

You are now all set for your development environment.

### Production mode

In production, you want your server to be as performant as possible. `babel-node` and the require hook trigger the whole Babel transpilation process for your files at each execution, which is not something you want in production. We need Babel to do all this work beforehand, and have our server serve plain old pre-compiled ES5 files.

One of the main features of Babel is to take a folder of ES6 code (usually named `src`) and transpile it into a folder of ES5 code (usually named `lib`). Let's add the following `build` task to our `package.json`:

```json
"prod": "yarn stop && yarn build && pm2 start pm2-prod.yaml",
"build": "rimraf lib && babel src -d lib",
```

First, we use `rimraf` to clean up the auto-generated `lib` folder. Then we use `babel` to transpile our code from `src` to `lib`. Finally we run PM2 on a different config file, `pm2-prod.yaml`.

- Create a `pm2-prod.yaml` file containing:

```yaml
apps:
  - name: prod
    script: ./lib/server
    out_file: logs/server-prod.log
    error_file: logs/server-prod.log
    combine_logs: true
    env:
      NODE_ENV: production
```

The only differences with the `pm2-dev.yaml` file is that the `script` now points to the `lib` folder instead of `src`, and we are not using `watch`.

- Add `/lib/` to your `.gitignore`.

🏁 Run `yarn prod`. It should delete previous `logs` and `lib` files, kill any previous process, transpile your files and run your server on `http://localhost:8000/`.

All good? Congratulations, you now have development and production environments set up!

### Full-check script

Now that we have a `build` task and a server to manage, it would be neat to make sure these work fine before pushing code to the repository. I suggest creating a `full-check` task that will run all our tests, and start the production server after building the code for it. We'll run this `full-check` task before commits and pushes:

```json
"full-check": "yarn test && yarn prod && yarn stop",
"precommit": "yarn full-check",
"prepush": "yarn full-check"
```

🏁 Run `yarn full-check` or commit your files to trigger the whole process.

Next section: [04 - Webpack, React](/tutorial/04-webpack-react#04---webpack-and-react)

Back to the [previous section](/tutorial/02-babel-es6-eslint-flow-husky#02---babel-es6-eslint-flow-git-hooks) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
