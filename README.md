# Стек технологий JavaScript с нуля
## JavaScript Stack from Scratch

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

>Это русскоязычная версия руководства Джонатана Верекии ([@verekia](https://twitter.com/verekia)). Оригинальное руководство расположено [здесь](https://github.com/verekia/js-stack-from-scratch). Данное пособие постоянно развивается и дополняется автором, предоставляя читателям максимально свежую и качественную информацию. Текст оригинального пособия и прилагаемый код будут меняться с течением времени. Мы так же будем стараться поддерживать русскоязычную версию в актуальном состоянии.

### Перевод практически завершен. Идет правка текста.

[будем благодарны за помощь в обнаружении опечаток и неточностей](https://github.com/UsulPro/js-stack-from-scratch/issues)

**Далее текст автора**

Добро пожаловать в мое современное руководство по стеку технологий JavaScript: **Стек технологий JavaScript с нуля**

Это минималистичное и практико-ориентированное пособие по применению JavaScript технологий. Вам потребуются общие знания по программированию и основы JavaScript. Это пособие **нацелено на интеграцию необходимых инструментов** и предоставляет **максимально простые примеры** для каждого инструмента. Вы можете рассматривать данный документ, как *возможность создать свой собственный шаблонный проект с нуля*.

Конечно, вам не нужны все эти технологии, если вы делаете простую веб страницу с парой JS функций (достаточно комбинаци Babel + jQuery), но если вы собираетесь создать масштабируемое веб приложение, и вам нужно все правильно настроить, то это руководство отлично вам подходит.

Поскольку целью этого руководства является сборка различных инструментов, я не буду вдаваться в детали по каждому из них. Если вы хотите получить по ним более глубокие знания, изучайте их документацию или другие руководства.

В большой части технологий, описываемых здесь, используется React. Если вы только начинаете использовать React и просто хотите изучить его, то [create-react-app](https://github.com/facebookincubator/create-react-app) поможет вам и кратко ознакомит с инфраструктурой React на основе предустановленной конфигурации. Я бы, например, порекомендовал такой подход для тех, кому нужно влиться в команду, использующую React, и на чем-то потренироваться, что бы подтянуть свои знания. В этом руководстве мы не будем пользоваться предустановленными конфигурациями, поскольку я хочу, чтобы вы полностью понимали все, что происходит "под капотом".

Примеры кода имеются в каждой части, и вы можете запускать их через `yarn && yarn start` или `npm install && npm start`. Я рекомендую писать все с нуля самостоятельно, следуя **пошаговым инструкциям** каждого раздела.

**Каждая часть содержит код, написанный в предыдущих частях**, так что, если вы просто хотите получить окончательный вариант проекта, содержащий все необходимое, просто скопируйте последний раздел и пользуйтесь на здоровье.

Примечание: Порядок частей не всегда обязателен. К примеру, тестирование / типизация могут быть выполнены до введения в React. Довольно сложно перемещать или редактировать опубликованные разделы, поскольку приходится вносить изменения во все следующие за ними части. Возможно, когда все определится, я приведу всю документацию к более удобному виду.

Код, приведенный в примерах, работает под Linux, macOS, и Windows.

## Содержание

[1 - Node, NPM, Yarn, и package.json](/tutorial/1-node-npm-yarn-package-json)

[2 - Установка и использование пакетов](/tutorial/2-packages)

[3 - Настройка ES6 с Babel и Gulp](/tutorial/3-es6-babel-gulp)

[4 - Использование ES6 классов](/tutorial/4-es6-syntax-class)

[5 - Синтаксис модулей ES6](/tutorial/5-es6-modules-syntax)

[6 - ESLint](/tutorial/6-eslint)

[7 - Клиентское приложение на основе Webpack](/tutorial/7-client-webpack)

[8 - React](/tutorial/8-react)

[9 - Redux](/tutorial/9-redux)

[10 - Immutable JS и улучшения Redux](/tutorial/10-immutable-redux-improvements)

[11 - Тестировние с Mocha, Chai, и Sinon](/tutorial/11-testing-mocha-chai-sinon)

[12 - Типизация с Flow](/tutorial/12-flow)

## Далее планируется:

Production / development окружение, Express, React Router, Серверный Рендеринг, Стилизация, Enzyme, Приемы Git.

## Переводы на другие языки

- [Китайский](https://github.com/pd4d10/js-stack-from-scratch) by [@pd4d10](http://github.com/pd4d10)
- [Итальянский](https://github.com/fbertone/js-stack-from-scratch) by [Fabrizio Bertone](https://github.com/fbertone)
- [Японский](https://github.com/takahashim/js-stack-from-scratch) by [@takahashim](https://github.com/takahashim)

Если вы хотите добавить перевод на другой язык, пожалуйста читайте [рекомендации по переводу](/how-to-translate.md) чтобы начать!

## Сведения

Создано [@verekia](https://twitter.com/verekia) – [verekia.com](http://verekia.com/).

Переведено [@usulpro](https://github.com/UsulPro) - [react-theming](https://github.com/sm-react/react-theming)

Лицензия: MIT
