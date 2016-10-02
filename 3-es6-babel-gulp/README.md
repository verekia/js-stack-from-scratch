We're now going to use ES6 syntax. Babel will compile ES6 files into ES5 files. To run Babel, we are going to use Gulp, a task runner. It is similar to the tasks located under `scripts` in `package.json`, but making your task is cleaner in a JS file than a JSON file, so we'll install Gulp, and the Babel plugin for Gulp too:
- Run `npm install --save babel`
- Run `npm install --save babel-preset-latest`
- Run `npm install --save gulp`
- Run `npm install --save gulp-babel`
- In `package.json`, add a `babel` field for the babel configuration. Make it use the latest Babel preset like this:
```json
"babel": {
  "presets": [
    "latest"
  ]
},
```

- Move your `index.js` into a new `src` folder. This is where you will write your ES6 code. A `lib` folder is where the compiled ES5 code will go. Gulp and Babel will take care of creating it.

- Create a `gulpfile.js` containing:

```javascript
const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('build', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

```
Gulp's API is very straightforward. It defines `gulp.task`s, that can reference `gulp.src` files, apply a chain of treatments to them (like `babel()` in our case) and outputs the new files to `gulp.dest`.

- In `package.json`, change your `start` script to: `"start": "gulp build && node lib/"`
- Run `npm start` and it should print the color correctly.
