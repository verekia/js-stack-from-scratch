# Change Log

## V2 (currently v2.4.3)

- Gulp is gone, replaced by NPM (Yarn) scripts.
- Express has been added, with template strings for static HTML. Gzip compression enabled.
- Support for development environment with Nodemon and production environment with PM2.
- Minification or sourcemaps depending on the environment via Webpack.
- Webpack Dev Server added, with Hot Module Replacement and `react-hot-loader`.
- Added an asynchronous call example with `redux-thunk`.
- Linting / type checking / testing is not launched at every file change anymore, but triggered by Git Hooks via Husky.
- Some chapters have been combined to make it easier to maintain the tutorial.
- Replaced Chai and Mocha by Jest.
- Added React-Router, Server-Side rendering, `react-helmet`.
- Renamed all "dog" things and replaced it by "hello" things. It's a Hello World app after all.
- Added Twitter Bootstrap, JSS, and `react-jss` for styling.
- Added a Websocket example with Socket.IO.
- Added optional Heroku, Travis, and Coveralls integrations.
