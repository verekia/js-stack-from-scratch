# JavaScript Stack from Scratch

[![Build Status](https://travis-ci.org/verekia/js-stack-from-scratch.svg?branch=master)](https://travis-ci.org/verekia/js-stack-from-scratch) [![Join the chat at https://gitter.im/js-stack-from-scratch/Lobby](https://badges.gitter.im/js-stack-from-scratch/Lobby.svg)](https://gitter.im/js-stack-from-scratch/Lobby)

[![Yarn](/img/yarn-padded.png)](https://yarnpkg.com/)
[![React](/img/react-padded.png)](https://facebook.github.io/react/)
[![Redux](/img/redux-padded.png)](http://redux.js.org/)

[![Webpack](/img/webpack-padded.png)](https://webpack.github.io/)
[![ESLint](/img/eslint-padded.png)](http://eslint.org/)
[![Flow](/img/flow-padded.png)](https://flowtype.org/)

[![Jest](/img/jest-padded.png)](https://facebook.github.io/jest/)
[![React Router](/img/react-router-padded.png)](https://github.com/ReactTraining/react-router)
[![PM2](/img/pm2-padded.png)](http://pm2.keymetrics.io/)

Welcome to my modern JavaScript stack tutorial: **JavaScript Stack from Scratch**.

> 🎉 **This is V2 of the tutorial, major changes happened since the initial 2016 release. Check the [Change Log](/CHANGELOG.md)!**

This is a minimalistic and straight-to-the-point guide to assembling a JavaScript stack. It requires some general programming knowledge, and JavaScript basics. **It focuses on wiring tools together** and giving you the **simplest possible example** for each tool. You can see this tutorial as *a way to write your own boilerplate from scratch*.

You don't need to use this entire stack if you build a simple web page with a few JS interactions of course (a combination of Browserify/Webpack + Babel + jQuery is enough to be able to write ES6 code in different files with CLI compilation), but if you want to build a web app that scales, and need help setting things up, this tutorial will work great for you.

Since the goal of this tutorial is to assemble various tools, I do not go into details about how these tools work individually. Refer to their documentation or find other tutorials if you want to acquire deeper knowledge in them.

A big chunk of the stack described in this tutorial uses React. If you are beginning and just want to learn React, [create-react-app](https://github.com/facebookincubator/create-react-app) will get you up and running with a React environment very quickly with a premade configuration. I would for instance recommend this approach to someone who arrives in a team that's using React and needs to catch up with a learning playground. In this tutorial you won't use a premade configuration, because I want you to understand everything that's happening under the hood.

Code examples are available for each chapter, and you can run them all with `yarn && yarn start` or `npm install && npm start`. I recommend writing everything from scratch yourself by following the **step-by-step instructions** of each chapter.

If you are simply looking for a boilerplate project, go to the [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate) to download the final code of this tutorial.

The code provided works on Linux, macOS, and Windows.

## Table of contents

[01 - Node, Yarn, `package.json`](/tutorial/01-node-yarn-package-json#01---node-yarn-and-packagejson)

[02 - Babel, ES6, ESLint, Flow, Husky](/tutorial/02-babel-es6-eslint-flow-husky#02---babel-es6-eslint-flow-git-hooks)

[03 - Express, PM2](/tutorial/03-express-pm2#03---express-pm2)

[04 - Webpack, React](/tutorial/04-webpack-react#04---webpack-and-react)

[05 - Redux, Immutable, Fetch](/tutorial/05-redux-immutable#05---redux-immutable-fetch)

[06 - React Router, Server-Side Rendering](/tutorial/06-react-router-ssr#06---react-router-and-server-side-rendering)

[07 - Jest](/tutorial/07-jest#07---jest)

## Coming up next

Styling, Enzyme.

## Translations

If you want to add your translation, please read the [translation recommendations](/how-to-translate.md) to get started!

### V2

Coming soon!

### V1

- [中文](https://github.com/pd4d10/js-stack-from-scratch) by [@pd4d10](http://github.com/pd4d10)
- [Italiano](https://github.com/fbertone/js-stack-from-scratch) by [Fabrizio Bertone](https://github.com/fbertone)
- [日本語](https://github.com/takahashim/js-stack-from-scratch) by [@takahashim](https://github.com/takahashim)
- [Русский](https://github.com/UsulPro/js-stack-from-scratch) by [React Theming](https://github.com/sm-react/react-theming)
- [ไทย](https://github.com/MicroBenz/js-stack-from-scratch) by [MicroBenz](https://github.com/MicroBenz)

## Credits

Created by [@verekia](https://twitter.com/verekia) – [verekia.com](http://verekia.com/).

License: MIT
