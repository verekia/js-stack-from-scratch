# 3 - Setting up ES6 with Babel and Gulp

We're now going to use ES6 syntax, which is a great improvement over the "old" ES5 syntax. All browsers and JS environments understand ES5 well, but not ES6. So we're going to use a tool called Babel to transform ES6 files into ES5 files. To run Babel, we are going to use Gulp, a task runner. It is similar to the tasks located under `scripts` in `package.json`, but writing your task in a JS file is simpler and clearer than a JSON file, so we'll install Gulp, and the Babel plugin for Gulp too:

- Run `yarn add --dev gulp`
- Run `yarn add --dev gulp-babel`
- Run `yarn add --dev babel-preset-latest`
- In `package.json`, add a `babel` field for the babel configuration. Make it use the latest Babel preset like this:

```json
"babel": {
  "presets": [
    "latest"
  ]
},
```

**Note**: A `.babelrc` file at the root of your project could also be used instead of the `babel` field of `package.json`. Your root folder will get more and more bloated over time, so keep the Babel config in `package.json` until it grows too large.

- Move your `index.js` into a new `src` folder. This is where you will write your ES6 code. A `lib` folder is where the compiled ES5 code will go. Gulp and Babel will take care of creating it. Remove the previous `color`-related code in `index.js`, and replace it with a simple:

```javascript
const str = 'ES6';
console.log(`Hello ${str}`);
```

We're using a *template string* here, which is an ES6 feature that lets us inject variables directly inside the string without concatenation using `${}`.

- Create a `gulpfile.js` containing:

```javascript
const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const exec = require('child_process').exec;

const paths = {
  allSrcJs: 'src/**/*.js',
  libDir: 'lib',
};

gulp.task('clean', () => {
  return del(paths.libDir);
});

gulp.task('build', ['clean'], () => {
  return gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.libDir));
});

gulp.task('main', ['build'], (callback) => {
  exec(`node ${paths.libDir}`, (error, stdout) => {
    console.log(stdout);
    return callback(error);
  });
});

gulp.task('watch', () => {
  gulp.watch(paths.allSrcJs, ['main']);
});

gulp.task('default', ['watch', 'main']);

```

Let's take a moment to understand all this.

The API of Gulp itself is pretty straightforward. It defines `gulp.task`s, that can reference `gulp.src` files, applies a chain of treatments to them with `.pipe()` (like `babel()` in our case) and outputs the new files to `gulp.dest`. It can also `gulp.watch` for changes on your filesystem. Gulp tasks can run prerequisite tasks before them, by passing an array (like `['build']`) as a second parameter to `gulp.task`. Refer to the [documentation](https://github.com/gulpjs/gulp) for a more thorough presentation.

First we define a `paths` object to store all our different file paths and keep things DRY.

Then we define 5 tasks: `build`, `clean`, `main`, `watch`, and `default`.

- `build` is where Babel is called to transform all of our source files located under `src` and write the transformed ones to `lib`.
- `clean` is a task that simply deletes our entire auto-generated `lib` folder before every `build`. This is typically useful to get rid of old compiled files after renaming or deleting some in `src`, or to make sure the `lib` folder is in sync with the `src` folder if your build fails and you don't notice. We use the `del` package to delete files in a way that integrates well with Gulp's stream (this is the [recommended](https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md) way to delete files with Gulp). Run `yarn add --dev del` to install that package.
- `main` is the equivalent of running `node .` in the previous chapter, except this time, we want to run it on `lib/index.js`. Since `index.js` is the default file Node looks for, we can simply write `node lib` (we use the `libDir` variable to keep things DRY). The `require('child_process').exec` and `exec` part in the task is a native Node function that executes a shell command. We forward `stdout` to `console.log()` and return a potential error using `gulp.task`'s callback function. Don't worry if this part is not super clear to you, remember that this task is basically just running `node lib`.
- `watch` runs the `main` task when filesystem changes happen in the specified files.
- `default` is a special task that will be run if you simply call `gulp` from the CLI. In our case we want it to run both `watch` and `main` (for the first execution).

**Note**: You might be wondering how come we're using some ES6 code in this Gulp file, since it doesn't get transpiled into ES5 by Babel. This is because we're using a version of Node that supports ES6 features out of the box (make sure you are running Node > 6.5.0 by running `node -v`).

Alright! Let's see if this works.

- In `package.json`, change your `start` script to: `"start": "gulp"`.
- Run `yarn start`. It should print "Hello ES6" and start watching for changes. Try writing bad code in `src/index.js` to see Gulp automatically showing you the error when you save.

- Add `lib` to your `.gitignore`


Next section: [4 - Using the ES6 syntax with a class](/tutorial/4-es6-syntax-class)

Back to the [previous section](/tutorial/2-packages) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
