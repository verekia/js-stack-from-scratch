# 6 - ESLint

We're going to lint our code to catch potential issues. ESLint is the linter of choice for ES6 code. Instead of configuring the rules we want for our code ourselves, we will use the config created by Airbnb. This config uses a few plugins, so we need to install those as well to use their config.

- Run `npm install --save eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react`

It will add all of these to your `package.json`, as usual.

In `package.json`, add an `eslintConfig` field like so:
```json
"eslintConfig": {
  "extends": "airbnb",
  "plugins": [
    "import"
  ]
},
```
The `plugins` part is to tell ESLint that we use the ES6 import syntax.

We'll create a Gulp task that runs ESLint for us. So we'll install the ESLint Gulp plugin as well:

- Run `npm install --save gulp-eslint`

Add the following task to your `gulpfile.js`:
```javascript
const eslint = require('gulp-eslint')

// [...]

gulp.task('lint', () => {
  return gulp.src([
    'gulpfile.js',
    'src/**/*.js',
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
```
Here we tell Gulp that for this task, we want to include `gulpfile.js`, and the JS files located under `src`.

Modify your `build` Gulp task by making the `lint` task a prerequisite to it. It's as simple as passing an array of prerequisite tasks to it, like so:
```javascript
gulp.task('build', ['lint'], () => {
```

- Run `npm start`, and you should see a bunch of linting errors in this Gulpfile, and a warning for using console.log() in `index.js`. The gulpfile issues are because we are using the following code:

```javascript
() => {
  return 1;
}
```
When we could be using the following:
```javascript
() => 1
```
Because when a function only contains a return statement, you can ommit the curly braces, return statement, and semicolon in ES6.


So let's update the Gulp file accordingly:
```javascript
gulp.task('build', ['lint'], () =>
  gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);

gulp.task('lint', () =>
  gulp.src([
    'gulpfile.js',
    'src/**/*.js',
    '!lib/**',
    '!node_modules/**',
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);
```

The last warning left is about console.log(). Let's say that we want this console.log() to be valid in `index.js` instead of triggering a warning. In order to do so, we can add `/* eslint-disable no-console */` at the top of our `index.js` file.

- Run `npm start` and we are now all clear again.

**Note**: This section sets you up with ESLint in the console. It great for catching errors at build time / before pushing, but you also probably want it integrated to your IDE. Do NOT use your IDE's native linting for ES6. Configure it so the binary it uses for linting is the one in your `node_modules` folder. This way it can use all of your project's config, the Airbnb preset, etc. Otherwise you will just get a generic ES6 linting.


[7 - Client app with Browserify](/7-client-browserify)

Back to the [previous section](/5-es6-modules-syntax) or the [table of contents](https://github.com/verekia/modern-js-stack-training).
