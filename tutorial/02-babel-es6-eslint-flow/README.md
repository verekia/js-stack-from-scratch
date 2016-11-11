# 02 - Babel, ES6, ESLint, Flow

We're now going to use some ES6 syntax, which is a great improvement over the "old" ES5 syntax. All browsers and JS environments understand ES5 well, but not ES6. That's where a tool called Babel comes to the rescue!

## Babel

> 💡 **[Babel](https://babeljs.io/)** is a compiler that transforms ES6 code (and other things like React's JSX syntax) into ES5 code. It is very modular and can be used in tons of different [environments](https://babeljs.io/docs/setup/). It is by far the preferred ES5 compiler of the React community.

- Move your `index.js` into a new `src` folder. This is where you will write your ES6 code. A `lib` folder is where the compiled ES5 code will go. Babel will take care of creating it. Remove the previous `color`-related code in `index.js`, and replace it with a simple:

```javascript
const str = 'ES6';
console.log(`Hello ${str}`);
```

We're using a *template string* here, which is an ES6 feature that lets us inject variables directly inside the string without concatenation using `${}`. Note that template strings are created using **backquotes**.

- Run `yarn add --dev babel-cli` to install the CLI interface for Babel.

- To run our program, we now need to execute `node lib` instead of `node .` (`index.js` is the default file Node looks for, which is why we can omit `index.js`). Add a `build` script in your `package.json`, and tweak your `start` script to run `build` before `node lib`:

```json
"scripts": {
  "start": "yarn run build && node lib",
  "build": "babel src -d lib"
},
```

We simply tell Babel to compile an ES6 `src` directory into an ES5 `lib` directory with the `-d` flag.

If you try to run `yarn start` now, it should print the correct output, but you can see that the generated `lib/index.js` did not change much compared to `src/index.js`. That's because we didn't give Babel any information about which transformations we want to apply. The only reason it prints the right output is because Node natively understands ES6 without Babel's help. Some browsers or older versions of Node would not be so successful though!

- Run `yarn add --dev babel-preset-latest` to install a Babel preset package containing configurations for the most recent ECMAScript features supported by Babel.

- In `package.json`, add a `babel` field for the Babel configuration. Make it use the `latest` Babel preset like this:

```json
"babel": {
  "presets": [
    "latest"
  ]
},
```

**Note**: A `.babelrc` file at the root of your project could also be used instead of the `babel` field of `package.json`. Your root folder will get more and more bloated over time, so keep the Babel config in `package.json` until it grows too large.

- Try running `yarn start` again. The `lib/index.js` file should now have been correctly transformed into ES5 code (`var` everywhere!).

- Add `/lib/` to your `.gitignore`.

## A few more tasks

We now have the basic compilation working. To make this environment a bit more usable, we are going to add a few more `scripts` tasks:

```json
"scripts": {
  "start": "yarn run watch",
  "clean": "rimraf lib",
  "prebuild": "yarn run clean",
  "build": "babel src -d lib",
  "lint": "eslint src/**/*.js",
  "watch": "watch 'yarn run main' src --interval=1",
  "main": "yarn run lint && yarn run build && node lib"
},
```

### `clean` with `rimraf`, and `prebuild`

`clean` is a task that simply deletes our entire auto-generated `lib` folder before every `build`. This is typically useful to get rid of old compiled files after renaming or deleting some in `src`, or to make sure the `lib` folder is in sync with the `src` folder if your build fails and you don't notice. We use `rimraf` instead of a plain `rm -rf` in order to support Windows environments as well.

- Run `yarn add --dev rimraf`.

Tasks that are prefixed by `pre` or `post` will respectively be called after and before said task. `clean` is related to `build` and we want to run it before every build, so it's a good candidate for a `pre` task. `prebuild` simply calls `yarn run clean`.

### `main` and `watch`

`main` is going to be... well the *main* task of our workflow. It performs every operation needed for the build (many more will be added later), and runs the program.

`watch` is going to trigger `main` every time a file changes in `src`. We use the `[watch](https://www.npmjs.com/package/watch)` package to monitor file changes, which you need to install:

- Run `yarn add --dev watch`.

**Note**: The `interval` option is the duration in seconds between file change checks. The default value is a bit too slow to my taste, so I use `1` second, which seems reasonable. You can use decimal numbers like `0.5` as well.

Alright, we're now good to go.

- Run `yarn start`. It should clean, build, print "Hello ES6" and start watching for changes. Try modifying `src/index.js` to make sure the  whole task flow is triggered again.

## ES6

> 💡 **[ES6](http://es6-features.org/)**: The most significant improvement of the JavaScript language. There are too many ES6 features to list them here but typical ES6 code uses classes with `class`, `const` and `let`, template strings, and arrow functions (`(param) => { console.log('Hi'); }`).

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

In `src/index.js`, write the following:

```javascript
const Dog = require('./dog');

const toby = new Dog('Toby');

console.log(toby.bark());
```

As you can see, unlike the community-made package `color` that we used before, when we require one of our files, we use `./` in the `require()`.

- Run `yarn start` and it should print 'Wah wah, I am Toby'.

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
export PKG=eslint-config-airbnb
npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add --dev "$PKG@latest"
```

**Note**: I've replaced `npm install` by `yarn add` in this command.

It should install everything you need and add `eslint-config-airbnb`,  `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` to your `package.json` file automatically.

In `package.json`, add an `eslintConfig` field like so:

```json
"eslintConfig": {
  "extends": "airbnb"
},
```

**Note**: An `.eslintrc.js`, `.eslintrc.json`, or `. eslintrc.yaml` file at the root of your project could also be used instead of the `eslintConfig` field of `package.json`. Just like for the Babel configuration, we try to avoid bloating the root folder with too many files, but if you have a complex ESLint config, consider this alternative.

We'll create an NPM/Yarn script to runs ESLint. Let's install the `eslint` package to be able to use the `eslint` CLI:

- Run `yarn add --dev eslint`

Add the following script to your `package.json`:

```json
"lint": "eslint src/**/*.js"
```

And update your `main` task:
```json
"main": "yarn run lint && yarn run clean && yarn run build && node lib"
```

Here we just tell ESLint that the files we want to lint are all the `.js` files under `src`, pretty explicit.

- Run `yarn start`, and you should see a warning for using `console.log()` in `index.js`. Let's say that we want this `console.log()` to be valid in `index.js` instead of triggering a warning in this example. Add `/* eslint-disable no-console */` at the top of our `index.js` file to allow the use of `console` in this file.

- Run `yarn start` and we are now all clear!

**Note**: This section sets you up with ESLint in the console. It is great for catching errors at build time / before pushing, but you also probably want it integrated to your IDE. Do NOT use your IDE's native linting for ES6. Configure it so the binary it uses for linting is the one in your `node_modules` folder. This way it can use all of your project's config, the Airbnb preset, etc. Otherwise you will just get a generic ES6 linting.

## Flow

> 💡 **[Flow](https://flowtype.org/)**: A static type checker by Facebook. It detects inconsistent types in your code. For instance, it will give you an error if you try to use a string where should be using a number.

- In order for Babel to understand and remove Flow annotations during the transpilation process, install the Flow preset for Babel by running `yarn add --dev babel-preset-flow`. Then, add `"flow"` under `babel.presets` in your `package.json`.

- Create an empty `.flowconfig` file at the root of your project

- Run `yarn add --dev flow-bin` to install Flow, and create a `typecheck` task:

```json
"typecheck": "flow"
```

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
