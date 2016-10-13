# 11 - Immutable JS and Redux Improvements

## Immutable JS

Unlike the previous chapter, this one is rather easy, and consists in minor improvements.

First, we are going to add **Immutable JS** to our codebase. Immutable is a library to manipulate objects without mutating them. Instead of doing:

```javascript
const obj = { a: 1 };
obj.a = 2; // Mutates `obj`
```
You would do:
```javascript
const obj = Immutable.Map({ a: 1 });
obj.set('a', 2); // Returns a new object without mutating `obj`
```

This approach follows the **functional programming** paradigm, which works really well with Redux. Your reducer functions actually *have* to be pure functions that don't alter the state passed as parameter, but return a brand new state object instead. Let's use Immutable to enforce this.

- Run `npm install --save immutable`

We are going to use `Map` in our codebase, but ESLint and the Airbnb config will complain about using a capitalized name without it being a class. Add the following to your `package.json` under `eslintConfig`:

```json
"rules": {
  "new-cap": [
    2,
    {
      "capIsNewExceptions": [
        "Map",
        "List"
      ]
    }
  ]
}
```
This makes `Map` and `List` (the 2 Immutable objects you'll use all the time) exceptions to that ESLint rule. This verbose JSON formatting is actually done automatically by NPM, so we cannot make it more compact unfortunately.

Anyway, back to Immutable:

In `dog-reducer.js` tweak your file so it looks like this:

```javascript
import { Map } from 'immutable';
import { MAKE_BARK } from '../actions/dog-actions';

const initialState = Map({
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

**Optional**:
- Run `npm install --save redux-immutable`
- Replace your `combineReducers` function in `app.jsx` to use the one imported from `redux-immutable` instead.
- In `bark-message.js` replace `state.dog.get('hasBarked')` by `state.getIn(['dog', 'hasBarked'])`.

## Redux Actions

As you add more and more actions to your app, you will find yourself writing quite a lot of the same boilerplate. The `redux-actions` package helps reducing that boilerplate code. With `redux-actions` you can rewrite your `dog-actions.js` file in a more compact way:

```javascript
import { createAction } from 'redux-actions';

export const MAKE_BARK = 'MAKE_BARK';
export const makeBark = createAction(MAKE_BARK, () => true);
```

`redux-actions` implement the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) model, just like the action we previously wrote, so integrating `redux-actions` is seamless if you follow this model.

- Don't forget to run `npm install --save redux-actions`.

Next section: [11 - Testing with Mocha, Chai, and Sinon](/tutorial/11-testing-mocha-chai-sinon)

Back to the [previous section](/tutorial/9-redux) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
