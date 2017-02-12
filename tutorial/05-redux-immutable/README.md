# 05 - Redux and Immutable

In this chapter we will hook up React and Redux to make a very simple app. The app will consist of a message and a button. The message changes when the user clicks the button.

Before we start, here is a very quick introduction to ImmutableJS, which is completely unrelated to React and Redux, but will be used in this chapter.

## ImmutableJS

> 💡 **[ImmutableJS](https://facebook.github.io/immutable-js/)** (or just Immutable) is a library by Facebook to manipulate immutable collections, like lists and maps. Any change made on an immutable object returns a new object without mutating the original object.

For instance, instead of doing:

```javascript
const obj = { a: 1 }
obj.a = 2 // Mutates `obj`
```

You would do:

```javascript
const obj = Immutable.Map({ a: 1 })
obj.set('a', 2) // Returns a new object without mutating `obj`
```

This approach follows the **functional programming** paradigm, which works really well with Redux.

When creating immutable collections, a very convenient method is `Immutable.fromJS()`, which takes any regular JS object or array and returns a deeply immutable version of it:

```javascript
const immutablePerson = Immutable.fromJS({
  name: 'Stan',
  friends: ['Kyle', 'Cartman', 'Kenny'],
})

console.log(immutablePerson)

/*
 * Map {
 *   "name": "Stan",
 *   "friends": List [ "Kyle", "Cartman", "Kenny" ]
 * }
 */
```

- Run `yarn add immutable`.

**Note**: Due to the implementation of ImmutableJS, Flow does not accept importing it with `import Immutable from 'immutable'`, so use this syntax instead: `import * as Immutable from 'immutable'`. Let's cross fingers for a [fix](https://github.com/facebook/immutable-js/issues/863) soon.

## Redux

> 💡 **[Redux](http://redux.js.org/)** is a library to handle the lifecycle of your application. It creates a *store*, which is the single source of truth of the state of your app at any given time.

Let's start with the easy part, declaring our Redux actions:

- Run `yarn add redux redux-actions`.

- Create a `src/client/action/dog.js` file containing:

```javascript
// @flow

import { createAction } from 'redux-actions'

export const BARK = 'BARK'
export const bark = createAction(BARK)
```

This file exposes an *action*, `BARK`, and its *action creator*, `bark`, which is a function. We use `redux-actions` to reduce the boilerplate associated with Redux actions. `redux-actions` implement the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) model, which makes *action creators* return objects with the `type` and `payload` attributes.

- Create a `src/client/reducer/dog.js` file containing:

```javascript
// @flow

import * as Immutable from 'immutable'

import { BARK } from '../action/dog'

const initialState = Immutable.fromJS({
  barkMessage: 'The dog is quiet',
})

const dogReducer = (state: Object = initialState, action: { type: string, payload: any }) => {
  switch (action.type) {
    case BARK:
      return state.set('barkMessage', action.payload)
    default:
      return state
  }
}

export default dogReducer
```

In this file we initialize the state of our reducer with an Immutable Map containing one property, `barkMessage`, set to `The dog is quiet`. The `dogReducer` handles `BARK` actions by simply setting the new `barkMessage` with the action payload. The Flow annotation for `action` destructures it into a `type` and a `payload`. The `payload` can be of `any` type. It looks funky if you've never seen this before, but it remains pretty understandable. Note the usage of `Immutable.fromJS()` and `set()` as seen before.

## React-Redux

> 💡 **[react-redux](https://github.com/reactjs/react-redux)** *connects* a Redux store with React components. With `react-redux`, when the Redux store changes, React components get automatically updated. They can also fire Redux actions.

- Run `yarn add react-redux`.

In this section we are going to create *Components* and *Containers*.

**Components** are *dumb* React components, in a sense that they don't know anything about the Redux state. **Containers** are *smart* components that know about the state and that we are going to *connect* to our dumb components.

- Create a `src/client/component/bark-button.jsx` file containing:

```javascript
// @flow

import React, { PropTypes } from 'react'

const BarkButton = ({ bark }: { bark: Function }) =>
  <button onClick={bark}>Bark</button>

BarkButton.propTypes = {
  bark: PropTypes.func.isRequired,
}

export default BarkButton
```

- Create a `src/client/component/message.jsx` file containing:

```javascript
// @flow

import React, { PropTypes } from 'react'

const Message = ({ message }: { message: string }) =>
  <div>{message}</div>

Message.propTypes = {
  message: PropTypes.string.isRequired,
}

export default Message
```

These are examples of *dumb* components. They are logic-less, and just show whatever they are asked to show via React **props**. The main difference between `bark-button.jsx` and `message.jsx` is that `BarkButton` contains an reference to an action dispatcher in its props, where `Message` contains some data to show.

Again, *components* don't know anything about Redux **actions** or the **state** of our app, which is why we are going to create smart **containers** that will feed the proper action dispatchers and data to these 2 dumb components.

- Create a `src/client/container/bark-button.js` file containing:

```javascript
// @flow

import { connect } from 'react-redux'

import { bark } from '../action/dog'
import BarkButton from '../component/bark-button'

const mapDispatchToProps = dispatch => ({
  bark: () => { dispatch(bark('Wah wah!')) },
})

export default connect(null, mapDispatchToProps)(BarkButton)
```

This container hooks up the `BarkButton` component with the `bark` action and Redux's `dispatch` method.

- Create a `src/client/container/message.js` file containing:

```javascript
// @flow

import { connect } from 'react-redux'

import Message from '../component/message'

const mapStateToProps = state => ({
  message: state.dog.get('barkMessage'),
})

export default connect(mapStateToProps)(Message)
```

This container hooks up the Redux's app state with the `Message` component. When the state changes, `Message` will now automatically re-render with the proper `message` prop. These connections are done via the `connect` function of `react-redux`.

We still haven't initialized the Redux store and haven't put the 2 containers anywhere in our app yet:

- Edit `entry.jsx` like so:

```javascript
// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import BarkButton from './container/bark-button'
import Message from './container/message'
import dogReducer from './reducer/dog'

/* eslint-disable no-underscore-dangle */
const store = createStore(combineReducers({
  dog: dogReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
/* eslint-enable no-underscore-dangle */

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Message />
      <BarkButton />
    </div>
  </Provider>
  , document.querySelector('.js-app'))
```

Let's take a moment to review this. First, we create a *store* with `createStore`. Stores are created by passing reducers to them. Here we only have one reducer, but for the sake of future scalability, we use `combineReducers` to group all of our reducers together. The last weird parameter of `createStore` is something to hook up Redux to browser [Devtools](https://github.com/zalmoxisus/redux-devtools-extension), which are incredibly useful when debugging. Since ESLint will complain about the underscores in `__REDUX_DEVTOOLS_EXTENSION__`, we surround that block with comments to temporarily disable this ESLint rule.

Next, we wrap our entire app inside `react-redux`'s `Provider` component and pass it our store. We put our 2 **containers** in a `<div>` because `Provider` must have a single child.

- You can now run `yarn start` and open `index.html`. You should see "The dog did not bark" and a button. When you click the button, the message should show "The dog barked".

Next section: [10 - Immutable JS and Redux Improvements](/tutorial/10-immutable-redux-improvements)

Back to the [previous section](/tutorial/8-react) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).

## Immutable JS

Unlike the previous chapter, this one is rather easy, and consists in minor improvements.

Anyway, back to Immutable:

In `dog-reducer.js` tweak your file so it looks like this:

```javascript
import Immutable from 'immutable';
import { MAKE_BARK } from '../actions/dog-actions';

const initialState = Immutable.Map({
  hasBarked: false,
});

const dogReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAKE_BARK:
      return state.set('hasBarked', action.payload);
    default:
      return state;
  }
};

export default dogReducer;
```

The initial state is now built using an Immutable Map, and the new state is generated using `set()`, preventing any mutation of the previous state.

In `containers/bark-message.js`, update the `mapStateToProps` function to use `.get('hasBarked')` instead of `.hasBarked`:

```javascript
const mapStateToProps = state => ({
  message: state.dog.get('hasBarked') ? 'The dog barked' : 'The dog did not bark',
});
```

The app should still behave exactly the way it did before.

**Note**: If Babel complains about Immutable exceeding 100KB, add `"compact": false` to your `package.json` under `babel`.

As you can see from the code snippet above, our state object still contains a plain old `dog` object attribute, which isn't immutable. It is fine this way, but if you want to only manipulate immutable objects, you could install the `redux-immutable` package to replace Redux's `combineReducers` function.

## // TODO

One counterintuitive case is the following, for `src/client/component/message.jsx`:

```javascript
const Message = ({ message }: { message: string }) => <div>{message}</div>;
```

As you can see, when destructuring function parameters, you must annotate the extracted properties using a sort of object literal notation.

## Asynchronous call with Redux-thunk

// isomorphic fetch

// TODO

Next section: [06 - Jest](/tutorial/06-jest)

Back to the [previous section](/tutorial/04-webpack-react) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
