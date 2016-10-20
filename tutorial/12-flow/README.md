# 12 - Flow

[Flow](https://flowtype.org/) is a static type checker. It detects inconsistent types in your code and you can add explicit type declarations in it via annotations.

- In order for Babel to undestand and remove Flow annotations during the transpilation process, install the Flow preset for Babel by running `npm install --save-dev babel-preset-flow`. Then, add `"flow"` under `babel.presets` in your `package.json`.

- Create an empty `.flowconfig` file at the root of your project

- Run `npm install --save-dev gulp-flowtype` to install the Gulp plugin for Flow, and add `flow()` to your `lint` task:

```javascript
import flow from 'gulp-flowtype';

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
    .pipe(flow({ abort: true })) // Add Flow here
);
```

The `abort` option is to interrupt the Gulp task if Flow detects an issue.

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

Now if you run `npm start`, Flow will work fine, but ESLint is going to complain about that non-standard syntax we're using. Since Babel's parser is all up-and-running with parsing Flow content thanks to the `babel-preset-flow` plugin we installed, it'd be nice if ESLint could rely on Babel's parser instead of trying to understand Flow annotations on its own. That's actually possible using the `babel-eslint` package. Let's do this.

- Run `npm install --save-dev babel-eslint`

- In `package.json`, under `eslintConfig`, add the following property: `"parser": "babel-eslint"`

`npm start` should now both lint and typecheck your code fine.

Now that ESLint and Babel are able to share a common parser, we can actually get ESLint to lint our Flow annotations via the `eslint-plugin-flowtype` plugin.

- Run `npm install --save-dev eslint-plugin-flowtype` and add `"flowtype"` under `eslintConfig.plugins` in `package.json`, and add `"plugin:flowtype/recommended"` under `eslintConfig.extends` in an array next to `"airbnb"`.

Now if you type `name:string` as an annotation, ESLint should complain that you forgot a space after the colon for instance.

**Note**: The `"parser": "babel-eslint"` property that I made you write in `package.json` is actually included in the `"plugin:flowtype/recommended"` config, so you can now remove it for a more minimal `package.json`. Leaving it there is more explicit though, so that's up to your personal preference. Since this tutorial is about the most minimal setup, I removed it.

- You can now add `// @flow` in every `.js` and `.jsx` file under `src`, run `npm test` or `npm start`, and add type annotations everywhere Flow asks you to do so.

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
```
[ignore]

.*/node_modules/gulp-flowtype/.*
```
In my case, the `linter-flow` plugin for Atom was detecting type errors in the `node_modules/gulp-flowtype` directory, which contains files annotated with `// @flow`.

You now have a bullet-proof code that is linted, typechecked, and tested, good job!

Back to the [previous section](/tutorial/11-testing-mocha-chai-sinon) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
