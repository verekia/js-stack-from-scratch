# 12 - Testing with Mocha and Chai

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

Just like regular code, we are going to need to transpile this `state-test.js` from ES6 to ES5. This file also relies on code located under `src/client`, which is currently only built by Webpack. Remember how I made you split the Gulp `build` task into `build-server` and `build-client` back in [Chapter 7](/7-client-browserify)? We'll we're going to undo that! Our tests need the entire codebase to be available in `/lib`, so let's bring back the full `build` task instead of the more-specific `build-server` in `gulpfile.js`:

```javascript
gulp.task('build', ['lint'], () =>
  gulp.src([
    'src/**/*.js',
    'src/**/*.jsx',
  ])
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);
```

- Now we can create the following `test` task, which relies on the `gulp-mocha` plugin:

```javascript
gulp.task('test', ['lint', 'build'], () =>
  gulp.src('lib/test/**/*.js')
    .pipe(mocha())
);
```

- Run `npm install --save-dev gulp-mocha` of course.

- In `package.json`, replace the current `"test"` script by: `"test": "gulp test"`. This way you can use `npm test` to just run your tests. I personally like to run my tests every time I `npm start` to catch bugs early, so you can also replace your `start` script by `gulp test && webpack`. Linting is run automatically because it's a prerequisite of the Gulp `test` task.

- Run `npm test` or `npm start`, and it should print the result for our test, hopefully green.

Next section: [13 - Type Checking with Flow](/13-flow)

Back to the [previous section](/11-immutable-redux-improvements) or the [table of contents](https://github.com/verekia/modern-js-stack-training).
