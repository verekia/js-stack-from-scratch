# 8 - React

We're now going to render our app using React.

First, let's install React and ReactDOM:

- Run `npm install --save react react-dom`

These 2 packages go to our `"dependencies"` and not `"devDependencies"` because unlike build tools, the client bundle needs them in production.

Add a container for our app in `dist/index.html`:

```html
<body>
  <div class="app"></div>
  <script src="client-bundle.js"></script>
</body>
```

Let's rename our `src/client/app.js` file into `src/client/app.jsx` and write some React and JSX code in it:

```javascript
import 'babel-polyfill';

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Dog from '../shared/dog';

const dogBark = new Dog('Browser Toby').bark();

const App = props => (
  <div>
    The dog says: {props.message}
  </div>
);

App.propTypes = {
  message: PropTypes.string.isRequired,
};

ReactDOM.render(<App message={dogBark} />, document.querySelector('.app'));
```

**Note**: If you are unfamiliar with React or its PropTypes, learn about React first and come back to this tutorial later. There is going to be quite some React things in the upcoming chapters, so you need a good understanding of it.

Since we use the JSX syntax here, we have to tell Babel that it needs to transform it as well.
Install the React Babel preset, which will teach Babel how to process the JSX syntax:
`npm install --save-dev babel-preset-react` and change the `babel` entry in your `package.json` file like so:

```json
"babel": {
  "presets": [
    "latest",
    "react"
  ]
},
```

In our Gulpfile, we need to tell Gulp that we now also want to process `.jsx` files, which causes the following tweaks in our `paths` declaration:

```javascript
const paths = {
  allSrcJs: 'src/**/*.js?(x)',
  serverSrcJs: 'src/server/**/*.js?(x)',
  sharedSrcJs: 'src/shared/**/*.js?(x)',
  clientEntryPoint: 'src/client/app.jsx', // Don't forget this one
  gulpFile: 'gulpfile.babel.js',
};
```

We are going to have JSX files on the server later on, so let's allow `.jsx` extensions everywhere.

Now after running `npm start`, if we open `index.html`, we should see "The dog says: Wah wah, I am Browser Toby" rendered by React.


Next section: [9 - Redux](/tutorial/9-redux)

Back to the [previous section](/tutorial/7-client-webpack) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
