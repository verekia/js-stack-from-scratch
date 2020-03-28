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

Witaj w moim nowoczesnym samouczku stosu JavaScript: **JavaScript Stack from Scratch**.

> 🎉 **To jest wersja V2 tego samouczka, główne zmiany nastąpiły od wydania 2016. Sprawdź [Change Log](/CHANGELOG.md)!**

Jest to prosty przewodnik po stosie JavaScript. Wymaga to ogólnej wiedzy programistycznej i podstaw JavaScript. **Skupia się na łączeniu narzędzi razem** i pokazuje **możliwie najprostszy przykład** dla każdego narzędzia. Możesz traktować ten samouczek także jako *sposób na napisanie własnego schematu od podstaw*. Ponieważ celem tego samouczka jest zestawienie różnych narzędzi, nie wchodzę w szczegóły na temat tego, jak działają one indywidualnie. Zapoznaj się z ich dokumentacją lub znajdź inne samouczki, jeśli chcesz zdobyć w nich głębszą wiedzę.

Nie musisz używać całego tego stosu, jeśli zbudujesz prostą stronę internetową z kilkoma interakcjami JS (kombinacja Browserify / Webpack + Babel + jQuery jest wystarczająca, aby móc pisać kod ES6 w różnych plikach), ale jeśli chcesz zbudować skalowalną aplikację internetową i potrzebujesz pomocy w konfigurowaniu, ten samouczek będzie dla Ciebie odpowiedni.

Duża część stosu opisanego w tym samouczku używa React. Jeśli zaczynasz i chcesz się nauczyć Reacta, [create-react-app](https://github.com/facebookincubator/create-react-app) szybko uruchomisz środowisko React ze wstępną konfiguracją. Poleciłbym na przykład to podejście komuś, kto przybywa do zespołu korzystającego z React i musi nadrobić zaległości w nauce. W tym samouczku nie będziesz używać gotowej konfiguracji, ponieważ chcę, abyś zrozumiał wszystko, co dzieje się pod maską.

Przykłady kodów są dostępne dla każdego rozdziału i można je wszystkie uruchomić z `yarn && yarn start`. Zalecam jednak pisanie wszystkiego od podstaw, postępując zgodnie z **instrukcjami krok po kroku**.

Końcowy kod dostępny w [repozytorium JS-Stack-Boilerplate](https://github.com/verekia/js-stack-boilerplate), oraz w [wydaniach](https://github.com/verekia/js-stack-from-scratch/releases). Tam jest także [live demo](https://js-stack.herokuapp.com/).

Działa w systemach Linux, macOS i Windows.

> **Uwaga**: Od czasu ostatniej edycji tego samouczka w maju 2017 r. Kilka bibliotek nieznacznie zmieniło swoje interfejsy API. 95% samouczka jest nadal w pełni poprawnych, ale jeśli wpadniesz na coś dziwnego, koniecznie sprawdź [open issues](https://github.com/verekia/js-stack-from-scratch/issues?q=is%3Aopen+is%3Aissue+label%3Abug).

## Spis treści

[01 - Node, Yarn, `package.json`](/tutorial/01-node-yarn-package-json.md#readme)

[02 - Babel, ES6, ESLint, Flow, Jest, Husky](/tutorial/02-babel-es6-eslint-flow-jest-husky.md#readme)

[03 - Express, Nodemon, PM2](/tutorial/03-express-nodemon-pm2.md#readme)

[04 - Webpack, React, HMR](/tutorial/04-webpack-react-hmr.md#readme)

[05 - Redux, Immutable, Fetch](/tutorial/05-redux-immutable-fetch.md#readme)

[06 - React Router, Server-Side Rendering, Helmet](/tutorial/06-react-router-ssr-helmet.md#readme)

[07 - Socket.IO](/tutorial/07-socket-io.md#readme)

[08 - Bootstrap, JSS](/tutorial/08-bootstrap-jss.md#readme)

[09 - Travis, Coveralls, Heroku](/tutorial/09-travis-coveralls-heroku.md#readme)

## Już wkrótce

Konfigurowanie edytora (pierwszy Atom), MongoDB, Progressive Web App, testowanie E2E.

## Tłumaczenia

Jeśli chcesz dodać swoje tłumaczenie, przeczytaj [rekomendacje dotyczące tłumaczeń](/how-to-translate.md) aby zacząć!

### V2

- [bułgarski](https://github.com/mihailgaberov/js-stack-from-scratch) od [mihailgaberov](http://github.com/mihailgaberov)
- [chiński (uproszczony)](https://github.com/yepbug/js-stack-from-scratch/) od [@yepbug](https://github.com/yepbug)
- [francuski](https://github.com/naomihauret/js-stack-from-scratch/) od [Naomi Hauret](https://twitter.com/naomihauret)
- [włoski](https://github.com/fbertone/guida-javascript-moderno) od [Fabrizio Bertone](https://github.com/fbertone) - [fbertone.it](http://fbertone.it)
- [polski](https://github.com/mbiesiad/js-stack-from-scratch) od [mbiesiad](https://github.com/mbiesiad)

Sprawdź [bieżące tłumaczenia](https://github.com/verekia/js-stack-from-scratch/issues/147).

### V1

- [中文](https://github.com/pd4d10/js-stack-from-scratch) od [@pd4d10](http://github.com/pd4d10)
- [Italiano](https://github.com/fbertone/js-stack-from-scratch) od [Fabrizio Bertone](https://github.com/fbertone)
- [日本語](https://github.com/takahashim/js-stack-from-scratch) od [@takahashim](https://github.com/takahashim)
- [Русский](https://github.com/UsulPro/js-stack-from-scratch) od [React Theming](https://github.com/sm-react/react-theming)
- [ไทย](https://github.com/MicroBenz/js-stack-from-scratch) od [MicroBenz](https://github.com/MicroBenz)
- [English](https://github.com/verekia/js-stack-from-scratch) od [Verekia](https://github.com/verekia)

## Zasługi

Stworzone przez [@verekia](https://twitter.com/verekia) – [verekia.com](http://verekia.com/). Przetłumaczone przez Michał Biesiada [@michalbiesiada](https://twitter.com/michalbiesiada) – [@mbiesiad](https://github.com/mbiesiad)

Licencja: MIT
