# 02 - Babel, ES6, ESLint, Flow

We're now going to use some ES6 syntax, which is a great improvement over the "old" ES5 syntax. All browsers and JS environments understand ES5 well, but not ES6. That's where a tool called Babel comes to the rescue!

## Babel

> 💡 **[Babel](https://babeljs.io/)** is a compiler that transforms ES6 code (and other things like React's JSX syntax) into ES5 code. It is very modular and can be used in tons of different [environments](https://babeljs.io/docs/setup/). It is by far the preferred ES5 compiler of the React community.

- Move your `index.js` into a new `src` folder. This is where you will write your ES6 code. A `lib` folder is where the compiled ES5 code will go. Gulp and Babel will take care of creating it. Remove the previous `color`-related code in `index.js`, and replace it with a simple:

```javascript
const str = 'ES6';
console.log(`Hello ${str}`);
```

We're using a *template string* here, which is an ES6 feature that lets us inject variables directly inside the string without concatenation using `${}`. Note that template strings are created using **backquotes**.

- Run `yarn add --dev babel-cli` to install the CLI interface for Babel.

- Add a `build` script in your `package.json`:

```json
"build": "babel src -d lib"
```

We simply tell Babel to compile an ES6 `src` directory into an ES5 `lib` directory.

- Run `yarn add --dev babel-preset-latest` to install a Babel preset package containing configurations for the most recent ECMAScript features supported by Babel.

- In `package.json`, add a `babel` field for the babel configuration. Make it use the latest Babel preset like this:

```json
"babel": {
  "presets": [
    "latest"
  ]
},
```

**Note**: A `.babelrc` file at the root of your project could also be used instead of the `babel` field of `package.json`. Your root folder will get more and more bloated over time, so keep the Babel config in `package.json` until it grows too large.

- Running `yarn run build` should generate `index.js` in `lib`.

- Add `/lib/` to your `.gitignore`.

## A few more tasks

We now have the basic compilation working. To make this environment a bit more usable, we are going to add a few more `script` tasks:

```json
"scripts": {
  "start": "yarn run watch",
  "clean": "rimraf lib",
  "build": "babel src -d lib",
  "watch": "watch 'yarn run main' src",
  "main": "yarn run clean && yarn run build && node lib"
},
```

Then we define 5 tasks: `build`, `clean`, `main`, `watch`, and `default`.

- `build` is where Babel is called to transform all of our source files located under `src` and write the transformed ones to `lib`.
- `clean` is a task that simply deletes our entire auto-generated `lib` folder before every `build`. This is typically useful to get rid of old compiled files after renaming or deleting some in `src`, or to make sure the `lib` folder is in sync with the `src` folder if your build fails and you don't notice. We use `rimraf` instead of a plain `rm -rf` in order to support Windows environments.
- `main` is the equivalent of running `node .` in the previous chapter, except this time, we want to run it on `lib/index.js`. Since `index.js` is the default file Node looks for, we can simply write `node lib` (we use the `libDir` variable to keep things DRY). The `require('child_process').exec` and `exec` part in the task is a native Node function that executes a shell command. We forward `stdout` to `console.log()` and return a potential error using `gulp.task`'s callback function. Don't worry if this part is not super clear to you, remember that this task is basically just running `node lib`.
- `watch` runs the `main` task when filesystem changes happen in the specified files.
- `default` is a special task that will be run if you simply call `gulp` from the CLI. In our case we want it to run both `watch` and `main` (for the first execution).

**Note**: You might be wondering how come we're using some ES6 code in this Gulp file, since it doesn't get transpiled into ES5 by Babel. This is because we're using a version of Node that supports ES6 features out of the box (make sure you are running Node > 6.5.0 by running `node -v`).

Alright! Let's see if this works.

- In `package.json`, change your `start` script to: `"start": "gulp"`.
- Run `yarn start`. It should print "Hello ES6" and start watching for changes. Try writing bad code in `src/index.js` to see Gulp automatically showing you the error when you save.

## ES6

### Creating an ES6 class

- Create a new file, `src/dog.js`, containing the following ES6 class:

```javascript
class Dog {
  constructor(name) {
    this.name = name;
  }

  bark() {
    return `Wah wah, I am ${this.name}`;
  }
}

module.exports = Dog;
```

It should not look surprising to you if you've done OOP in the past in any language. It's relatively recent for JavaScript though. The class is exposed to the outside world via the `module.exports` assignment.

Typical ES6 code uses classes, `const` and `let`, "template strings" (with back ticks) like the one in `bark()`, and arrow functions (`(param) => { console.log('Hi'); }`), even though we're not using any in this example.

In `src/index.js`, write the following:

```javascript
const Dog = require('./dog');

const toby = new Dog('Toby');

console.log(toby.bark());
```

As you can see, unlike the community-made package `color` that we used before, when we require one of our files, we use `./` in the `require()`.

- Run `yarn start` and it should print 'Wah wah, I am Toby'.

- Take a look at the code generated in `lib` to see how your compiled code looks like (`var` instead of `const` for instance).

### The ES6 modules syntax

Here we simply replace `const Dog = require('./dog')` by `import Dog from './dog'`, which is the newer ES6 modules syntax (as opposed to "CommonJS" modules syntax).

In `dog.js`, we also replace `module.exports = Dog` by `export default Dog`.

Note that in `dog.js`, the name `Dog` is only used in the `export`. Therefore it could be possible to export directly an anonymous class like this instead:

```javascript
export default class {
  constructor(name) {
    this.name = name;
  }

  bark() {
    return `Wah wah, I am ${this.name}`;
  }
}
```

You might now guess that the name 'Dog' used in the `import` in `index.js` is actually completely up to you. This would work just fine:

```javascript
import Cat from './dog'; // Don't do this

const toby = new Cat('Toby');
```

Obviously, most of the time you will use the same name as the class / module you're importing.

- `yarn start` should still print "Wah wah, I am Toby".

## ESLint

We're going to lint our code to catch potential issues. ESLint is the linter of choice for ES6 code. Instead of configuring the rules we want for our code ourselves, we will use the config created by Airbnb. This config uses a few plugins, so we need to install those as well to use their config.

Check out Airbnb's most recent [instructions](https://www.npmjs.com/package/eslint-config-airbnb) to install the config package and all its dependencies correctly. As of 2016-11-11, they recommend using the following commands in your terminal:

```bash
export PKG=eslint-config-airbnb;
npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add --dev "$PKG@latest"
```

**Note**: I've replaced `npm install` by `yarn add` in this command.

It should install everything you need and add `eslint-config-airbnb`,  `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` to your `package.json` file.

In `package.json`, add an `eslintConfig` field like so:

```json
"eslintConfig": {
  "extends": "airbnb"
},
```

The `plugins` part is to tell ESLint that we use the ES6 import syntax.

**Note**: An `.eslintrc.js`, `.eslintrc.json`, or `. eslintrc.yaml` file at the root of your project could also be used instead of the `eslintConfig` field of `package.json`. Just like for the Babel configuration, we try to avoid bloating the root folder with too many files, but if you have a complex ESLint config, consider this alternative.

We'll create an NPM/Yarn script to runs ESLint. Let's install the `eslint` package to be able to use the `eslint` CLI:

- Run `yarn add --dev eslint`

Add the following script to your `package.json`:

```json
"lint": "eslint src/**/*.js"
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

## Flow

[Flow](https://flowtype.org/) is a static type checker. It detects inconsistent types in your code and you can add explicit type declarations in it via annotations.

- In order for Babel to understand and remove Flow annotations during the transpilation process, install the Flow preset for Babel by running `yarn add --dev babel-preset-flow`. Then, add `"flow"` under `babel.presets` in your `package.json`.

- Create an empty `.flowconfig` file at the root of your project

- Run `yarn add --dev gulp-flowtype` to install the Gulp plugin for Flow, and create a `typecheck` task:

```javascript
import flow from 'gulp-flowtype';

// [...]

gulp.task('typecheck', () =>
  gulp.src(paths.allSrcJs)
    .pipe(flow({ abort: true }))
);
```

The `abort` option is to interrupt the Gulp task if Flow detects an issue.

- Add `typecheck` in the prerequisites of `build`:

```javascript
gulp.task('build', ['typecheck', 'lint', 'test', 'clean'], () => /* ... */)
```

- Add `typecheck` in your `test` script of `package.json` as well: `"test": "gulp typecheck lint test"`.

Alright, we should be able to run Flow now.

- Add Flow annotations to `src/shared/dog.js` like so:

```javascript
// @flow

class Dog {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  bark(): string {
    return `Wah wah, I am ${this.name}`;
  }

  barkInConsole() {
    /* eslint-disable no-console */
    console.log(this.bark());
    /* eslint-enable no-console */
  }

}

export default Dog;
```

The `// @flow` comment tells Flow that we want this file to be typechecked. For the rest, Flow annotations are typically a colon after a function parameter or a function name. Check the documentation for more details.

Now if you run `yarn start`, Flow will work fine, but ESLint is going to complain about that non-standard syntax we're using. Since Babel's parser is all up-and-running with parsing Flow content thanks to the `babel-preset-flow` plugin we installed, it'd be nice if ESLint could rely on Babel's parser instead of trying to understand Flow annotations on its own. That's actually possible using the `babel-eslint` package. Let's do this.

- Run `yarn add --dev babel-eslint`

- In `package.json`, under `eslintConfig`, add the following property: `"parser": "babel-eslint"`

`yarn start` should now both lint and typecheck your code fine.

Now that ESLint and Babel are able to share a common parser, we can actually get ESLint to lint our Flow annotations via the `eslint-plugin-flowtype` plugin.

- Run `yarn add --dev eslint-plugin-flowtype` and add `"flowtype"` under `eslintConfig.plugins` in `package.json`, and add `"plugin:flowtype/recommended"` under `eslintConfig.extends` in an array next to `"airbnb"`.

Now if you type `name:string` as an annotation, ESLint should complain that you forgot a space after the colon for instance.

**Note**: The `"parser": "babel-eslint"` property that I made you write in `package.json` is actually included in the `"plugin:flowtype/recommended"` config, so you can now remove it for a more minimal `package.json`. Leaving it there is more explicit though, so that's up to your personal preference. Since this tutorial is about the most minimal setup, I removed it.

- You can now add `// @flow` in every `.js` and `.jsx` file under `src`, run `yarn test` or `yarn start`, and add type annotations everywhere Flow asks you to do so.

One counterintuitive case is the following, for `src/client/component/message.jsx`:

```javascript
const Message = ({ message }: { message: string }) => <div>{message}</div>;
```

As you can see, when destructuring function parameters, you must annotate the extracted properties using a sort of object literal notation.

Another case you will encounter is that in `src/client/reducers/dog-reducer.js`, Flow will complain about Immutable not having a default export. This issue is discussed in [#863 on Immutable](https://github.com/facebook/immutable-js/issues/863), which highlights 2 workarounds:

```javascript
import { Map as ImmutableMap } from 'immutable';
// or
import * as Immutable from 'immutable';
```

Until Immutable officially adresses the issue, just pick whichever looks better to you when importing Immutable components. I'm personally going for `import * as Immutable from 'immutable'` since it's shorter and won't require refactoring the code when this issue gets fixed.

**Note**: If Flow detects type errors in your `node_modules` folder, add an `[ignore]` section in your `.flowconfig` to ignore the packages causing issues specifically (do not ignore the entire `node_modules` directory). It could look like this:

```flowconfig
[ignore]

.*/node_modules/gulp-flowtype/.*
```

In my case, the `linter-flow` plugin for Atom was detecting type errors in the `node_modules/gulp-flowtype` directory, which contains files annotated with `// @flow`.

You now have bullet-proof code that is linted, typechecked, and tested, good job!

Back to the [previous section](/tutorial/11-testing-mocha-chai-sinon) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).

Next section: [4 - Express Server](/tutorial/4-express-server)

Back to the [previous section](/tutorial/2-gulp-babel-es6-class-import) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
