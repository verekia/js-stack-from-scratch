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
```

- Create an empty `src/client/` folder.

- Create a `src/shared/config.js` file, containing:

```javascript
// @flow

export const EXPRESS_PORT = 8000
export const STATIC_PATH = '/static'
```

- Create a `src/server/server.js` file containing:

```javascript
// @flow

/* eslint-disable no-console */

import express from 'express'

import { EXPRESS_PORT, STATIC_PATH } from '../shared/config'
import masterTemplate from './template/master-template'

const app = express()

app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))

app.get('/', (req, res) => {
  res.send(masterTemplate('Dog App'))
})

app.listen(EXPRESS_PORT, () => {
  console.log(`Express running on port ${EXPRESS_PORT}.`)
})
```

Nothing fancy here, it's almost Express' Hello World tutorial with a few additional imports.

- Create a `src/server/template/master-template.js` file containing:

```javascript
// @flow

import { STATIC_PATH } from '../../shared/config'

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

```javascript
import { html } from `common-tags`

const template = html`
<div>Wow, colors!</div>
`
```

I did not include this trick in the boilerplate of this tutorial, since it seems to only work in Atom, and it's less than ideal. Some of you Atom users might find it useful though.

Anyway, back to business!

- Run `yarn add express`.

- In `package.json` change your `start` script like so: `"start": "babel-node src/server/server"`

- Run `yarn start`, and hit `localhost:8000` in your browser. If everything works as expected you should see a blank page with "Dog App" written both on the tab title and as a heading on the page. Inspect the `body` element to make sure our CSS is loaded correctly.

## PM2

> 💡 **[PM2](http://pm2.keymetrics.io/)** is a Process Manager for Node. It keeps your processes alive in production, and offers tons of features to manage them and monitor them.

PM2 is not only great for production, it can also be used in development thanks to its *watch* feature. Let's set up both environments right now.

### Development mode

Right now, we use the `babel-node` binary to interpret our ES6/Flow code. PM2 typically uses `node` to run applications. Even though it is possible to make PM2 use an alternative interpreter like `babel-node`, it's unfortunately not working so great, and would sometimes mess up and leave the `babel-node` process hanging, when it was supposed to have been killed. This might get fixed at some point, but in the meantime, we are going to use a more reliable solution, thanks to Babel's *require hook*.

#### The Babel require hook

The Babel require hook (or `babel-register`) is an override of `node`'s native `require` function. Once you include it somewhere in your code, any `require` happening after that will trigger Babel transformations of the requested code. Pretty trippy! What's great about it is that we can now let PM2 use the regular `node` binary instead of `babel-node`. Let's set that up.

- Create a `src/server/index.js` file containing:

```javascript
/* eslint-disable import/no-extraneous-dependencies */

require('babel-register')
require('./server.js')
```

Try to run `node src/server/server` in your terminal. `node` should choke on `Unexpected token import`, which is expected.

- Now run `node src/server` instead (which points to `src/server/index.js`, the default file of the directory). This time it's going through the require hook and you should see your server starting. Magic!

### Development configuration file

PM2 can be configured with command-line parameters or config files. Since we try to keep our `package.json` as lean as possible, we're going to use config files, one per environment.

- Create

// TODO: We simply tell Babel to compile an ES6 `src` directory into an ES5 `lib` directory with the `-d` flag.

- Add `/lib/` to your `.gitignore`.


The only point of this file is to see that our public assets folder is set up correctly with some basic styling.
