# 5 - The ES6 modules syntax

Here we simply replace `const Dog = require('./dog')` by `import Dog from './dog'`, which is the newer ES6 modules syntax (as opposed to "CommonJS" modules syntax).

In `dog.js`, we also replace `module.exports = Dog` by `export default Dog`.

Note that in `dog.js`, the name `Dog` is only used in the `export`. Therefore it could be possible to export directly an anonymous class like this instead:

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

You might now guess that the name 'Dog' used in the `import` in `index.js` is actually completely up to you. This would work just fine:

```javascript
import Cat from './dog';

const toby = new Cat('Toby');
```
Obviously, most of the time you will use the same name as the class / module you're importing.
A case where you don't do that is how we `const babel = require('gulp-babel')` in our Gulp file.

So what about those `require()`s in our `gulpfile.js`? Can we use `import` instead? The latest version of Node supports most ES6 features, but not ES6 modules yet. Luckily for us, Gulp is able to call Babel for help. If we rename our `gulpfile.js` to `gulpfile.babel.js`, Babel will take care of passing `import`ed modules to Gulp.

- Rename your `gulpfile.js` to `gulpfile.babel.js`

- Replace your `require()`s by:

```javascript
import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import { exec } from 'child_process';
```

Note the syntactic sugar to extract `exec` directly from `child_process`. Pretty elegant!

- `yarn start` should still print "Wah wah, I am Toby".

Next section: [6 - ESLint](/tutorial/6-eslint)

Back to the [previous section](/tutorial/4-es6-syntax-class) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
