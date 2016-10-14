# 11 - Testing with Mocha, Chai, and Sinon

## Mocha and Chai

- Create an `src/test` folder. This folder will mirror our application folder structure, so create a `src/test/client` folder as well (feel free to add `server` and `shared` if you want, but we're not going to write tests for these).

- In `src/test/client`, create a `state-test.js` file, which we are going to use to test our Redux application life cycle.

We are going to use [Mocha](http://mochajs.org/) as our main testing framework. Mocha is easy to use, has tons of features, and is currently the [most popular JavaScript testing framework](http://stateofjs.com/2016/testing/). It is very flexible and modular. In particular, it lets you use any assertion library you want. [Chai](http://chaijs.com/) is a great assertion library that has a lot of [plugins](http://chaijs.com/plugins/) available and lets you choose between different assertion styles.

- Let's install Mocha and Chai by running `npm install --save-dev mocha chai`

In `state-test.js`, write the following:

```javascript
/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */

import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import { should } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import dogReducer from '../../client/reducers/dog-reducer';
import { makeBark } from '../../client/actions/dog-actions';

should();
let store;

describe('App State', () => {
  describe('Dog', () => {
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
});
```
Alright, let's analyze this whole thing.

First, notice how we import the `should` assertion style from `chai`. This lets us assert things using a syntax like `mynumber.should.equal(3)`, pretty neat. In order to be able to call `should` on any object, we need to run the function `should()` before anything. Some of these assertion are *expressions*, like `mybook.should.be.true`, which will make ESLint grumpy, so we've added an ESLint comment at the top to disable the `no-unused-expressions` rule in this file.

Mocha tests work like a tree. In our case, we want to test the `makeBark` function which should affect the `dog` attribute of the application state, so it makes sense to use the following hierarchy of tests: `App State > Dog > makeBark`, that we declare using `describe()`. `it()` is the actual test function and `beforeEach()` is a function that is executed before each `it()` test. In our case, we want a fresh new store before running each test. We declare a `store` variable at the top of the file because it should be useful in every test of this file.

Our `makeBark` test is very explicit, and the description provided as a string in `it()` makes it even clearer: we test that `hasBarked` go from `false` to `true` after calling `makeBark`.

Alright, let's run this test!

- Create the following `test` task, which relies on the `gulp-mocha` plugin:

```javascript
import mocha from 'gulp-mocha';

const paths = {
  // [...]
  allLibTests: 'lib/test/**/*.js',
};

// [...]

gulp.task('test', ['build'], () =>
  gulp.src(paths.allLibTests)
    .pipe(mocha())
);
```

- Run `npm install --save-dev gulp-mocha` of course.

As you can see, tests are run on transpiled code in `lib`, which is why `build` is a prerequisite task of `test`. `build` also has a prerequisite, `lint`, and finally, we are making `test` a prerequisite of `main`, which gives us the following task cascade for the `default` task: `lint` > `build` > `test` > `main`.

- Change the prerequisite of `main` to `test`:

```javascript
gulp.task('main', ['test'], () => /* ... */ );
```

- In `package.json`, replace the current `"test"` script by: `"test": "gulp test"`. This way you can use `npm test` to just run your tests. `npm test` is also the standard command that will be automatically called by tools like continuous integration services for instance, so you should always bind your test task to it. `npm start` will run the tests before building the Webpack client bundle as well, so it will only build it if all tests pass.

- Run `npm test` or `npm start`, and it should print the result for our test, hopefully green.

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

- Create a new `src/test/shared/dog-test.js` file, and add write the following:

```javascript
/* eslint-disable import/no-extraneous-dependencies, no-console */

import chai from 'chai';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { describe, it } from 'mocha';
import Dog from '../../shared/dog';

chai.should();
chai.use(sinonChai);

describe('Shared', () => {
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
});
```

Here, we are using *stubs* from Sinon, and a Chai plugin to be able to use Chai assertions on Sinon stubs and such.

- Run `npm install --save-dev sinon sinon-chai` to install these libraries.

So what is new here? Well first of all, we call `chai.use(sinonChai)` to activate the Chai plugin. Then, all the magic happens in the `it()` statement: `stub(console, 'log')` is going to neutralize `console.log` and monitor it. When `new Dog('Test Toby').barkInConsole()` is executed, a `console.log` is normally supposed to happen. We test this call to `console.log` with `console.log.should.have.been.calledWith()`, and finally, we `restore` the neutralized `console.log` to make it work normally again.

**Important note**: Stubbing `console.log` is not recommended, because if the test fails, `console.log.restore()` is never called, and therefore `console.log` will remain broken for the rest of the command you executed in your terminal! It won't even print the error message that caused the test to fail, so it leaves you with very little information about what happened. That can be quite confusing. It is a good example to illustrate stubs in this simple app though.

If everything went well in this chapter, you should have 2 passing tests.

Next section: [12 - Type Checking with Flow](/tutorial/12-flow)

Back to the [previous section](/tutorial/10-immutable-redux-improvements) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
