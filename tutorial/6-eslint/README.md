# 6 - ESLint

We're going to lint our code to catch potential issues. ESLint is the linter of choice for ES6 code. Instead of configuring the rules we want for our code ourselves, we will use the config created by Airbnb. This config uses a few plugins, so we need to install those as well to use their config.

- Run `yarn add --dev eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react`

As you can see, you can install several packages in one command. It will add all of these to your `package.json`, as usual.

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

**Note**: An `.eslintrc.js` file at the root of your project could also be used instead of the `eslintConfig` field of `package.json`. Just like for the Babel configuration, we try to avoid bloating the root folder with too many files, but if you have a complex ESLint config, consider this alternative.

We'll create a Gulp task that runs ESLint for us. So we'll install the ESLint Gulp plugin as well:

- Run `yarn add --dev gulp-eslint`

Add the following task to your `gulpfile.babel.js`:

```javascript
import eslint from 'gulp-eslint';

const paths = {
  allSrcJs: 'src/**/*.js',
  gulpFile: 'gulpfile.babel.js',
  libDir: 'lib',
};

// [...]

gulp.task('lint', () => {
  return gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
```

Here we tell Gulp that for this task, we want to include `gulpfile.babel.js`, and the JS files located under `src`.

Modify your `build` Gulp task by making the `lint` task a prerequisite to it, like so:

```javascript
gulp.task('build', ['lint', 'clean'], () => {
  // ...
});
```

- Run `yarn start`, and you should see a bunch of linting errors in this Gulpfile, and a warning for using `console.log()` in `index.js`.

One type of issue you will see is `'gulp' should be listed in the project's dependencies, not devDependencies (import/no-extraneous-dependencies)`. That's actually a false negative. ESLint cannot know which JS files are part of the build only, and which ones aren't, so we'll need to help it a little bit using comments in code. In `gulpfile.babel.js`, at the very top, add:

```javascript
/* eslint-disable import/no-extraneous-dependencies */
```

This way, ESLint won't apply the rule `import/no-extraneous-dependencies` in this file.

Now we are left with the issue `Unexpected block statement surrounding arrow body (arrow-body-style)`. That's a great one. ESLint is telling us that there is a better way to write the following code:

```javascript
() => {
  return 1;
}
```

It should be rewritten into:

```javascript
() => 1
```

Because when a function only contains a return statement, you can omit the curly braces, return statement, and semicolon in ES6.

So let's update the Gulp file accordingly:

```javascript
gulp.task('lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('clean', () => del(paths.libDir));

gulp.task('build', ['lint', 'clean'], () =>
  gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.libDir))
);
```

The last issue left is about `console.log()`. Let's say that we want this `console.log()` to be valid in `index.js` instead of triggering a warning in this example. You might have guessed it, we'll put `/* eslint-disable no-console */` at the top of our `index.js` file.

- Run `yarn start` and we are now all clear again.

**Note**: This section sets you up with ESLint in the console. It is great for catching errors at build time / before pushing, but you also probably want it integrated to your IDE. Do NOT use your IDE's native linting for ES6. Configure it so the binary it uses for linting is the one in your `node_modules` folder. This way it can use all of your project's config, the Airbnb preset, etc. Otherwise you will just get a generic ES6 linting.


Next section: [7 - Client app with Webpack](/tutorial/7-client-webpack)

Back to the [previous section](/tutorial/5-es6-modules-syntax) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
