# JavaScript Stack from Scratch

[![Yarn](/img/yarn.png)](https://yarnpkg.com/)
[![React](/img/react.png)](https://facebook.github.io/react/)
[![Gulp](/img/gulp.png)](http://gulpjs.com/)
[![Redux](/img/redux.png)](http://redux.js.org/)
[![ESLint](/img/eslint.png)](http://eslint.org/)
[![Webpack](/img/webpack.png)](https://webpack.github.io/)
[![Mocha](/img/mocha.png)](https://mochajs.org/)
[![Chai](/img/chai.png)](http://chaijs.com/)
[![Flow](/img/flow.png)](https://flowtype.org/)

[![Build Status](https://travis-ci.org/verekia/js-stack-from-scratch.svg?branch=master)](https://travis-ci.org/verekia/js-stack-from-scratch)

Welcome to my modern JavaScript stack tutorial: **JavaScript Stack from Scratch**.

This is a minimalistic and straight-to-the-point guide to assembling a JavaScript stack. It requires some general programming knowledge, and JavaScript basics. **It focuses on wiring tools together** and giving you the **simplest possible example** for each tool. You can see this tutorial as *a way to write your own boilerplate from scratch*.

You don't need to use this entire stack if you build a simple web page with a few JS interactions of course (a combination of Browserify/Webpack + Babel + jQuery is enough to be able to write ES6 code in different files with CLI compilation), but if you want to build a web app that scales, and need help setting things up, this tutorial will work great for you.

Since the goal of this tutorial is to assemble various tools, I do not go into details about how these tools work individually. Refer to their documentation or find other tutorials if you want to acquire deeper knowledge in them.

A big chunk of the stack described in this tutorial uses React. If you are beginning and just want to learn React, [create-react-app](https://github.com/facebookincubator/create-react-app) will get you up and running with a React environment very quickly with a premade configuration. I would for instance recommend this approach to someone who arrives in a team that's using React and needs to catch up with a learning playground. In this tutorial you won't use a premade configuration, because I want you to understand everything that's happening under the hood.

Code examples are available for each chapter, and you can run them all with `yarn && yarn start` or `npm install && npm start`. I recommend writing everything from scratch yourself by following the **step-by-step instructions** of each chapter.

**Every chapter contains the code of previous chapters**, so if you are simply looking for a boilerplate project containing everything, just clone the last chapter and you're good to go.

Note: The order of chapters is not necessarily the most educational. For instance, testing / type checking could have been done before introducing React. It is quite difficult to move chapters around or edit past ones, since I need to apply those changes to every following chapter. If things settle down, I might reorganize the whole thing in a better way.

The code of this tutorial works on Linux, macOS, and Windows.

## Table of contents

[1 - Node, NPM, Yarn, and package.json](/tutorial/01-node-npm-yarn-package-json)

[2 - Installing and using a package](/tutorial/02-packages)

[3 - Setting up ES6 with Babel and Gulp](/tutorial/03-es6-babel-gulp)

[4 - Using the ES6 syntax with a class](/tutorial/04-es6-syntax-class)

[5 - The ES6 modules syntax](/tutorial/05-es6-modules-syntax)

[6 - ESLint](/tutorial/06-eslint)

[7 - Client app with Webpack](/tutorial/07-client-webpack)

[8 - React](/tutorial/08-react)

[9 - Redux](/tutorial/09-redux)

[10 - Immutable JS and Redux Improvements](/tutorial/10-immutable-redux-improvements)

[11 - Testing with Mocha, Chai, and Sinon](/tutorial/11-testing-mocha-chai-sinon)

[12 - Type Checking with Flow](/tutorial/12-flow)

## Coming up next

Production / development environments, Express, React Router, Server-Side Rendering, Styling, Enzyme, Git Hooks.

## Translations

- [Chinese](https://github.com/pd4d10/js-stack-from-scratch) by [@pd4d10](http://github.com/pd4d10)
- [Italian](https://github.com/fbertone/js-stack-from-scratch) by [Fabrizio Bertone](https://github.com/fbertone)

If you want to add your translation, please read the [translation recommendations](/how-to-translate.md) to get started!

## Credits

Created by [@verekia](https://twitter.com/verekia) – [verekia.com](http://verekia.com/).

License: MIT
