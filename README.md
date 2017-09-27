# JavaScript Stack from Scratch

[![Build Status](https://travis-ci.org/verekia/js-stack-from-scratch.svg?branch=master)](https://travis-ci.org/verekia/js-stack-from-scratch)
[![Release](https://img.shields.io/github/release/verekia/js-stack-from-scratch.svg?style=flat-square)](https://github.com/verekia/js-stack-from-scratch/releases)
[![Dependencies](https://img.shields.io/david/verekia/js-stack-boilerplate.svg?style=flat-square)](https://david-dm.org/verekia/js-stack-boilerplate)
[![Dev Dependencies](https://img.shields.io/david/dev/verekia/js-stack-boilerplate.svg?style=flat-square)](https://david-dm.org/verekia/js-stack-boilerplate?type=dev)
[![Gitter](https://img.shields.io/gitter/room/js-stack-from-scratch/Lobby.svg?style=flat-square)](https://gitter.im/js-stack-from-scratch/)

[![React](/img/react-padded-90.png)](https://facebook.github.io/react/)
[![Redux](/img/redux-padded-90.png)](http://redux.js.org/)
[![React Router](/img/react-router-padded-90.png)](https://github.com/ReactTraining/react-router)
[![Flow](/img/flow-padded-90.png)](https://flowtype.org/)
[![ESLint](/img/eslint-padded-90.png)](http://eslint.org/)
[![Jest](/img/jest-padded-90.png)](https://facebook.github.io/jest/)
[![Yarn](/img/yarn-padded-90.png)](https://yarnpkg.com/)
[![Webpack](/img/webpack-padded-90.png)](https://webpack.github.io/)
[![Bootstrap](/img/bootstrap-padded-90.png)](http://getbootstrap.com/)

Welcome to my modern JavaScript stack tutorial: **JavaScript Stack from Scratch**.

> 🎉 **This is the V2 of the tutorial, major changes happened since the 2016 release. Check the [Change Log](/CHANGELOG.md)!**

This is a straight-to-the-point guide to assembling a JavaScript stack. It requires some general programming knowledge, and JavaScript basics. **It focuses on wiring tools together** and giving you the **simplest possible example** for each tool. You can see this tutorial as *a way to write your own boilerplate from scratch*. Since the goal of this tutorial is to assemble various tools, I do not go into details about how these tools work individually. Refer to their documentation or find other tutorials if you want to acquire deeper knowledge in them.

You don't need to use this entire stack if you build a simple web page with a few JS interactions of course (a combination of Browserify/Webpack + Babel + jQuery is enough to be able to write ES6 code in different files), but if you want to build a web app that scales, and need help setting things up, this tutorial will work great for you.

A big chunk of the stack described in this tutorial uses React. If you are beginning and just want to learn React, [create-react-app](https://github.com/facebookincubator/create-react-app) will get you up and running with a React environment very quickly with a pre-made configuration. I would for instance recommend this approach to someone who arrives in a team that's using React and needs to catch up with a learning playground. In this tutorial you won't use a pre-made configuration, because I want you to understand everything that's happening under the hood.

Code examples are available for each chapter, and you can run them all with `yarn && yarn start`. I recommend writing everything from scratch yourself by following the **step-by-step instructions** though.

Final code available in the [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate), and in the [releases](https://github.com/verekia/js-stack-from-scratch/releases). There is a [live demo](https://js-stack.herokuapp.com/) too.

Works on Linux, macOS, and Windows.

> **Note**: Since the tutorial was last edited in May 2017, a few libraries have slightly changed their APIs. 95% of the tutorial is still perfectly valid, but if you run into something weird, make sure to check out the [open issues](https://github.com/verekia/js-stack-from-scratch/issues?q=is%3Aopen+is%3Aissue+label%3Abug).

## Table of contents

[01 - Node, Yarn, `package.json`](/tutorial/01-node-yarn-package-json.md#readme)

[02 - Babel, ES6, ESLint, Flow, Jest, Husky](/tutorial/02-babel-es6-eslint-flow-jest-husky.md#readme)

[03 - Express, Nodemon, PM2](/tutorial/03-express-nodemon-pm2.md#readme)

[04 - Webpack, React, HMR](/tutorial/04-webpack-react-hmr.md#readme)

[05 - Redux, Immutable, Fetch](/tutorial/05-redux-immutable-fetch.md#readme)

[06 - React Router, Server-Side Rendering, Helmet](/tutorial/06-react-router-ssr-helmet.md#readme)

[07 - Socket.IO](/tutorial/07-socket-io.md#readme)

[08 - Bootstrap, JSS](/tutorial/08-bootstrap-jss.md#readme)

[09 - Travis, Coveralls, Heroku](/tutorial/09-travis-coveralls-heroku.md#readme)

## Coming up next

Setting up your editor (Atom first), MongoDB, Progressive Web App, E2E testing.

## Translations

If you want to add your translation, please read the [translation recommendations](/how-to-translate.md) to get started!

### V2

- [Bulgarian](https://github.com/mihailgaberov/js-stack-from-scratch) by [mihailgaberov](http://github.com/mihailgaberov)
- [Chinese (simplified)](https://github.com/yepbug/js-stack-from-scratch/) by [@yepbug](https://github.com/yepbug)
- [French](https://github.com/naomihauret/js-stack-from-scratch/) by [Naomi Hauret](https://twitter.com/naomihauret)
- [Italian](https://github.com/fbertone/guida-javascript-moderno) by [Fabrizio Bertone](https://github.com/fbertone) - [fbertone.it](http://fbertone.it)

Check out the [ongoing translations](https://github.com/verekia/js-stack-from-scratch/issues/147).

### V1

- [Chinese (simplified)](https://github.com/pd4d10/js-stack-from-scratch) by [@pd4d10](http://github.com/pd4d10)
- [Italian](https://github.com/fbertone/js-stack-from-scratch) by [Fabrizio Bertone](https://github.com/fbertone)
- [Japanese](https://github.com/takahashim/js-stack-from-scratch) by [@takahashim](https://github.com/takahashim)
- [Russian](https://github.com/UsulPro/js-stack-from-scratch) by [React Theming](https://github.com/sm-react/react-theming)
- [Thai](https://github.com/MicroBenz/js-stack-from-scratch) by [MicroBenz](https://github.com/MicroBenz)

## Credits

Created by [@verekia](https://twitter.com/verekia) – [verekia.com](http://verekia.com/).

License: MIT
