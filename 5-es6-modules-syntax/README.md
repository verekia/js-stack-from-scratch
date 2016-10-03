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
Note that in the Gulpfile, we use `require()` because Node does not support the ES6 module syntax. The latest version of Node support most of the ES6 features, but this one in particular isn't there yet.


Next section: [6 - ESLint](/6-eslint)

Back to the [previous section](/4-es6-syntax-class) or the [table of contents](https://github.com/verekia/modern-js-stack-training).
