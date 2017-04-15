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

Добре дошли в : **JavaScript Stack from Scratch**. Ръководство за използване на модерни технологии за работа с JavaScript. *Това е превод на основното репозитори от английски, което можете да намерите [тук](https://github.com/verekia/js-stack-from-scratch)*.

> 🎉 **Това е версия 2 на това ръководство, от релийза през 2016 година са направени не малки промени. Можете да проверите какво беше променено  [тук](/CHANGELOG.md)!**

Това ръководство е съсредоточено главно върху използването на комплект от технологии необходими за разработка на съвременни JavaScript базирани приложения. Изискват се някои базови познания по програмиране и основни такива конкретно по JavaScript. **Основният фокус е хвърлен върху "свързването" на инструментите (tools) за съвместна работа** и даване на **възможно най-простия пример** за всеки един инструмент. Можете да гледате на това ръководство като на *начин за написване на ваше собствено скеле или шаблон* за такова приложение. Тъй като целта на това ръководство е "сглобяването" на различни инструменти за съвместна работа, няма да навлизам в подробности за работата на всеки един от тях. Ако искате да добиете по-задълбочени познания за някой от тях, можете да потърсите други ръководства или да прочетете документацията им.

Разбира се, няма нужда да използвате целия този набор от инструменти ако правите простичка уеб страница с няколко JS интеракции (комбинация от конфигурирани Browserify/Webpack + Babel + jQuery ще бъде достатъчна за писане на [ES6](http://es6-features.org/) код в различни файлове), но ако искате да изградите голямо уеб приложение, което да може да бъде променяно и подобрявано сравнително лесно, и имате нужда от помощ при първоначалната настройка на нещата, то това ръководство ще ви бъде от ползва.

Голяма част от нещата описани в това ръководство използват [React](https://facebook.github.io/react/). Ако сте начинаещ и просто искате да научите React, [create-react-app](https://github.com/facebookincubator/create-react-app) ще ви позволи да започнете много бързо с предварително направена конфигурация. Аз, например, бих препоръчал този подход на някой, който току що влиза в екип, който използва React и има нужда от бързо наваксване. В това ръководство няма да използваме предварително готови конфигуции, тъй като искам да разберете как се случва всичко из основи.

За всяка от главите има примери с код, които могат да бъдат стартирани с `yarn && yarn start`. Аз препоръчвам да пишете всичко от нулата, следвайки **стъпка по стъпка интрукциите**.


Финалната версия на кода може да бъде намерена [тук](https://github.com/verekia/js-stack-boilerplate) и [тук](https://github.com/verekia/js-stack-from-scratch/releases). Работеща версия може да бъде видяна  [тук](https://js-stack.herokuapp.com/).
Работи на Linux, macOS и Windows.

## Съдържание

[01 - Node, Yarn, `package.json`](/tutorial/01-node-yarn-package-json.md#readme)

[02 - Babel, ES6, ESLint, Flow, Jest, Husky](/tutorial/02-babel-es6-eslint-flow-jest-husky.md#readme)

[03 - Express, Nodemon, PM2](/tutorial/03-express-nodemon-pm2.md#readme)

[04 - Webpack, React, HMR](/tutorial/04-webpack-react-hmr.md#readme)

[05 - Redux, Immutable, Fetch](/tutorial/05-redux-immutable-fetch.md#readme)

[06 - React Router, Server-Side Rendering, Helmet](/tutorial/06-react-router-ssr-helmet.md#readme)

[07 - Socket.IO](/tutorial/07-socket-io.md#readme)

[08 - Bootstrap, JSS](/tutorial/08-bootstrap-jss.md#readme)

[09 - Travis, Coveralls, Heroku](/tutorial/09-travis-coveralls-heroku.md#readme)

## Какво следва

Setting up your editor (Atom first), MongoDB, Progressive Web App, E2E testing.

## Преводи

Ако искате да добавите ваш превод, моля прочетете [препоръките](/how-to-translate.md), за да започнете!

### V2

- [Italian](https://github.com/fbertone/guida-javascript-moderno) by [Fabrizio Bertone](https://github.com/fbertone) - [fbertone.it](http://fbertone.it)
- [Simplified Chinese](https://github.com/yepbug/js-stack-from-scratch/) by [@yepbug](https://github.com/yepbug)

Текущите преводи можете да видите [тук](https://github.com/verekia/js-stack-from-scratch/issues/147).

### V1

- [Български](https://github.com/mihailgaberov/js-stack-from-scratch) by [mihailgaberov](http://github.com/mihailgaberov)
- [中文](https://github.com/pd4d10/js-stack-from-scratch) by [@pd4d10](http://github.com/pd4d10)
- [Italiano](https://github.com/fbertone/js-stack-from-scratch) by [Fabrizio Bertone](https://github.com/fbertone)
- [日本語](https://github.com/takahashim/js-stack-from-scratch) by [@takahashim](https://github.com/takahashim)
- [Русский](https://github.com/UsulPro/js-stack-from-scratch) by [React Theming](https://github.com/sm-react/react-theming)
- [ไทย](https://github.com/MicroBenz/js-stack-from-scratch) by [MicroBenz](https://github.com/MicroBenz)

## Credits

Създадено от [@verekia](https://twitter.com/verekia) – [verekia.com](http://verekia.com/).

Лиценз: MIT
