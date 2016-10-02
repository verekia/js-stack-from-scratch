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

Typical ES6 code uses classes, `const` and `let`, "template strings" (with back ticks) like the one in `bark()`, and arrow functions (`(param) => { console.log('Hi'); }`), even though we're not using any in this example.

In `src/index.js`, write the following:

```javascript
const Dog = require('./dog');

const toby = new Dog('Toby');

console.log(toby.bark());
```
As you can see, unlike the NPM-community-made package `color` that we used before, when we require one of our files, we use `./` in the `require()`.

- Run `npm start` and it should print 'Wah wah, I am Toby'.

- Take a look at the code generated in `lib` to see how your compiled code looks like (`var` instead of `const` for instance).
