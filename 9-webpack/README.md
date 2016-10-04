# 9 - Webpack

Webpack is a basically a combination of Gulp and Browserify that can bundle your client app in an optimized way. We're going to replace our Gulp `build-client` task by Webpack.

- Delete your entire `build-client` task in `gulpfile.js` and the associated:
```javascript
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
```
- Run `npm uninstall --save-dev browserify babelify vinyl-source-stream`
- Run `npm install --save-dev webpack`

- Create an empty `webpack.config.js` file

- While you're at it, add `webpack.config.js` to your Gulp `lint` task:

```javascript
gulp.task('lint', () =>
  gulp.src([
    'gulpfile.js',
    'webpack.config.js', // Here
    'src/**/*.js',
    'src/**/*.jsx',
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);
```

We need to teach Webpack how to process ES6 files via Babel (just like we taught Gulp how to process ES6 files with `gulp-babel`). In Webpack, when you need to process files that are not plain old JavaScript, you use *loaders*. So let's install the Babel loader for Webpack:

- Run `npm install --save-dev babel-loader`

- Write the following to your `webpack.config.js` file:
```javascript
module.exports = {
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
We need this file to `export` stuff for Webpack to read. But since it is not a file processed by Babel, we cannot use the ES6 modules syntax, so we use `module.exports` instead. `entry` and `output` are pretty straightforward configuration parameters. In `module.loaders`, we have a `test`, which is the JavaScript regex that will be used to test which files should be processed by the `babel-loader`. Since we use both `.js` files and `.jsx` files, we have the following regex: `/\.jsx?$/`. The `resolve` part is to tell Webpack what kind of file we want to be able to `import` in our code using extension-less filenames like `import Foo from './foo'` where `foo` could be `foo.js` or `foo.jsx` for instance.

- Replace the `start` script in `package.json` by `"start": "gulp lint && webpack"`.

- Run `npm start`, you should now see Webpack building your `client-bundle.js` file, and opening `index.html` in your browser should still display "The dog says: Wah wah, I am Browser Toby".

Back to the [previous section](/8-react) or the [table of contents](https://github.com/verekia/modern-js-stack-training).
