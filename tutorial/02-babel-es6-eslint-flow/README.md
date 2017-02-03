# 02 - Babel, ES6, ESLint, Flow

We're now going to use some ES6 syntax, which is a great improvement over the "old" ES5 syntax. All browsers and JS environments understand ES5 well, but not ES6. That's where a tool called Babel comes to the rescue!

## Babel

> 💡 **[Babel](https://babeljs.io/)** is a compiler that transforms ES6 code (and other things like React's JSX syntax) into ES5 code. It is very modular and can be used in tons of different [environments](https://babeljs.io/docs/setup/). It is by far the preferred ES5 compiler of the React community.

- Move your `index.js` into a new `src` folder. This is where you will write your ES6 code. Remove the previous `color`-related code in `index.js`, and replace it with a simple:

```javascript
const str = 'ES6';
console.log(`Hello ${str}`);
```

We're using a *template string* here, which is an ES6 feature that lets us inject variables directly inside the string without concatenation using `${}`. Note that template strings are created using **backquotes**.

- Run `yarn add --dev babel-cli` to install the CLI interface for Babel.

Babel CLI comes with [two executables](https://babeljs.io/docs/usage/cli/): `babel`, which compiles ES6 files into new ES5 files, and `babel-node`, which you can use to replace your call to the `node` binary and execute ES6 files directly on the fly. `babel-node` is great for development but it is heavy and not meant for production. In this chapter we are going to use `babel-node` to set up the development environment, and in the next one we'll use `babel` to build ES5 files for production.

- In `package.json`, in your `start` script, replace `node .` by `babel-node src` (`index.js` is the default file Node looks for, which is why we can omit `index.js`).

If you try to run `yarn start` now, it should print the correct output, but Babel is not actually doing anything. That's because we didn't give it any information about which transformations we want to apply. The only reason it prints the right output is because Node natively understands ES6 without Babel's help. Some browsers or older versions of Node would not be so successful though!

- Run `yarn add --dev babel-preset-latest` to install a Babel preset package containing configurations for the most recent ECMAScript features supported by Babel.

- In `package.json`, add a `babel` field for the Babel configuration. Make it use the `latest` Babel preset like this:

```json
"babel": {
  "presets": [
    "latest"
  ]
},
```

**Note**: A `.babelrc` file at the root of your project could also be used instead of the `babel` field of `package.json`, but since your root folder will get more and more bloated over time, I would recommend to keep the Babel config in `package.json` until it grows too large.

- `yarn start` should still work, but it's actually doing something now. We can't really tell if it is though, since we're using `babel-node` to interpret ES6 code on the fly. You'll soon have a proof that your ES6 code is actually transformed when you reach the [ES6 modules syntax](##the-es6-modules-syntax) section of this chapter.

## Watching for file changes

We now have the basic compilation working, but we need to run `yarn start` manually every time. Let's make this environment a bit more usable by creating a `watch` task to automatically re-execute our code every time we make a change:

```json
"scripts": {
  "start": "yarn run watch",
  "watch": "watch 'yarn run main' src --interval=1",
  "main": "babel-node src"
},
```

### `main` and `watch`

`main` is the task that will run a one-shot execution of our entire pipeline. Right now it is just executing `babel-node`, but many pre-requisite tasks will be added to it later.

`watch` is going to trigger `main` every time a file changes in `src`. We use the `[watch](https://www.npmjs.com/package/watch)` package to monitor file changes, which you need to install:

- Run `yarn add --dev watch`.

**Note**: The `interval` option is the duration in seconds between file change checks. The default value is a bit too slow to my taste, so I use `1` second, which seems reasonable. You can use decimal numbers like `0.5` as well.

We set the default `yarn start` task to run the `watch` task, because that's the task you will want to run most of the time. If you want to run `main` just one time, you can still do `yarn run main`.

Alright, we're now good to go.

- Run `yarn start`. It should print "Hello ES6" and start watching for changes. Try modifying `src/index.js` to make sure the `main` task is triggered again when you save.

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

- Run `yarn start` and it should print "Wah wah, I am Toby".

### The ES6 modules syntax

Here we simply replace `const Dog = require('./dog');` by `import Dog from './dog';`, which is the newer ES6 modules syntax (as opposed to "CommonJS" modules syntax). It is currently not natively supported by NodeJS, so this is your proof that Babel processes those ES6 files correctly.

In `dog.js`, we also replace `module.exports = Dog;` by `export default Dog;`.

Note that in `dog.js`, the name `Dog` is only used in the `export`. Therefore it could be possible to export directly an anonymous class like this instead:

```javascript
// Dog
export default class {
  constructor(name) {
    this.name = name;
  }

  bark() {
    return `Wah wah, I am ${this.name}`;
  }
}
```

You might now guess that the name `Dog` used in the `import` in `index.js` is actually completely up to you. This would work just fine:

```javascript
import Cat from './dog'; // Don't do this

const toby = new Cat('Toby');
```

Obviously, most of the time you will use the same name as the class / module you're importing. Anyway!

- `yarn start` should still print "Wah wah, I am Toby".

## ESLint

> 💡 **[ESLint](http://eslint.org)** is the linter of choice for ES6 code. A linter gives you recommendations about code formatting, which enforces style consistency in your code, and code you share with your team. It's also a great way to learn about JavaScript by making mistakes that ESLint will catch.

ESLint works with *rules*, and there are [many of them](http://eslint.org/docs/rules/). Instead of configuring the rules we want for our code ourselves, we will use the config created by Airbnb. This config uses a few plugins, so we need to install those as well to use their config.

Check out Airbnb's most recent [instructions](https://www.npmjs.com/package/eslint-config-airbnb) to install the config package and all its dependencies correctly. As of 2016-11-11, they recommend using the following command in your terminal:

```bash
npm info eslint-config-airbnb@latest peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add --dev eslint-config-airbnb@latest
```

It should install everything you need and add `eslint-config-airbnb`,  `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` to your `package.json` file automatically.

**Note**: I've replaced `npm install` by `yarn add` in this command. Also, this won't work on Windows, so take a look at the `package.json` file of this repository and just install all the ESLint-related dependencies manually using `yarn add --dev packagename@^#.#.#` with `#.#.#` being the versions given in `package.json` for each package.

In `package.json`, add an `eslintConfig` field like so:

```json
"eslintConfig": {
  "extends": "airbnb"
},
```

**Note**: An `.eslintrc.js`, `.eslintrc.json`, or `.eslintrc.yaml` file at the root of your project could also be used instead of the `eslintConfig` field of `package.json`. Just like for the Babel configuration, we try to avoid bloating the root folder with too many files, but if you have a complex ESLint config, consider this alternative.

We'll create an NPM/Yarn script to runs ESLint. Let's install the `eslint` package to be able to use the `eslint` CLI:

- Run `yarn add --dev eslint`

Update the `scripts` of your `package.json` to include a new `lint` task in the `main` pipeline:

```json
"scripts": {
  "start": "yarn run watch",
  "watch": "watch 'yarn run main' src --interval=1",
  "main": "yarn run lint && babel-node src",
  "lint": "eslint src/**/*.js"
},
```

Here we just tell ESLint that the files we want to lint are all the `.js` files under `src`, pretty explicit.

- Run `yarn start`, and you should see a warning for using `console.log()` in `index.js`. Let's say that we want this `console.log()` to be valid in `index.js` instead of triggering a warning in this example. Add `/* eslint-disable no-console */` at the top of our `index.js` file to allow the use of `console` in this file.

- Run `yarn start` and we are now all clear!

**Note**: This section sets you up with ESLint in the console. It is great for catching errors at build time / before pushing, but you also probably want it integrated to your IDE. Do NOT use your IDE's native linting for ES6. Configure it so the binary it uses for linting is the one in your `node_modules` folder. This way it can use all of your project's config, the Airbnb preset, etc. Otherwise you will just get a generic ES6 linting.

## Flow

> 💡 **[Flow](https://flowtype.org/)**: A static type checker by Facebook. It detects inconsistent types in your code. For instance, it will give you an error if you try to use a string where should be using a number.

Right now, our JavaScript code is valid ES6 code. Flow can analyze plain JavaScript to give us some insights, but in order to use its full power, we need to add type annotations in our code, which will make it non-standard. We need to teach Babel and ESLint what those type annotations are in order for these tools to not freak out when parsing our files.

- Run `yarn add --dev flow-bin babel-preset-flow babel-eslint eslint-plugin-flowtype`.

`flow-bin` is the binary to run Flow in our `scripts` tasks, `babel-preset-flow` is the preset for Babel to understand Flow annotations, `babel-eslint` is a package to enable ESLint *to rely on Babel's parser* instead of its own, and `eslint-plugin-flowtype` is an ESLint plugin to lint Flow annotations. Phew.

- Update your `package.json` file with the following configuration for `babel` and `eslintConfig`:

```json
"babel": {
  "presets": [
    "latest",
    "flow"
  ]
},
"eslintConfig": {
  "extends": [
    "airbnb",
    "plugin:flowtype/recommended"
  ],
  "plugins": [
    "flowtype"
  ]
},
```

**Note**: The `plugin:flowtype/recommended` contains the instruction for ESLint to use Babel's parser. If you want to be more explicit, feel free to add `"parser": "babel-eslint"` under `eslintConfig`.

I know this is a lot to take in, so take a minute to think about it. I'm still amazed that it is even possible for ESLint to use Babel's parser to understand Flow annotations. These 2 tools are really incredible for being so modular.

- Create a `typecheck` task to run `flow` and add it to the task chain of your `main` script:

```json
"scripts": {
  "start": "yarn run watch",
  "watch": "watch 'yarn run main' src --interval=1",
  "main": "yarn run typecheck && yarn run lint && babel-node src",
  "lint": "eslint src/**/*.js",
  "typecheck": "flow"
},
```

- Create an empty `.flowconfig` file at the root of your project.

Alright, we should be all set for the configuration part.

- Add Flow annotations to `src/dog.js` like so:

```javascript
// @flow

class Dog {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  bark() {
    return `Wah wah, I am ${this.name}`;
  }
}

export default Dog;
```

The `// @flow` comment tells Flow that we want this file to be typechecked. For the rest, Flow annotations are typically a colon after a function parameter or a function name. Check out the documentation for more details.

- Add `// @flow` at the top of `index.js` as well.

`yarn start` should now both lint and typecheck your code fine.

There are 2 things that I want you to try:

- Replace `constructor(name: string)` by `constructor(name: number)`, and run `yarn start`. You should get a **Flow** error telling you that those types are incompatible. That means Flow is set up correctly.

- Now replace `constructor(name: string)` by `constructor(name:string)`, and run `yarn start`. You should get an **ESLint** error telling you that Flow annotations should have a space after the colon. That means the Flow plugin for ESLint is set up correctly.

If you got the 2 different errors working, you are all set with Flow and ESLint!

Next section: [03 - Express, PM2](/tutorial/03-express-pm2)

Back to the [previous section](/tutorial/01-node-yarn-package-json) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
