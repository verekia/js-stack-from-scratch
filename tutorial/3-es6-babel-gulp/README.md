# 3 - Setting up ES6 with Babel and Gulp

We're now going to use ES6 syntax, which is a great improvement over the "old" ES5 syntax. All browsers and JS environments understand ES5 well, but not ES6. So we're going to use a tool called Babel to transform ES6 files into ES5 files. To run Babel, we are going to use Gulp, a task runner. It is similar to the tasks located under `scripts` in `package.json`, but writing your task in a JS file is simpler and clearer than a JSON file, so we'll install Gulp, and the Babel plugin for Gulp too:
- Run `npm install --save-dev gulp`
- Run `npm install --save-dev gulp-babel`
- Run `npm install --save-dev babel-preset-latest`
- In `package.json`, add a `babel` field for the babel configuration. Make it use the latest Babel preset like this:
```json
"babel": {
  "presets": [
    "latest"
  ]
},
```
**Note**: A `.babelrc` file at the root of your project could also be used instead of the `babel` field of `package.json`. Your root folder will get more and more bloated over time, so keep the Babel config in `package.json` until it grows too large.

- Move your `index.js` into a new `src` folder. This is where you will write your ES6 code. A `lib` folder is where the compiled ES5 code will go. Gulp and Babel will take care of creating it. Remove the previous `color`-related code in `index.js`, and replace it with a simple `console.log('Hello ES6');`.

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
Gulp's API is very straightforward. It defines `gulp.task`s, that can reference `gulp.src` files, applies a chain of treatments to them with `.pipe()` (like `babel()` in our case) and outputs the new files to `gulp.dest`. Refer to the [documentation](https://github.com/gulpjs/gulp) for a deeper understanding.

- In `package.json`, change your `start` script to: `"start": "gulp build && node lib/"`
- Run `npm start` and it should print "Hello ES6".

- Add `lib` to your `.gitignore`


Next section: [4 - Using the ES6 syntax with a class](/tutorial/4-es6-syntax-class)

Back to the [previous section](/tutorial/2-packages) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
