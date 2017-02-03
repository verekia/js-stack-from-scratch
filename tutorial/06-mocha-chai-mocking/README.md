# 06 - Testing with Mocha, Chai, and Sinon

**This is the last chapter of the tutorial. The final code is available in the [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate).**

## Mocha and Chai

- In `src/client/reducers`, create a `dog-reducer.test.js` file, which we are going to use to test if our reducer is doing its job when dispatching the `makeBark` action.

We are going to use [Mocha](http://mochajs.org/) as our main testing framework. Mocha is easy to use, has tons of features, and is currently the [most popular JavaScript testing framework](http://stateofjs.com/2016/testing/). It is very flexible and modular. In particular, it lets you use any assertion library you want. [Chai](http://chaijs.com/) is a great assertion library that has a lot of [plugins](http://chaijs.com/plugins/) available and lets you choose between different assertion styles.

- Let's install Mocha and Chai by running `yarn add --dev mocha chai`

In `dog-reducer.test.js`, write the following:

```javascript
/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */

import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import { should } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import dogReducer from './dog-reducer';
import { makeBark } from '../actions/dog-actions';

should();
let store;

describe('Dog Reducer', () => {
  beforeEach(() => {
    store = createStore(combineReducers({
      dog: dogReducer,
    }));
  });
  describe('makeBark', () => {
    it('should make hasBarked go from false to true', () => {
      store.getState().getIn(['dog', 'hasBarked']).should.be.false;
      store.dispatch(makeBark());
      store.getState().getIn(['dog', 'hasBarked']).should.be.true;
    });
  });
});
```

Alright, let's analyze this whole thing.

First, notice how we import the `should` assertion style from `chai`. This lets us assert things using a syntax like `mynumber.should.equal(3)`, pretty neat. In order to be able to call `should` on any object, we need to run the function `should()` before anything. Some of these assertion are *expressions*, like `mybook.should.be.true`, which will make ESLint grumpy, so we've added an ESLint comment at the top to disable the `no-unused-expressions` rule in this file.

`describe()` is used to name sections for our tests. You can nest them like a tree. In our case, 2 levels-deep (`Dog Reducer` and `makeBark`) is enough. `it()` is the actual test function and `beforeEach()` is a function that is executed before each `it()` test. In this example, we initialize a fresh new store before running each test. We declare a `store` variable at the top of the file because it should be useful in every test of this file.

Our `makeBark` test is very explicit, and the description provided as a string in `it()` makes it even clearer: we test that `hasBarked` go from `false` to `true` after calling `makeBark`.

Alright, let's run this test!

- In `gulpfile.babel.js`, create the following `test` task, which relies on the `gulp-mocha` plugin:

```javascript
import mocha from 'gulp-mocha';

const paths = {
  // [...]
  allTests: 'src/**/*.test.js?(x)',
};

// [...]

gulp.task('test', () =>
  gulp.src(paths.allTests)
    .pipe(mocha())
);
```

- Run `yarn add --dev gulp-mocha` of course.

- Add `test` as a prerequisite of `build`, and make `build` the prerequisite of `main`:

```javascript
gulp.task('build', ['lint', 'test', 'clean'], () => /* ... */)

// [...]

gulp.task('main', ['build'], () => /* ...*/)
```

- In `package.json`, replace the current `"test"` script by: `"test": "gulp lint test"`. This way you can use `yarn test` to just run your tests and linter. `test` is also the standard `package.json` script that will be automatically called by tools like continuous integration services for instance, so you should always bind your test task to it. `yarn start` will run the tests before building the Webpack client bundle as well, so it will only build it if all tests pass.

- Run `yarn test` or `yarn start`, and it should print the result for our test, hopefully green.

**Note**: You might wonder how Mocha is able to evaluate ES6 code here. The `gulp-mocha` documentation states that it can be made possible by adding the [Babel Require Hook](https://babeljs.io/docs/usage/require/) at the top of our Gulpfile, via `require('babel-register');`. Okay, that sounds pretty good, but we haven't even done that, so what's going on here? The magic that is happening is that `babel-register` is automatically called because our Gulpfile is named `gulpfile.babel.js`, so we don't even need to require `babel-register`. You can actually see the require hook being applied automatically every time you run Gulp in your console, as it prints: `Requiring external module babel-register`. Pretty neat.

## Sinon

In some cases, we want to be able to *fake* things in a unit test. For instance, let's say we have a function, `deleteEverything`, which contains a call to `deleteDatabases()`. Running `deleteDatabases()` causes a lot of side-effects, which we absolutely don't want to happen when running our test suite.

[Sinon](http://sinonjs.org/) is a testing library that offers **Stubs** (and a lot of other things), which allow us to neutralize `deleteDatabases` and simply monitor it without actually calling it. This way we can test if it got called, or which parameters it got called with for instance. This is typically very useful to fake or avoid AJAX calls - which can cause side-effects on the back-end.

In the context of our app, we are going to add a `barkInConsole` method to our `Dog` class in `src/shared/dog.js`:

```javascript
class Dog {
  constructor(name) {
    this.name = name;
  }

  bark() {
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

If we run `barkInConsole` in a unit test, `console.log()` will print things in the terminal. We are going to consider this to be an undesired side-effect in the context of our unit tests. We are interested in knowing if `console.log()` *would have normally been called* though, and we want to test what parameters it *would have been called with*.

- Create a new `src/shared/dog.test.js` file, and add write the following:

```javascript
/* eslint-disable import/no-extraneous-dependencies, no-console */

import chai from 'chai';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { describe, it } from 'mocha';
import Dog from './dog';

chai.should();
chai.use(sinonChai);

describe('Dog', () => {
  describe('barkInConsole', () => {
    it('should print a bark string with its name', () => {
      stub(console, 'log');
      new Dog('Test Toby').barkInConsole();
      console.log.should.have.been.calledWith('Wah wah, I am Test Toby');
      console.log.restore();
    });
  });
});
```

Here, we are using *stubs* from Sinon, and a Chai plugin to be able to use Chai assertions on Sinon stubs and such.

- Run `yarn add --dev sinon sinon-chai` to install these libraries.

So what is new here? Well first of all, we call `chai.use(sinonChai)` to activate the Chai plugin. Then, all the magic happens in the `it()` statement: `stub(console, 'log')` is going to neutralize `console.log` and monitor it. When `new Dog('Test Toby').barkInConsole()` is executed, a `console.log` is normally supposed to happen. We test this call to `console.log` with `console.log.should.have.been.calledWith()`, and finally, we `restore` the neutralized `console.log` to make it work normally again.

**Important note**: Stubbing `console.log` is not recommended, because if the test fails, `console.log.restore()` is never called, and therefore `console.log` will remain broken for the rest of the command you executed in your terminal! It won't even print the error message that caused the test to fail, so it leaves you with very little information about what happened. That can be quite confusing. It is a good example to illustrate stubs in this simple app though.

If everything went well in this chapter, you should have 2 passing tests.

**This is the last chapter of the tutorial. The final code is available in the [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate).**

Back to the [previous section](/tutorial/10-immutable-redux-improvements) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
