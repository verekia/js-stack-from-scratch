# 7 - Client app with Browserify

- Create a `dist` folder at the root of your project, and add the following `index.html` file to it:

```html
<!doctype html>
<html>
  <head>
  </head>
  <body>
    <script src="client-bundle.js"></script>
  </body>
</html>
```

In your `src` folder, create the following subfolders: `server`, `shared`, `client`, and move your current `index.js` into `server`, and `dog.js` into `shared`. Create `app.js` file in `client`.

We are not going to do any Node back-end in this example, but this separation will help you see more clearly where things belong. You'll need to change the `import Dog from './dog';` in `server/index.js` to `import Dog from '../shared/dog';` though, or ESLint will detect errors for unresolved modules.

Write this in `client/app.js`:

```javascript
import Dog from '../shared/dog';

const browserToby = new Dog('Browser Toby');

document.write(browserToby.bark());
```

Add the following to your `package.json`, under `eslintConfig`:

```json
"env": {
  "browser": true
}
```
This way we can use variables such as `window` or `document` which are always accessible in the browser without ESLint complaining about undeclared variables.

In a Node environment, you can freely `import` different files and Node will resolve these files using your filesystem. In a browser, there is no filesystem, and therefore your `import`s point to nowhere. In order for our entry point file `app.js` to retrieve the tree of imports it needs, we are going to "bundle" that entire tree of dependencies into one file. Browserify is a tool and package that does this. Since we use ES6 syntax, we also want Browserify to compile our ES6 code into ES5 using Babel, which is done with another package called Babelify. We'll need a last package called `vinyl-source-stream` that makes it possible for Gulp to understand what comes out from Babelify and name your bundle. It's a bit difficult to understand, but seeing the code should help visualize the general idea.

- Open your `gulpfile.babel.js`.

We don't need the `main` task to execute `node lib/` anymore, since we will open `index.html` to run our app.

- Remove `import { exec } from 'child_process'`.

- Add the following `import`s:

```javascript
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
```

- Install the packages with: `npm install --save-dev browserify babelify vinyl-source-stream`

- Modify the `main` task like so:

```javascript
const paths = {
  allSrcJs: 'src/**/*.js',
  clientEntryPoint: 'src/client/app.js',
  gulpFile: 'gulpfile.babel.js',
};

// [...]

gulp.task('main', ['lint'], () =>
  browserify({ entries: paths.clientEntryPoint, debug: true })
    .transform(babelify)
    .bundle()
    .pipe(source('client-bundle.js'))
    .pipe(gulp.dest('dist'))
);
```
Feel free to look into each one of these package's documentation for further information. Don't worry about not understanding this part perfectly, it will be replaced by Webpack later anyway, in section 9 of this tutorial.

Our `build` task currently transpiles ES6 code to ES5 for every `.js` file located under `src`. Now that we've split our code into `server`, `shared`, and `client` code, we only need this task to compile `server` and `shared`. So we'll rename it to `build-server` for clarity, and will adjust its compilation source to only include those folders:

```javascript
const paths = {
  allSrcJs: 'src/**/*.js',
  serverSrcJs: 'src/server/**/*.js',
  sharedSrcJs: 'src/shared/**/*.js',
  clientEntryPoint: 'src/client/app.js',
  gulpFile: 'gulpfile.babel.js',
};

// [...]

gulp.task('build-server', ['lint'], () =>
  gulp.src([
    paths.serverSrcJs,
    paths.sharedSrcJs,
  ])
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);
```

The new `main` task will take care of the `client` code.

Finally, if you want to use some of the most recent ES features in your client code, like `Promise`s, you need to include the [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/) in your client bundle.

- Run `npm install --save babel-polyfill`

And before anything else in `app.js`, add this import:

```javascript
import 'babel-polyfill';
```

Including the polyfill adds about 300KB to your bundle, so don't do this if you're not using any of the features it covers!

- Run `npm start`, open `index.html`, and you should see "Wah wah, I am Browser Toby".

- Add `dist/client-bundle.js` to your `.gitignore` file.


Next section: [8 - React](/tutorial/8-react)

Back to the [previous section](/tutorial/6-eslint) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).

# 9 - Webpack

// TODO Explain what Webpack is.

- Run `npm install --save-dev webpack`

Webpack uses a config file, just like Gulp, called `webpack.config.js`. It is possible to use ES6 imports and exports in it, in the exact same way that we made Gulp rely on Babel to do so: by naming this file `webpack.config.babel.js`.

- Create an empty `webpack.config.babel.js` file

- While you're at it, add `webpack.config.babel.js` to your Gulp `lint` task:

```javascript
const paths = {
  allSrcJs: 'src/**/*.js?(x)',
  serverSrcJs: 'src/server/**/*.js?(x)',
  sharedSrcJs: 'src/shared/**/*.js?(x)',
  clientEntryPoint: 'src/client/app.jsx',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
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

- Run `npm install --save-dev babel-loader`

- Write the following to your `webpack.config.babel.js` file:

```javascript
export default {
  entry: './src/client/app.jsx',
  output: {
    path: './dist',
    filename: 'client-bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
```

Let's analyze this a bit:

We need this file to `export` stuff for Webpack to read. `entry` and `output` are pretty straightforward configuration parameters. In `module.loaders`, we have a `test`, which is the JavaScript regex that will be used to test which files should be processed by the `babel-loader`. Since we use both `.js` files and `.jsx` files, we have the following regex: `/\.jsx?$/`. The `resolve` part is to tell Webpack what kind of file we want to be able to `import` in our code using extension-less filenames like `import Foo from './foo'` where `foo` could be `foo.js` or `foo.jsx` for instance.

Webpack can do a lot of things. It's like a Browserify on steroids with the capacity to do some build tasks like Gulp as well. It can actually replace Gulp entirely if your project is mostly client-side. Gulp being a more general tool, it is better suited for things like back-end tasks. It is also simpler to understand for newcomers. We have a pretty solid Gulp setup and workflow here, so integrating Webpack to our Gulp build is going to be easy peasy.

- Run `npm install --save-dev webpack-stream` to install the plugin that makes it easy to integrate Webpack into Gulp.

```javascript
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';

const paths = {
  allSrcJs: 'src/**/*.js?(x)',
  serverSrcJs: 'src/server/**/*.js?(x)',
  sharedSrcJs: 'src/shared/**/*.js?(x)',
  clientEntryPoint: 'src/client/app.jsx',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
};

// [...]

gulp.task('main', ['lint'], () =>
  gulp.src(paths.clientEntryPoint)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist'))
);
```

// TODO: Gulp changes here




- Run `npm start`, you should now see Webpack building your `client-bundle.js` file, and opening `index.html` in your browser should still display "The dog says: Wah wah, I am Browser Toby".

Next section: [10 - Redux](/tutorial/10-redux)

Back to the [previous section](/tutorial/8-react) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
