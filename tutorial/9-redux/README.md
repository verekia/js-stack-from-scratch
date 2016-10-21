# 9 - Redux

In this chapter (which is the most difficult so far) we will be adding [Redux](http://redux.js.org/) to our application and will hook it up with React. Redux manages the state of your application. It is composed of a **store** which is a plain JavaScript object representing the state of your app, **actions** which are typically triggered by users, and **reducers** which can be seen as action handlers. Reducers affect your application state (the *store*), and when the application state is modified, things happen in your app. A good visual demonstration of Redux can be found <a href="http://slides.com/jenyaterpil/redux-from-twitter-hype-to-production#/9">here</a>.

In order to demonstrate how to use Redux in the simplest possible way, our app will consist of a message and a button. The message says whether the dog has barked or not (it initially hasn't), and the button makes the dog bark, which should update the message.

We are going to need 2 packages in this part, `redux` and `react-redux`.

- Run `npm install --save redux react-redux`.

Lets start by creating 2 folders: `src/client/actions` and `src/client/reducers`.

- In `actions`, create `dog-actions.js`:

```javascript
export const MAKE_BARK = 'MAKE_BARK';

export const makeBark = () => ({
  type: MAKE_BARK,
  payload: true,
});
```
Here we define an action type, `MAKE_BARK`, and a function (also known as *action creator*) that triggers a `MAKE_BARK` action called `makeBark`. Both are exported because we'll need them both in other files. This action implements the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) model, which is why it has `type` and `payload` attributes.

- In `reducers`, create `dog-reducer.js`:

```javascript
import { MAKE_BARK } from '../actions/dog-actions';

const initialState = {
  hasBarked: false,
};

const dogReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAKE_BARK:
      return { hasBarked: action.payload };
    default:
      return state;
  }
};

export default dogReducer;
```

Here we define the initial state of our app, which is an object containing the `hasBarked` property set to `false`, and the `dogReducer`, which is the function responsible for altering the state based on which action happened. The state cannot be modified in this function, a brand new state object must be returned.

- We are now going to modify `app.jsx` to create the *store*. You can replace the entire content of that file by the following:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import dogReducer from './reducers/dog-reducer';
import BarkMessage from './containers/bark-message';
import BarkButton from './containers/bark-button';

const store = createStore(combineReducers({
  dog: dogReducer,
}));

ReactDOM.render(
  <Provider store={store}>
    <div>
      <BarkMessage />
      <BarkButton />
    </div>
  </Provider>
  , document.querySelector('.app')
);
```

Our store is created by the Redux function `createStore`, pretty explicit. The store object is assembled by combining all our reducers (in our case, only one) using Redux's `combineReducers` function. Each reducer is named here, and we'll name ours `dog`.

That's pretty much it for the pure Redux part.

Now we are going to hook up Redux with React using `react-redux`. In order for `react-redux` to pass the store to our React app, it needs to wrap the entire app in a `<Provider>` component. This component must have a single child, so we created a `<div>`, and this `<div>` contains the 2 main elements of our app, a `BarkMessage` and a `BarkButton`.

As you can tell in the `import` section, `BarkMessage` and `BarkButton` are imported from a `containers` folder. Now is a good time to introduce the concept of **Components** and **Containers**.

*Components* are *dumb* React components, in a sense that they don't know anything about the Redux state. *Containers* are *smart* components that know about the state and that we are going to *connect* to our dumb components.

- Create 2 folders, `src/client/components` and `src/client/containers`.

- In `components`, create the following files:

**button.jsx**

```javascript
import React, { PropTypes } from 'react';

const Button = ({ action, actionLabel }) => <button onClick={action}>{actionLabel}</button>;

Button.propTypes = {
  action: PropTypes.func.isRequired,
  actionLabel: PropTypes.string.isRequired,
};

export default Button;
```

and **message.jsx**:

```javascript
import React, { PropTypes } from 'react';

const Message = ({ message }) => <div>{message}</div>;

Message.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Message;

```

These are examples of *dumb* components. They are logic-less, and just show whatever they are asked to show via React **props**. The main difference between `button.jsx` and `message.jsx` is that `Button` contains an **action** in its props. That action is bound on the `onClick` event. In the context of our app, the `Button` label is never going to change, however, the `Message` component is going to reflect the state of our app, and will vary based on the state.

Again, *components* don't know anything about Redux **actions** or the **state** of our app, which is why we are going to create smart **containers** that will feed the proper *actions* and *data* to these 2 dumb components.

- In `containers`, create the following files:

**bark-button.js**

```javascript
import { connect } from 'react-redux';
import Button from '../components/button';
import { makeBark } from '../actions/dog-actions';

const mapDispatchToProps = dispatch => ({
  action: () => { dispatch(makeBark()); },
  actionLabel: 'Bark',
});

export default connect(null, mapDispatchToProps)(Button);
```

and **bark-message.js**:

```javascript
import { connect } from 'react-redux';
import Message from '../components/message';

const mapStateToProps = state => ({
  message: state.dog.hasBarked ? 'The dog barked' : 'The dog did not bark',
});

export default connect(mapStateToProps)(Message);
```

`BarkButton` will hook up `Button` with the `makeBark` action and Redux's `dispatch` method, and `BarkMessage` will hook up the app state with `Message`. When the state changes, `Message` will now automatically re-render with the proper `message` prop. These connections are done via the `connect` function of `react-redux`.

- You can now run `npm start` and open `index.html`. You should see "The dog did not bark" and a button. When you click the button, the message should show "The dog barked".

Next section: [10 - Immutable JS and Redux Improvements](/tutorial/10-immutable-redux-improvements)

Back to the [previous section](/tutorial/8-react) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
