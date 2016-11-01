# 5 - Синтаксис модулей ES6

Здесь мы просто заменим `const Dog = require('./dog')` на `import Dog from './dog'`, что является более новым синтаксисом ES6 модулей (по сравнению с синтаксисом "CommonJS" модулей).

В `dog.js`, мы также заменим `module.exports = Dog` на `export default Dog`.

Заметьте, что в `dog.js` переменная `Dog` используется только в `export`. Поэтому, вместо этого, можно напрямую экспортировать анонимный класс таким образом: 

```javascript
export default class {
  constructor(name) {
    this.name = name;
  }

  bark() {
    return `Wah wah, I am ${this.name}`;
  }
}
```

Вы возможно уже догадались, что имя 'Dog' используется в `import` в `index.js` совершенно по вашему усмотрению. Вполне будет работать:

```javascript
import Cat from './dog';

const toby = new Cat('Toby');
```
Очевидно, что в основном вы будете всегда использовать тоже имя что и имя класса/модуля которого вы импортируете.
Случай, когда вы не будете делать так, это когда мы ~~использовали~~ `const babel = require('gulp-babel')` в нашем Gulp файле.

Так что насчет тех `require()` в нашем `gulpfile.js`? Можем мы использовать `import` вместо них? Последняя версия Node поддерживает большую часть возможностей ES6, но не ES6 модули пока-что. К счастью для нас, Gulp способен призывать Babel на помощь. Если мы переименуем наш `gulpfile.js` в `gulpfile.babel.js`, Babel позаботится о передаче импортируемых через `import` модулей в Gulp.

- Переименуйте ваш `gulpfile.js` в `gulpfile.babel.js`

- Замените все `require()` на:

```javascript
import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import { exec } from 'child_process';
```

Обратите внимение на "синтаксический сахар", позволяющий получать `exec` напрямую из `child_process`. Довольно элегантно!

- `yarn start` должно по прежнему выводить "Wah wah, I am Toby".

Следующий раздел: [6 - ESLint](/tutorial/6-eslint)

Назад в [предыдущий раздел](/tutorial/4-es6-syntax-class) или [Содержание](https://github.com/verekia/js-stack-from-scratch).
