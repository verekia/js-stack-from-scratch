# Change Log

## v2.4.5

- Add `babel-plugin-flow-react-proptypes`.
- Add `eslint-plugin-compat`.
- Add JSS `composes` example.

## v2.4.4

- Update Immutable to remove the `import * as Immutable from 'immutable'` syntax.
- Declare Flow types outside of function params for React components.
- Improve Webpack `publicPath`.

## V2, up to v2.4.3

- Gulp is gone, replaced by NPM (Yarn) scripts.
- Express has been added, with template strings for static HTML. Gzip compression enabled.
- Support for development environment with Nodemon and production environment with PM2.
- Minification or sourcemaps depending on the environment via Webpack.
- Add Webpack Dev Server, with Hot Module Replacement and `react-hot-loader`.
- Add an asynchronous call example with `redux-thunk`.
- Linting / type checking / testing is not launched at every file change anymore, but triggered by Git Hooks via Husky.
- Some chapters have been combined to make it easier to maintain the tutorial.
- Replace Chai and Mocha by Jest.
- Add React-Router, Server-Side rendering, `react-helmet`.
- Rename all "dog" things and replaced it by "hello" things. It's a Hello World app after all.
- Add Twitter Bootstrap, JSS, and `react-jss` for styling.
- Add a Websocket example with Socket.IO.
- Add optional Heroku, Travis, and Coveralls integrations.
