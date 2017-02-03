# Change Log

## 2.0.0

- Gulp is gone, replaced by NPM scripts.
- Express has been added, with template strings for static HTML, and a basic CSS file.
- Support for development / production environments, with PM2 to manage their processes, and minification / sourcemaps via Webpack.
- Webpack Dev Server added, with hot reloading even when pages are served by the Express server.
- Added an AJAX call example with redux-thunk integration.
- Linting / typechecking / testing is not launched at every file change anymore, but triggered by Git Hooks via Husky. This makes your workflow much smoother, while still protecting your repository from bad code.
- Some chapters have been combined to make it easier to maintain the tutorial.
- Mocha is now compiled on the fly by Babel instead of relying on the `lib` build.
