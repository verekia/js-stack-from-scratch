# 11 - Тестировние с Mocha, Chai, и Sinon

## Mocha and Chai

- Создайте директорию `src/test`. Эта папка будет отражать структуру директорий нашего приложения, поэтому создайте также `src/test/client` (можете так же добавить `server` и `shared`, если хотите, но мы не будем писать тесты для них).

- В `src/test/client`, создайте файл `state-test.js` , в котором мы будем тестировать жизненный цикл нашего Redux приложеия.

Мы будем использовать [Mocha](http://mochajs.org/) в качесве основного фреймворка для тестирования. Mocha прост в использовании, имеет множество возможностей, и на данный момент [самый популярный фреймворк для тестирования](http://stateofjs.com/2016/testing/). Он модульный и очень гибкий. В частности, он позволяет использовать любые библиотеки утверждений (assertion) на ваше пожелание. [Chai](http://chaijs.com/) - замечательная библиотека утверждений, имеющая много доступных [плагинов](http://chaijs.com/plugins/) и позволяющая вам выбирать между различными стилями утверждений.

- Установим Mocha и Chai выполним `yarn add --dev mocha chai`

В `state-test.js`, напишите следующее:

```javascript
/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */

import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import { should } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import dogReducer from '../../client/reducers/dog-reducer';
import { makeBark } from '../../client/actions/dog-actions';

should();
let store;

describe('App State', () => {
  describe('Dog', () => {
    beforeEach(() => {
      store = createStore(combineReducers({
        dog: dogReducer,
      }));
    });
    describe('makeBark', () => {
      it('should make hasBarked go from false to true', () => {
        store.getState().getIn(['dog', 'hasBarked']).should.be.false;
        store.dispatch(makeBark());
        store.getState().getIn(['dog', 'hasBarked']).should.be.true;
      });
    });
  });
});
```
Хорошо, давайте все это проанализируем.

Во-первых, заметьте, что мы импортировали стиль утверждений `should` из пакета `chai`. Это позволит нам делать утверждения, используя синтаксис вида `mynumber.should.equal(3)` (что в Русском переводе можно представить как: `моечисло.должно.ровняться(3)` - прим. пер.), довольно изящно. Для того, что бы мы могли вызывать `should` на любом объекте, мы должны прежде всего запустить функцию `should()`. Некоторые из этих утверждений являются *выражениями*, как `mybook.should.be.true`, что заставляет ESLint сердиться, так что мы добавили для него комментарий в начале чтобы отключить правило `no-unused-expressions` для этого файла.

Тесты Mocha устроены наподобие дерева. В нашем случае, мы хотим протестировать функцию `makeBark`, которая должна воздействовать на атрибут `dog` состояния нашего приложения, поэтому имеет смысл использовать следующую иерархию тестов: `App State > Dog > makeBark`, что мы и описали используя `describe()`. `it()`  - это собственно, тестирующая функция, а `beforeEach()` - это функция, вызываемая перед каждым вызовом теста `it()`. В нашем случае мы хотим иметь новую чистую версию хранилища перед запуском каждого теста. Мы обявили переменную `store` в начале файла, поскольку она нам пригодится в кадом тесте.

Тест `makeBark` вполне понятен, а строка с описанием в `it()` делает его еще яснее: мы проверяем, что `hasBarked` меняется с `false` на `true` после вызова  `makeBark`.

Отлично, запустим этот тест!

- Создайте следующую задачу `test`, которая основывается на плагине `gulp-mocha`:

```javascript
import mocha from 'gulp-mocha';

const paths = {
  // [...]
  allLibTests: 'lib/test/**/*.js',
};

// [...]

gulp.task('test', ['build'], () =>
  gulp.src(paths.allLibTests)
    .pipe(mocha())
);
```

- Конечно же, выполните `yarn add --dev gulp-mocha`.

Как вы можете видеть, тесты запускаются на транспилированом коде из папки `lib`, вот почему задачу `test` предваряет запуск `build`. `build`,  в свою очередь, предваряется задачей `lint`, а сам `test` мы будем запускать перед `main`, что в итоге даст нам следующий каскад задач для `default`: `lint` > `build` > `test` > `main`.

`build` also has a prerequisite, `lint`, and finally, we are making `test` a prerequisite of `main`, which gives us the following task cascade for the `default` task: `lint` > `build` > `test` > `main`.

- Установите в `main` предварительный запуск команды `test`:

```javascript
gulp.task('main', ['test'], () => /* ... */ );
```

- В `package.json`, текущее значение скрипта `"test"` на следующее: `"test": "gulp test"`. Таким образом мы можем использовать `yarn test` чтобы просто запустить наши тесты. Так же `test` - это стандартный скрипт, который автоматически запускается такими инструментами, как, например, сервисы непрерывной интеграции (continuous integration services, CI), так что всегда добавляйте запуск тестов через него. `yarn start` также запустит тестирование перед построением сборки Webpack, так что сборка сгенерируется только если все тесты будут пройдены.

- Запустите `yarn test` или `yarn start`, и должны будут выйти результаты ваших тестов, предпочтительно зеленые.

## Sinon

В некоторых случаях, мы хотим иметь возможность *эмулировать* некоторые вещи в юнит тестах. Например, давайте скажем, у нас есть функция `deleteEverything`, которая содержит вызов `deleteDatabases()`. Запуск `deleteDatabases()` вызовет много побочных эффектов, которые нам абсолютно не желательны, во время тестирования.

[Sinon](http://sinonjs.org/) - библиотека тестирования, предлагающая **Заглушки** (и многие другие вещи), позволяет нейтрализовать `deleteDatabases` и просто мониторить ее не запуская на самом деле. Таким образом, к примеру, мы можем тестировать была ли она запущена или с какими параметрами она была запущена. Обычно, это очень полезно эмуляции или исключения AJAX вызовов, которые могут вызвать побочные эффекты на сервере. 

В рамках нашего приложения, мы добавим метод `barkInConsole` в класс `Dog` в файле `src/shared/dog.js`:

```javascript
class Dog {
  constructor(name) {
    this.name = name;
  }

  bark() {
    return `Wah wah, I am ${this.name}`;
  }

  barkInConsole() {
    /* eslint-disable no-console */
    console.log(this.bark());
    /* eslint-enable no-console */
  }
}

export default Dog;
```
Если мы запустим `barkInConsole` в нашем юнит тесте, то `console.log()` выведет что-то в терминал. Давайте мы будем это рассматривать, как нежелательный побочный эффект в рамках нашего юнит теста. Тем не менее мы желаем, знать была ли `console.log()` *нормально запущена*, и какие параметры были *переданы ей при вызове*.

- Создайте новый файл `src/test/shared/dog-test.js` и добавьте туда следующее:

```javascript
/* eslint-disable import/no-extraneous-dependencies, no-console */

import chai from 'chai';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { describe, it } from 'mocha';
import Dog from '../../shared/dog';

chai.should();
chai.use(sinonChai);

describe('Shared', () => {
  describe('Dog', () => {
    describe('barkInConsole', () => {
      it('should print a bark string with its name', () => {
        stub(console, 'log');
        new Dog('Test Toby').barkInConsole();
        console.log.should.have.been.calledWith('Wah wah, I am Test Toby');
        console.log.restore();
      });
    });
  });
});
```

Тут мы используем *заглушки* от Sinon и плагин для Chai, посволяющий использовать его утверждения на таких заглушках и им подобных.

- Запустите `yarn add --dev sinon sinon-chai` чтобы установить эти библиотеки.

Что здесь нового? Ну прежде всего, мы вызываем `chai.use(sinonChai)`, чтобы активировать плагин для Chai. Затем, вся магия происходит внутри `it()`: `stub(console, 'log')` нейтрализует `console.log` и следит за ней. Когда `new Dog('Test Toby').barkInConsole()` выполнен, `console.log` должна была бы сработать. Мы проверяем этот вызов `console.log` с помощью `console.log.should.have.been.calledWith()`, а затем, восстанавливаем с помощью `restore` нейтрализированную `console.log`, чтобы позволить ей дальше работать нормльно.

**Важное замечание**: Заглушать `console.log` не рекомендуется, потому, что если тест провалится, то `console.log.restore()` никогда не запустится, и следовательно `console.log` останется неисправной для всех остальных команд, выполняемых в терминале. При этом даже не выйдет сообщения об ошибке прохождения теста, так что вы останетесь с очень малой информацией о том, что же произошло. Это может оказаться достаточно не приятно. Тем не менее, это хороший пример, иллюстрирующий применение заглушек в этом простом приложении.

Если в этом разделе прошло хорошо, то у вас должно быть два пройденых теста.

Следующий раздел:  [12 - Типизация с Flow](/tutorial/12-flow)

Назад в [предыдущий раздел](/tutorial/10-immutable-redux-improvements) или [Содержание](/../../).
