- Create a `dist` folder at the root of your project, and add the following `index.html` file to it:

```html
<!doctype html>
<html>
  <head>
  </head>
  <body>
    <script src="client-bundle.js"></script>
  </body>
</html>
```

In your `src` folder, create the following subfolders: `server`, `shared`, `client`, and move your current `index.js` into `server`, and `dog.js` into `shared`. Create `app.js` file in `client`.

We are not going to do any Node back-end in this example, but this separation will help you see more clearly where things belong. You'll need to change the `import Dog from './dog';` in `server/index.js` to `import Dog from '../shared/dog';` though, or ESLint will detect errors for unresolved modules.

Write this in `client/app.js`:

```javascript
import Dog from '../shared/dog';

const browserToby = new Dog('Browser Toby');

document.write(browserToby.bark());
```

Add the following to your `package.json`, under `eslintConfig`:

```json
"env": {
  "browser": true
}
```
This way we can use variables such as `window` or `document` which are always accessible in the browser without ESLint complaning about undeclared variables.

In order to use multiple files to develop, but serve only one JS file to the client app (saving expensive HTTP requests), we need to "bundle" our app into one file. Browserify is a tool and package that does this. Since we use ES6 syntax, we also want Browserify to compile our ES6 code into ES5 using Babel, which is done with another package called Babelify. We'll need a last package called `vinyl-source-stream` that makes it possible for Gulp to understand what comes out from Babelify and name your bundle. It's a bit messy to understand, but the following Gulp task should help visualize the general idea:

```javascript
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

// [...]

gulp.task('build-client', ['lint'], () =>
  browserify({ entries: './src/client/app.js', debug: true })
    .transform(babelify)
    .bundle()
    .pipe(source('client-bundle.js'))
    .pipe(gulp.dest('dist'))
);
```
Feel free to look into each one of these package's documentation for further information. Don't worry about not understanding this part perfectly, it will be replaced by Webpack later, in section 9 of this tutorial.

We also renamed the `build` Gulp task into `build-server` for clarity.

Let's modify the `npm start` script in `package.json` to the following: `"start": "gulp build-client"`. We don't need to run `node .` anymore, since we will open `index.html` to test our project.

- Run `npm start`, open `index.html`, and you should see "Wah wah, I am Browser Toby".

- Add `dist/client-bundle.js` to your `.gitignore` file.
