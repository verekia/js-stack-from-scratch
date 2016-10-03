# 8 - React

We're now going to render our app using React.

First, let's install React and ReactDOM:

- Run `npm install --save react react-dom`

These 2 packages go to our `"dependencies"` and not `"devDependencies"` because unlike build tools, the client bundle needs them in production.

And create a container for our app in `dist/index.html`:

```html
<body>
  <div class="app"></div>
  <script src="client-bundle.js"></script>
</body>
```

Let's rename our `src/client/app.js` file into `src/client/app.jsx` and write some React and JSX code in it:

```javascript
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

In our Gulpfile, we need to tell Gulp that we now also want to process `.jsx` files, which causes the following tweaks:
```javascript
gulp.task('build-server', ['lint'], () =>
  gulp.src([
    'src/server/**/*.js',
    'src/shared/**/*.js',
  ])
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);

gulp.task('lint', () =>
  gulp.src([
    'gulpfile.js',
    'src/**/*.js',
    'src/**/*.jsx', // Add this line
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('build-client', ['lint'], () =>
  browserify({ entries: './src/client/app.jsx', debug: true }) // Change this line
    .transform(babelify)
    .bundle()
    .pipe(source('client-bundle.js'))
    .pipe(gulp.dest('dist'))
);
```

Now after running `npm start`, if we open `index.html`, we should see "The dog says: Wah wah, I am Browser Toby" rendered by React.


Next section: [9 - Webpack](/9-webpack)

Back to the [previous section](/7-client-browserify) or the [table of contents](https://github.com/verekia/modern-js-stack-training).
