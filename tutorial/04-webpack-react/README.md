# 04 - Webpack and React

## Webpack

> 💡 **[Webpack](https://webpack.github.io/)** is a *module bundler*. It takes a whole bunch of various source files, processes them, and assembles them into one (usually) JavaScript file called a bundle, which is the only file your client will execute.

Let's create some very basic *hello world* app and bundle it with Webpack.

- Run `yarn add --dev webpack`.

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

- Create a `webpack.config.babel.js` file containing:

```javascript
// @flow

export default {
  entry: './src/client/entry.js',
  output: { filename: 'dist/js/bundle.js' },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
    ],
  },
}
```

This file is used to describe how our bundle should be assembled: `entry` is the starting point of our app and `output.filename` is the file path of the bundle to generate. We put it in a `dist` folder, which will contain bundles and other things that are generated automatically (unlike the declarative CSS we created earlier which lives in `public`). `module.rules` is where you tell Webpack to apply some treatment to some type of files. Here we say that we want all `.js` files except the ones in `node_modules` to go through something called `babel-loader`.

`babel-loader` is a plugin for Webpack that transpiles your code just like we've been doing since the beginning of this tutorial. The only difference is that this time, the code will end up running in the browser of your client instead of your server.

- Run `yarn add --dev babel-core babel-loader`.

- Add `/dist/` to your `.gitignore`.

`babel-core` is a peer-dependency of `babel-loader`, so you need to install it as well.

### Development / Production variations

Tweak your `package.json` scripts like so:

```json
"dev": "yarn stop && webpack && pm2 start pm2-dev.yaml",
"prod": "yarn stop && yarn build && pm2 start pm2-prod.yaml",
"build": "rimraf lib && babel src -d lib && webpack",
```

Next, let's create a `<div class="js-app"></div>` container in our `src/server/template/master-template.js`, and include the bundle that will be generated:

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
    <div class="js-app"></div>
    <script src="/dist/js/bundle.js"></script>
  </body>
</html>
`
```

## Webpack (old)

// In a Node environment, you can freely `import` different files and Node will resolve these files using your filesystem. In a browser, there is no filesystem, and therefore your `import`s point to nowhere. In order for our entry point file `app.js` to retrieve the tree of imports it needs, we are going to "bundle" that entire tree of dependencies into one file. Webpack is a tool that does this.

// Let's analyze this a bit:

// We need this file to `export` stuff for Webpack to read. `output.filename` is the name of the bundle we want to generate. `devtool: 'source-map'` will enable source maps for a better debugging experience in your browser. In `module.loaders`, we have a `test`, which is the JavaScript regex that will be used to test which files should be processed by the `babel-loader`. Since we will use both `.js` files and `.jsx` files (for React) in the next chapters, we have the following regex: `/\.jsx?$/`. The `node_modules` folder is excluded because there is no transpilation to do there. This way, when your code `import`s packages located in `node_modules`, Babel doesn't bother processing those files, which reduces build time. The `resolve` part is to tell Webpack what kind of file we want to be able to `import` in our code using extension-less paths like `import Foo from './foo'` where `foo` could be `foo.js` or `foo.jsx` for instance.

// Okay so now we have Webpack set up, but we still need a way to *run* it.

// Like I said earlier, in the next chapter we are going to use `.jsx` files (on the client, and even on the server later on), so let's set that up right now to have a bit of a head start.

## React

> 💡 **[React](https://facebook.github.io/react/)** is a library for building user interfaces by Facebook. It uses the **[JSX](https://facebook.github.io/react/docs/jsx-in-depth.html)** syntax to represent HTML elements and components while leveraging the power of JavaScript.

We're now going to render our app using React and JSX.

First, let's install React and ReactDOM:

- Run `yarn add react react-dom`

These 2 packages go to our `"dependencies"` and not `"devDependencies"` because unlike build tools, the client bundle needs them in production.

Let's rename our `src/client/app.js` file into `src/client/app.jsx` and write some React and JSX code in it:

```javascript
import 'babel-polyfill';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Dog from '../shared/dog';

const dogBark = new Dog('Browser Toby').bark();

const App = props => (
  <div>
    The dog says: {props.message}
  </div>
);

App.propTypes = {
  message: PropTypes.string.isRequired,
};

ReactDOM.render(<App message={dogBark} />, document.querySelector('.app'));
```

**Note**: If you are unfamiliar with React or its PropTypes, learn about React first and come back to this tutorial later. There is going to be quite some React things in the upcoming chapters, so you need a good understanding of it.

In your Gulpfile, change the value of `clientEntryPoint` to give it a `.jsx` extension:

```javascript
clientEntryPoint: 'src/client/app.jsx',
```

Since we use the JSX syntax here, we have to tell Babel that it needs to transform it as well.
Install the React Babel preset, which will teach Babel how to process the JSX syntax:
`yarn add --dev babel-preset-react` and change the `babel` entry in your `package.json` file like so:

```json
"babel": {
  "presets": [
    "latest",
    "react"
  ]
},
```

Now after running `yarn start`, if we open `index.html`, we should see "The dog says: Wah wah, I am Browser Toby" rendered by React.

## TODO

One counterintuitive case is the following, for `src/client/component/message.jsx`:

```javascript
const Message = ({ message }: { message: string }) => <div>{message}</div>;
```

As you can see, when destructuring function parameters, you must annotate the extracted properties using a sort of object literal notation.

Next section: [05 - Redux, Immutable](/tutorial/05-redux-immutable)

Back to the [previous section](/tutorial/03-express-pm2) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
