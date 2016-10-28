# 7 - Client App with Webpack

## Structure of our app

- Create a `dist` folder at the root of your project, and add the following `index.html` file to it:

```html
<!doctype html>
<html>
  <head>
  </head>
  <body>
    <div class="app"></div>
    <script src="client-bundle.js"></script>
  </body>
</html>
```

In your `src` folder, create the following subfolders: `server`, `shared`, `client`, and move your current `index.js` into `server`, and `dog.js` into `shared`. Create `app.js` in `client`.

We are not going to do any Node back-end yet, but this separation will help you see more clearly where things belong. You'll need to change the `import Dog from './dog';` in `server/index.js` to `import Dog from '../shared/dog';` though, or ESLint will detect errors for unresolved modules.

Write this in `client/app.js`:

```javascript
import Dog from '../shared/dog';

const browserToby = new Dog('Browser Toby');

document.querySelector('.app').innerText = browserToby.bark();
```

Add the following to your `package.json`, under `eslintConfig`:

```json
"env": {
  "browser": true
}
```
This way we can use variables such as `window` or `document` which are always accessible in the browser without ESLint complaining about undeclared variables.

If you want to use some of the most recent ES features in your client code, like `Promise`s, you need to include the [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/) in your client code.

- Run `yarn add babel-polyfill`

And before anything else in `app.js`, add this import:

```javascript
import 'babel-polyfill';
```

Including the polyfill adds about 300KB to your bundle, so don't do this if you're not using any of the features it covers!

## Webpack

In a Node environment, you can freely `import` different files and Node will resolve these files using your filesystem. In a browser, there is no filesystem, and therefore your `import`s point to nowhere. In order for our entry point file `app.js` to retrieve the tree of imports it needs, we are going to "bundle" that entire tree of dependencies into one file. Webpack is a tool that does this.

Webpack uses a config file, just like Gulp, called `webpack.config.js`. It is possible to use ES6 imports and exports in it, in the exact same way that we made Gulp rely on Babel to do so: by naming this file `webpack.config.babel.js`.

- Create an empty `webpack.config.babel.js` file

- While you're at it, add `webpack.config.babel.js` to your Gulp `lint` task, and a few more `paths` constants:

```javascript
const paths = {
  allSrcJs: 'src/**/*.js',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
  libDir: 'lib',
  distDir: 'dist',
};

// [...]

gulp.task('lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
    paths.webpackFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);
```

We need to teach Webpack how to process ES6 files via Babel (just like we taught Gulp how to process ES6 files with `gulp-babel`). In Webpack, when you need to process files that are not plain old JavaScript, you use *loaders*. So let's install the Babel loader for Webpack:

- Run `yarn add --dev babel-loader`

- Write the following to your `webpack.config.babel.js` file:

```javascript
export default {
  output: {
    filename: 'client-bundle.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
```

Let's analyze this a bit:

We need this file to `export` stuff for Webpack to read. `output.filename` is the name of the bundle we want to generate. `devtool: 'source-map'` will enable source maps for a better debugging experience in your browser. In `module.loaders`, we have a `test`, which is the JavaScript regex that will be used to test which files should be processed by the `babel-loader`. Since we will use both `.js` files and `.jsx` files (for React) in the next chapters, we have the following regex: `/\.jsx?$/`. The `node_modules` folder is excluded because there is no transpilation to do there. This way, when your code `import`s packages located in `node_modules`, Babel doesn't bother processing those files, which reduces build time. The `resolve` part is to tell Webpack what kind of file we want to be able to `import` in our code using extension-less paths like `import Foo from './foo'` where `foo` could be `foo.js` or `foo.jsx` for instance.

Okay so now we have Webpack set up, but we still need a way to *run* it.

## Integrating Webpack to Gulp

Webpack can do a lot of things. It can actually replace Gulp entirely if your project is mostly client-side. Gulp being a more general tool, it is better suited for things like linting, tests, and back-end tasks though. It is also simpler to understand for newcomers than a complex Webpack config. We have a pretty solid Gulp setup and workflow here, so integrating Webpack to our Gulp build is going to be easy peasy.

Let's create the Gulp task to run Webpack. Open your `gulpfile.babel.js`.

We don't need the `main` task to execute `node lib/` anymore, since we will open `index.html` to run our app.

- Remove `import { exec } from 'child_process'`.

Similarly to Gulp plugins, the `webpack-stream` package lets us integrate Webpack into Gulp very easily.

- Install the package with: `yarn add --dev webpack-stream`

- Add the following `import`s:

```javascript
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';
```

The second line just grabs our config file.

Like I said earlier, in the next chapter we are going to use `.jsx` files (on the client, and even on the server later on), so let's set that up right now to have a bit of a head start.

- Change the constants to the following:

```javascript
const paths = {
  allSrcJs: 'src/**/*.js?(x)',
  serverSrcJs: 'src/server/**/*.js?(x)',
  sharedSrcJs: 'src/shared/**/*.js?(x)',
  clientEntryPoint: 'src/client/app.js',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
  libDir: 'lib',
  distDir: 'dist',
};
```

The `.js?(x)` is just a pattern to match `.js` or `.jsx` files.

We now have constants for the different parts of our application, and an entry point file.

- Modify the `main` task like so:

```javascript
gulp.task('main', ['lint', 'clean'], () =>
  gulp.src(paths.clientEntryPoint)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.distDir))
);
```

**Note**: Our `build` task currently transpiles ES6 code to ES5 for every `.js` file located under `src`. Now that we've split our code into `server`, `shared`, and `client` code, we could make this task only compile `server` and `shared` (since Webpack takes care of `client`).

- Run `yarn start`, you should now see Webpack building your `client-bundle.js` file, and opening `index.html` in your browser should display "Wah wah, I am Browser Toby".

One last thing: unlike our `lib` folder, the `dist/client-bundle.js` and `dist/client-bundle.js.map` files are not being cleaned up by our `clean` task before each build.

- Add `clientBundle: 'dist/client-bundle.js?(.map)'` to our `paths` configuration, and tweak the `clean` task like so:

```javascript
gulp.task('clean', () => del([
  paths.libDir,
  paths.clientBundle,
]));
```

- Add `/dist/client-bundle.*` to your `.gitignore` file.

Next section: [8 - React](/tutorial/8-react)

Back to the [previous section](/tutorial/6-eslint) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
