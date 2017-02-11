# 04 - Webpack and React

## Webpack

> 💡 **[Webpack](https://webpack.github.io/)** is a *module bundler*. It takes a whole bunch of various source files, processes them, and assembles them into one (usually) JavaScript file called a bundle, which is the only file your client will execute.

Let's create some very basic *hello world* app and bundle it with Webpack.

- Create an `src/client/entry.js` file containing:

```javascript
// @flow

import 'babel-polyfill'

document.querySelector('.js-app').innerText = 'Wah wah'
```

If you want to use some of the most recent ES features in your client code, like `Promise`s, you need to include the [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/) before anything else in in your bundle.

- Run `yarn add babel-polyfill`.

If you run ESLint on this file, it will complain about `document` being undeclared.

- Add the following to your `.eslintrc.json` at the root of the object to allow the use of `window` and `document`:

```json
"env": {
  "browser": true
}
```

Alright, we now need to bundle this ES6 client app into an ES5 bundle.

- In `src/shared/config`, add the following constant:

```javascript
export const WDS_PORT = 7000
```

- Create a `webpack.config.babel.js` file containing:

```javascript
// @flow

import { WDS_PORT } from './src/shared/config'

export default {
  entry: './src/client/entry.js',
  output: { filename: 'dist/js/bundle.js' },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
    ],
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: { port: WDS_PORT },
}
```

This file is used to describe how our bundle should be assembled: `entry` is the starting point of our app and `output.filename` is the file path of the bundle to generate. We put it in a `dist` folder, which will contain bundles and other things that are generated automatically (unlike the declarative CSS we created earlier which lives in `public`). `module.rules` is where you tell Webpack to apply some treatment to some type of files. Here we say that we want all `.js` and `.jsx` files except the ones in `node_modules` to go through something called `babel-loader`. We also want these two extensions to `resolve`. Finally, we declare a port for Webpack Dev Server.

`babel-loader` is a plugin for Webpack that transpiles your code just like we've been doing since the beginning of this tutorial. The only difference is that this time, the code will end up running in the browser of your client instead of your server.

- Run `yarn add --dev babel-core babel-loader`.

`babel-core` is a peer-dependency of `babel-loader`, so you need to install it as well.

- Run `yarn add --dev webpack webpack-dev-server`.

- Add `/dist/` to your `.gitignore`.

### Development / Production variations

In development mode, we are going to use `webpack-dev-server` to take advantage of hot module reloading, and in production we'll simply use `webpack` to generate bundles. In both cases, the `--progress` flag is useful to display additional information when Webpack is compiling your files. In production, we'll also pass the `-p` flag to `webpack` to minify our code.

One more thing: In order for our `webpack.config.babel.js` file to be aware of the `NODE_ENV` environment variable, we need to pass it to the `webpack`. With Unix, you would do this by running `NODE_ENV=production webpack`, but Windows uses a different syntax. We're going to use a small package called `cross-env` to make this syntax work on Windows as well.

- Run `yarn add --dev cross-env`.

You can now tweak your `package.json` scripts like so:

```json
"dev": "yarn stop && pm2 start pm2-dev.yaml && webpack-dev-server --progress",
"prod": "yarn stop && yarn build && pm2 start pm2-prod.yaml",
"build": "rimraf dist lib && babel src/server -d lib/server && babel src/shared -d lib/shared && cross-env NODE_ENV=production webpack -p --progress"
```

Next, let's create a `<div class="js-app"></div>` container in our `src/server/template/master-template.js`, and include the bundle that will be generated:

```javascript
// @flow

import { isProd, STATIC_PATH, WDS_PORT } from '../../shared/config'

export default (title: string) => `
<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="${STATIC_PATH}/css/style.css">
  </head>
  <body>
    <h1>${title}</h1>
    <div class="js-app"></div>
    <script src="${isProd ? STATIC_PATH : `http://localhost:${WDS_PORT}/dist`}/js/bundle.js"></script>
  </body>
</html>
`
```

Depending on the environment we're in, we'll include either the Webpack Dev Server bundle, or the production bundle. Note that the path to Webpack Dev Server's bundle is *virtual*, `dist/js/bundle.js` is not actually read from your hard drive in development mode. It's also necessary to give Webpack Dev Server a different port than your main web port.

Alright that was a lot of changes, let's see if everything works as expected:

- Run `yarn start`. Once Webpack Dev Server is done generating the bundle and its sourcemaps (which should be 1MB+ files) and the process hangs in your terminal, open `http://localhost:8000/` and you should see "Wah wah". Open your Chrome console, and under the Source tab, check which files are included. You should only see `static/css/style.css` under `localhost:8000/`, and have all your ES6 source files under `webpack://./src`. That means sourcemaps are working. In `src/client/entry.js` Try changing `Wah wah` into any other string. As you save the file, Webpack Dev Server in your terminal should generate a new bundle and the Chrome tab should start reloading automatically.

- Run `yarn prod`. Once Webpack is done generating the minified bundle (around 300KB this time), open `http://localhost:8000/` and you should still see "Wah wah". In the Source tab of the Chrome console, you should this time find `static/js/bundle.js` under `localhost:8000/`, but no `webpack://` sources. Click on `bundle.js` to make sure it is minified.

Phew, that was a lot of infra stuff. All these first chapters basically just give you a Hello World in your browser! Alright, I think you now finally deserve to build the app we've been preparing for this entire time.

## React

> 💡 **[React](https://facebook.github.io/react/)** is a library for building user interfaces by Facebook. It uses the **[JSX](https://facebook.github.io/react/docs/jsx-in-depth.html)** syntax to represent HTML elements and components while leveraging the power of JavaScript.

We're now going to render our app using React and JSX.

First, let's install React and ReactDOM:

- Run `yarn add react react-dom`

Let's rename our `src/client/app.js` file into `src/client/app.jsx` and write some React and JSX code in it:

```javascript
// TODO
```

Also, modify `entry` in your `webpack.config.babel.js` to use this JSX file:

```javascript
entry: './src/client/entry.jsx',
```

**Note**: If you are unfamiliar with React or its PropTypes, learn about React first and come back to this tutorial later. There is going to be quite some React things in the upcoming chapters, so you need a good understanding of it.

Since we use the JSX syntax here, we have to tell Babel that it needs to transform it as well.
Install the React Babel preset, which will teach Babel how to process the JSX syntax:
`yarn add --dev babel-preset-react` and change your `.babelrc` file like so:

```json
{
  "presets": [
    "latest",
    "flow",
    "react"
  ]
}
```

## TODO

One counterintuitive case is the following, for `src/client/component/message.jsx`:

```javascript
const Message = ({ message }: { message: string }) => <div>{message}</div>;
```

As you can see, when destructuring function parameters, you must annotate the extracted properties using a sort of object literal notation.

Next section: [05 - Redux, Immutable](/tutorial/05-redux-immutable)

Back to the [previous section](/tutorial/03-express-pm2) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
