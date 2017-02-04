# 02 - Babel, ES6, ESLint, Flow

We're now going to use some ES6 syntax, which is a great improvement over the "old" ES5 syntax. All browsers and JS environments understand ES5 well, but not ES6. That's where a tool called Babel comes to the rescue!

## Babel

> 💡 **[Babel](https://babeljs.io/)** is a compiler that transforms ES6 code (and other things like React's JSX syntax) into ES5 code. It is very modular and can be used in tons of different [environments](https://babeljs.io/docs/setup/). It is by far the preferred ES5 compiler of the React community.

- Move your `index.js` into a new `src` folder. This is where you will write your ES6 code. Remove the previous `color`-related code in `index.js`, and replace it with a simple:

```javascript
const str = 'ES6'
console.log(`Hello ${str}`)
```

We're using a *template string* here, which is an ES6 feature that lets us inject variables directly inside the string without concatenation using `${}`. Note that template strings are created using **backquotes**.

- Run `yarn add --dev babel-cli` to install the CLI interface for Babel.

Babel CLI comes with [two executables](https://babeljs.io/docs/usage/cli/): `babel`, which compiles ES6 files into new ES5 files, and `babel-node`, which you can use to replace your call to the `node` binary and execute ES6 files directly on the fly. `babel-node` is great for development but it is heavy and not meant for production. In this chapter we are going to use `babel-node` to set up the development environment, and in the next one we'll use `babel` to build ES5 files for production.

- In `package.json`, in your `start` script, replace `node .` by `babel-node src` (`index.js` is the default file Node looks for, which is why we can omit `index.js`).

If you try to run `yarn start` now, it should print the correct output, but Babel is not actually doing anything. That's because we didn't give it any information about which transformations we want to apply. The only reason it prints the right output is because Node natively understands ES6 without Babel's help. Some browsers or older versions of Node would not be so successful though!

- Run `yarn add --dev babel-preset-latest` to install a Babel preset package containing configurations for the most recent ECMAScript features supported by Babel.

- Create a `.babelrc` file at the root of your project, which is a JSON file for your Babel configuration. Write the following to it to make Babel use the `latest` preset:

```json
{
  "presets": [
    "latest"
  ]
}
```

- `yarn start` should still work, but it's actually doing something now. We can't really tell if it is though, since we're using `babel-node` to interpret ES6 code on the fly. You'll soon have a proof that your ES6 code is actually transformed when you reach the [ES6 modules syntax](#the-es6-modules-syntax) section of this chapter.

## ES6

> 💡 **[ES6](http://es6-features.org/)**: The most significant improvement of the JavaScript language. There are too many ES6 features to list them here but typical ES6 code uses classes with `class`, `const` and `let`, template strings, and arrow functions (`(param) => { console.log('Hi'); }`).

### Creating an ES6 class

- Create a new file, `src/dog.js`, containing the following ES6 class:

```javascript
class Dog {
  constructor(name) {
    this.name = name
  }

  bark() {
    return `Wah wah, I am ${this.name}`
  }
}

module.exports = Dog
```

It should not look surprising to you if you've done OOP in the past in any language. It's relatively recent for JavaScript though. The class is exposed to the outside world via the `module.exports` assignment.

In `src/index.js`, write the following:

```javascript
const Dog = require('./dog')

const toby = new Dog('Toby')

console.log(toby.bark())
```

As you can see, unlike the community-made package `color` that we used before, when we require one of our files, we use `./` in the `require()`.

- Run `yarn start` and it should print "Wah wah, I am Toby".

### The ES6 modules syntax

Here we simply replace `const Dog = require('./dog')` by `import Dog from './dog'`, which is the newer ES6 modules syntax (as opposed to "CommonJS" modules syntax). It is currently not natively supported by NodeJS, so this is your proof that Babel processes those ES6 files correctly.

In `dog.js`, we also replace `module.exports = Dog` by `export default Dog`.

- `yarn start` should still print "Wah wah, I am Toby".

## ESLint

> 💡 **[ESLint](http://eslint.org)** is the linter of choice for ES6 code. A linter gives you recommendations about code formatting, which enforces style consistency in your code, and code you share with your team. It's also a great way to learn about JavaScript by making mistakes that ESLint will catch.

ESLint works with *rules*, and there are [many of them](http://eslint.org/docs/rules/). Instead of configuring the rules we want for our code ourselves, we will use the config created by Airbnb. This config uses a few plugins, so we need to install those as well to use their config.

Check out Airbnb's most recent [instructions](https://www.npmjs.com/package/eslint-config-airbnb) to install the config package and all its dependencies correctly. As of 2017-02-03, they recommend using the following command in your terminal:

```bash
npm info eslint-config-airbnb@latest peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add --dev eslint-config-airbnb@latest
```

It should install everything you need and add `eslint-config-airbnb`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` to your `package.json` file automatically.

**Note**: I've replaced `npm install` by `yarn add` in this command. Also, this won't work on Windows, so take a look at the `package.json` file of this repository and just install all the ESLint-related dependencies manually using `yarn add --dev packagename@^#.#.#` with `#.#.#` being the versions given in `package.json` for each package.

Create an `.eslintrc.json` file at the root of your project, just like we did for Babel, and write the following to it:

```json
{
  "extends": "airbnb"
}
```

We'll create an NPM/Yarn script to runs ESLint. Let's install the `eslint` package to be able to use the `eslint` CLI:

- Run `yarn add --dev eslint`

Update the `scripts` of your `package.json` to include a new `test` task:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src"
},
```

Here we just tell ESLint that want to lint all JavaScript files under the `src` folder.

We will use this standard `test` task to run a chain of all the commands that validate our code, whether it's linting, typechecking, or unit testing.

- Run `yarn test`, and you should see a whole bunch of errors for missing semicolons, and a warning for using `console.log()` in `index.js`. Add `/* eslint-disable no-console */` at the top of our `index.js` file to allow the use of `console` in this file.

### Semicolons

Alright, this is probably the most heated debate in the JavaScript community, let's talk about it for a minute. JavaScript has this thing called Automatic Semicolon Insertion, which allows you to write your code with or without semicolons. It really comes down to personal preference and there is no right and wrong on this topic. If you like the syntax of Python, Ruby, or Scala, you will probably enjoy omitting semicolons. If you prefer the syntax of Java, C#, or PHP, you will probably prefer using semicolons.

Most people write JavaScript with semicolons, out of habit. That was my case until I tried going semicolon-less after seeing code samples from the Redux documentation. At first it felt a bit weird, simply because I was not used to it. After just one day of writing code this way I could not see myself going back to using semicolons at all. They felt so cumbersome and unnecessary. A semicolon-less code is easier on the eyes in my opinion, and is faster to type.

I recommend reading the [ESLint documentation about semicolons](http://eslint.org/docs/rules/semi). As mentioned in this page, if you're going semicolon-less, there are some rather rare cases where semicolons are required. ESLint can protect you from such cases with the `no-unexpected-multiline` rule. Let's set up ESLint to safely go semicolon-less in `.eslintrc.json`:

```json
{
  "extends": "airbnb",
  "rules": {
    "semi": [2, "never"],
    "no-unexpected-multiline": 2
  }
}
```

- Run `yarn run lint`, and it should now pass successfully. Try adding an unnecessary semicolon somewhere to make sure the rule is set up correctly.

I am aware that some of you will want to keep using semicolons, which will make the code provided in this tutorial inconvenient. If you are using this tutorial just for learning, I'm sure it will remain bearable to learn without semicolons, until going back to using them on your real projects. If you want to use the code provided in this tutorial as a boilerplate though, it will require a bit of rewriting, which should be pretty quick with ESLint set to enforce semicolons to guide you through the process. I apologize if you're in such case.

### ESLint in your editor

This chapter set you up with ESLint in the terminal, which is great for catching errors at build time / before pushing, but you also probably want it integrated to your IDE for immediate feedback. Do NOT use your IDE's native ES6 linting. Configure it so the binary it uses for linting is the one in your `node_modules` folder instead. This way it can use all of your project's config, the Airbnb preset, etc. Otherwise you will just get some generic ES6 linting.

## Flow

> 💡 **[Flow](https://flowtype.org/)**: A static type checker by Facebook. It detects inconsistent types in your code. For instance, it will give you an error if you try to use a string where should be using a number.

Right now, our JavaScript code is valid ES6 code. Flow can analyze plain JavaScript to give us some insights, but in order to use its full power, we need to add type annotations in our code, which will make it non-standard. We need to teach Babel and ESLint what those type annotations are in order for these tools to not freak out when parsing our files.

- Run `yarn add --dev flow-bin babel-preset-flow babel-eslint eslint-plugin-flowtype`.

`flow-bin` is the binary to run Flow in our `scripts` tasks, `babel-preset-flow` is the preset for Babel to understand Flow annotations, `babel-eslint` is a package to enable ESLint *to rely on Babel's parser* instead of its own, and `eslint-plugin-flowtype` is an ESLint plugin to lint Flow annotations. Phew.

- Update your `.babelrc` file like so:

```json
{
  "presets": [
    "latest",
    "flow"
  ]
}
```

- And update `.eslintrc.json` as well:

```json
{
  "extends": [
    "airbnb",
    "plugin:flowtype/recommended"
  ],
  "plugins": [
    "flowtype"
  ],
  "env": {
    "browser": true
  },
  "rules": {
    "semi": [2, "never"],
    "no-unexpected-multiline": 2
  }
}
```

**Note**: The `plugin:flowtype/recommended` contains the instruction for ESLint to use Babel's parser. If you want to be more explicit, feel free to add `"parser": "babel-eslint"` in `.eslintrc.json`.

I know this is a lot to take in, so take a minute to think about it. I'm still amazed that it is even possible for ESLint to use Babel's parser to understand Flow annotations. These 2 tools are really incredible for being so modular.

- Chain `flow` to your `test` task:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src && flow"
},
```

- Create an empty `.flowconfig` file at the root of your project.

Alright, we should be all set for the configuration part.

- Add Flow annotations to `src/dog.js` like so:

```javascript
// @flow

class Dog {
  name: string

  constructor(name: string) {
    this.name = name
  }

  bark() {
    return `Wah wah, I am ${this.name}`
  }
}

export default Dog
```

The `// @flow` comment tells Flow that we want this file to be typechecked. For the rest, Flow annotations are typically a colon after a function parameter or a function name. Check out the documentation for more details.

- Add `// @flow` at the top of `index.js` as well.

`yarn start` should now both lint and typecheck your code fine.

There are 2 things that I want you to try:

- Replace `constructor(name: string)` by `constructor(name: number)`, and run `yarn start`. You should get a **Flow** error telling you that those types are incompatible. That means Flow is set up correctly.

- Now replace `constructor(name: string)` by `constructor(name:string)`, and run `yarn start`. You should get an **ESLint** error telling you that Flow annotations should have a space after the colon. That means the Flow plugin for ESLint is set up correctly.

If you got the 2 different errors working, you are all set with Flow and ESLint!

### Flow in your editor

Just like with ESLint, you should spend some time configuring your Editor / IDE to give you immediate feedback when Flow detects issues in your code.

## Git Hooks with Husky

> 💡 **[Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)**: Scripts that are run when certain actions like a commit or a push occur.

Okay so we now have this neat `test` task that tells us if our code looks good or not. We're going to set up Git Hooks to automatically run this task before every `git commit` and `git push`, which will prevent us from pushing bad code to the repository if it doesn't pass the `test` task.

[Husky](https://github.com/typicode/husky) is a package that makes this very easy to set up Git Hooks.

- Run `yarn add --dev husky`.

All we have to do is to create two new tasks in `scripts`, `precommit` and `prepush`:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src && flow",
  "precommit": "yarn test",
  "prepush": "yarn test"
},
```

If you now try to commit or push your code, it should automatically run the `test` task.

Next section: [03 - Express, PM2](/tutorial/03-express-pm2)

Back to the [previous section](/tutorial/01-node-yarn-package-json) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
