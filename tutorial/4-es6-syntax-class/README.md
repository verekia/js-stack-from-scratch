# 4 - Using the ES6 syntax with a class

- Create a new file, `src/dog.js`, containing the following ES6 class:

```javascript
class Dog {
  constructor(name) {
    this.name = name;
  }

  bark() {
    return `Wah wah, I am ${this.name}`;
  }
}

module.exports = Dog;
```

It should not look surprising to you if you've done OOP in the past in any language. It's relatively recent for JavaScript though. The class is exposed to the outside world via the `module.exports` assignment.

Typical ES6 code uses classes, `const` and `let`, "template strings" (with back ticks) like the one in `bark()`, and arrow functions (`(param) => { console.log('Hi'); }`), even though we're not using any in this example.

In `src/index.js`, write the following:

```javascript
const Dog = require('./dog');

const toby = new Dog('Toby');

console.log(toby.bark());
```

As you can see, unlike the community-made package `color` that we used before, when we require one of our files, we use `./` in the `require()`.

- Run `yarn start` and it should print 'Wah wah, I am Toby'.

- Take a look at the code generated in `lib` to see what your compiled code looks like (`var` instead of `const` for instance).

Next section: [5 - The ES6 modules syntax](/tutorial/5-es6-modules-syntax)

Back to the [previous section](/tutorial/3-es6-babel-gulp) or the [table of contents](https://github.com/verekia/js-stack-from-scratchhttps://github.com/nagamalli9999/js-stack-from-scratch#table-of-contents).
