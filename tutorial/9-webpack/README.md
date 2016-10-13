# 9 - Webpack

Webpack is a basically a combination of Gulp and Browserify that can bundle your client app in an optimized way. We're going to replace our Gulp `build-client` task by Webpack.

- Delete your entire `build-client` task in `gulpfile.babel.js` and the associated:
```javascript
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
```
- Run `npm uninstall --save-dev browserify babelify vinyl-source-stream`
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
return gulp.src('src/entry.js')
  .pipe(webpack())
  .pipe(gulp.dest('dist/'));
```

// TODO: Gulp changes here




- Run `npm start`, you should now see Webpack building your `client-bundle.js` file, and opening `index.html` in your browser should still display "The dog says: Wah wah, I am Browser Toby".

Next section: [10 - Redux](/tutorial/10-redux)

Back to the [previous section](/tutorial/8-react) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
