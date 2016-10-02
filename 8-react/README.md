We're now going to render our app using React.

First, let's install React and ReactDOM:

- Run `npm install --save react react-dom`

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
    The dog says: {props.dogBark}
  </div>
);

App.propTypes = {
  dogBark: PropTypes.string.isRequired,
};

ReactDOM.render(<App dogBark={dogBark} />, document.querySelector('.app'));
```

Since we use the JSX syntax here, we will need to tell Babel that it needs to transform it as well.
Install the following Babel plugin:
`npm install --save babel-plugin-transform-react-jsx` and change the `babel` entry in your `package.json` file like so:

```json
"babel": {
  "presets": [
    "latest"
  ],
  "plugins": [
    "transform-react-jsx"
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
    '!lib/**',
    '!node_modules/**',
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
