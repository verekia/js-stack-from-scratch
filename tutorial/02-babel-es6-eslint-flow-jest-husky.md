# 02 - Babel, ES6, ESLint, Flow, Jest, and Husky

Кода за тази глава можете да намерите [тук](https://github.com/verekia/js-stack-walkthrough/tree/master/02-babel-es6-eslint-flow-jest-husky).

Тук ще използваме ES6 синтаксис, надграждащ "добрия стар" ES5 синтаксис (познат на всички просто като JavaScript). Всички браузъри и JS среди разбират и приемат добре ES5, но не и ES6. Тук на помощ идва инструмент наречен Babel!

## Babel

> 💡 **[Babel](https://babeljs.io/)** е компилатор, който трансформира ES6 код (и дпуги неща като например React's JSX синтаксис) в ES5 код. Предимство е, че е доста модулярен и може да бъде използван в много различни [среди](https://babeljs.io/docs/setup/). Засега това е предпочитания ES5 компилатор от React обществото.

- Преместете вашия `index.js` файл в нова папка наречена `src`. Това е мястото където ще пишеше вашия ES6 код. Премахнете кода, отнасящ се за `color` пакета в `index.js` файла и го заместете с:

```js
const str = 'ES6'
console.log(`Hello ${str}`)
```

Тук използваме т.нар. *template string*, което е ново свойство, предоставено от ES6, което ни позволява директно инжектиране на променливи в стринг, без да има нужда от конкатенация, използвайки `${}`. Обърнете внимание, че това се реализира чрез използване на задни кавички **backquotes**.

- Изпълнете `yarn add --dev babel-cli`, за да инсталирате CLI интерфейса за Babel.

Babel CLI предоставя [два модула](https://babeljs.io/docs/usage/cli/): `babel`, който компилира 
ES6 файлове до ES5 такива и `babel-node`, който можете да използвате, за да заместите извикванията към `node` и да изпълнявате директно ES6 файлове. `babel-node` е чудесен за разработка, но е прекалено тежък и не е предвиден за производствена среда (*production*). В тази глава ще използваме `babel-node` за настройка на средата за разработка, а в следващата ще използваме `babel` за приготвянето на ES5 файловете за *production*.

- В `package.json`, в `start` скрипта, заместете `node .` с `babel-node src` (`index.js` е файла по подразбиране, който се търси от Node при първоначалното зареждане, поради което можем да пропуснем изричното споменаване на `index.js`).

Ако сега опитате да изпълните `yarn start`, ще отпечата коректно резултата, но Babel всъщност все още не върши никаква работа. Това е така, закото не сме подали никаква информация за трансформациите, които искаме да се приложат. Единствената причина, поради която отпечатва правилно резултата е, че Node разбира ES6 без помощта на Babel. Но някои браузъри или стари версии на Node няма да могат!

- Изпълнете `yarn add --dev babel-preset-env`, за да инсталирате един от предварително зададените пакети за Babel наречен `env`, който съдържа конфигурации за най-новите свойства на ECMAScript, поддържани от Babel.

- Създайте `.babelrc` файл в основната директория на вашия проект, който файл е валиден JSON файл за вашата Babel конфигурация. Напишете следното, за да накарате Babel да използва `env`:

```json
{
  "presets": [
    "env"
  ]
}
```

🏁 `yarn start` все още трябва да работи, но сега наистина върши някаква работа. Ние не можем да кажем дали наистина е така, тъй като използваме `babel-node`, за да интерпретираме ES6 кода в момента на работа. Скоро ще имате доказателство, че вашия ES6 код наистина се трансформира когато достигнете до [синтаксис на ES6 модули](#the-es6-modules-syntax) секцията от тази глава.

## ES6

> 💡 **[ES6](http://es6-features.org/)**: Най-значимото подобрение на JavaScript езика. Има прекалено много новости идващи от ES6, за да ги изложа тук, но типичен ES6 код използва класове с `class`, `const` и `let`, темплейт стрингове и arrow функции (`(text) => { console.log(text) }`).

### Създаване на ES6 клас

- Създайте нов файл, `src/dog.js`, съдържащ следния ES6 клас:

```js
class Dog {
  constructor(name) {
    this.name = name
  }

  bark() {
    return `Wah wah, I am ${this.name}`
  }
}

module.exports = Dog
```

Ако не сте се занимавали с ООП (обектно ориентирано програмиране) преди, това не би трябвало да ви изглежда изненадващо, тъй като е сравнително ново за JavaScript също. Класът е открит за използване от външния свят чрез присвояването му на `module.exports`.

В `src/index.js`, напишете следното:

```js
const Dog = require('./dog')

const toby = new Dog('Toby')

console.log(toby.bark())
```

Както можете да видите, за разлика от пакета `color`, който използвахме преди, тук когато искаме да използваме един от нашите файлове трябва да използваме `./` в `require()`.

🏁 Изпълнете `yarn start`, трябва да отпечата "Wah wah, I am Toby".

### Синтаксис на ES6 модули

Тук просто заместваме `const Dog = require('./dog')` с `import Dog from './dog'`, което идва от по-новия ES6 синтаксис за ES6 модули (точно обратното на "CommonJS" модулния синтаксис). В момента не се поддържа от NodeJS, така че това е вашето доказателство, че Babel обработва тези ES6 файлове правилно.

В `dog.js`, също така заместваме `module.exports = Dog` с `export default Dog`

🏁 `yarn start` все още трябва да отпечатва "Wah wah, I am Toby".

## ESLint

> 💡 **[ESLint](http://eslint.org)** е *линтера* най-често избиран при работа с ES6 код. Линтер е нещо, което ви дава препоръки за форматиране на кода, което налага консистентност в стила на програмиране на вашия код и кода, който споделяте с вашия екип. Също така е много добър начин за учене JavaScript чрез правене на грешки, които ESLint хваща и ви показва.

ESLint работи с *правила*, съществуват [много такива правила](http://eslint.org/docs/rules/). Вместо да конфигурираме правилата, които искаме да използваме в нашия код, ще използваме конфигурацията създадена от Airbnb. Тази конфигурация използва няколко плъгина, така че ще трябва да ги инсталираме и тях.

Проверете най-последните [инструкции](https://www.npmjs.com/package/eslint-config-airbnb) от Airbnb за инсталиране на конфигурационния пакет и всички негови зависимости (dependencies) правилно. От 03.02.2017 насам, те препоръчват използването на следната команда във вашия терминал:

```sh
npm info eslint-config-airbnb@latest peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add --dev eslint-config-airbnb@latest
```

Това би трябвало да инсталира всичко, от което имате нужда и да добави `eslint-config-airbnb`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y` и `eslint-plugin-react` във вашия `package.json` файл автоматично.

**Забележка**: Аз заместих `npm install` с `yarn add` в командата. Също така, това няма да работи на Windows, така че погледнете в `package.json` файла в това репозитори и просто инсталирайте всички неща отнасящи се до ESLint ръчно, използвайки `yarn add --dev packagename@^#.#.#`, като на мястото на `#.#.#` поставете версиите на всеки пакет посочени в `package.json` файла.

- Създайте `.eslintrc.json` файл в основната директория на вашия проект, по същия начин както направихме за Babel и напишете следното в него:

```json
{
  "extends": "airbnb"
}
```

Ще създадем NPM/Yarn скрипт, който да стартира ESLint вместо нас. Нека инсталираме `eslint` пакета, за да можем да използваме `eslint` CLI:

- Изпълнете `yarn add --dev eslint`

Обновете `scripts` във вашия `package.json` като добавите нова `test` задача:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src"
},
```

Тук просто казваме на ESLint, че искаме да се изпълнява варху всички JavaScript файлове в папката `src`.

Ще използваме тази стандартна `test` задача, за да изпълняваме поредица от всички команди валидиращи по някакъв начин кода ни - било то с лингинг, проверка на типовете или юнит тестване.

- Изпълнете `yarn test` и би трябвало да видите цяла поредица от грешки отнасящи се до липсващи точки и запетаи, предупреждения за използвани `console.log()` в `index.js`. Добавете `/* eslint-disable no-console */` най-отгоре в вашия `index.js` файл, за да позволите използването на `console` в този файл.

**Забележка**: Ако използвате Windows, проверете дали вашия редактор и Git на настроени да използват Unix LF line endings, а не Windows CRLF. Ако вашият проект биде използван само в Windows базирани среди, бихте могли да добавите `"linebreak-style": [2, "windows"]` в `правилата` на ESLint масива (вижте примера по-долу), за да наложите използването на CRLF.

### Semicolons

Alright, this is probably the most heated debate in the JavaScript community, let's talk about it for a minute. JavaScript has this thing called Automatic Semicolon Insertion, which allows you to write your code with or without semicolons. It really comes down to personal preference and there is no right and wrong on this topic. If you like the syntax of Python, Ruby, or Scala, you will probably enjoy omitting semicolons. If you prefer the syntax of Java, C#, or PHP, you will probably prefer using semicolons.

Most people write JavaScript with semicolons, out of habit. That was my case until I tried going semicolon-less after seeing code samples from the Redux documentation. At first it felt a bit weird, simply because I was not used to it. After just one day of writing code this way I could not see myself going back to using semicolons at all. They felt so cumbersome and unnecessary. A semicolon-less code is easier on the eyes in my opinion, and is faster to type.

I recommend reading the [ESLint documentation about semicolons](http://eslint.org/docs/rules/semi). As mentioned in this page, if you're going semicolon-less, there are some rather rare cases where semicolons are required. ESLint can protect you from such cases with the `no-unexpected-multiline` rule. Let's set up ESLint to safely go semicolon-less in `.eslintrc.json`:

```json
{
  "extends": "airbnb",
  "rules": {
    "semi": [2, "never"],
    "no-unexpected-multiline": 2
  }
}
```

🏁 Run `yarn test`, and it should now pass successfully. Try adding an unnecessary semicolon somewhere to make sure the rule is set up correctly.

I am aware that some of you will want to keep using semicolons, which will make the code provided in this tutorial inconvenient. If you are using this tutorial just for learning, I'm sure it will remain bearable to learn without semicolons, until going back to using them on your real projects. If you want to use the code provided in this tutorial as a boilerplate though, it will require a bit of rewriting, which should be pretty quick with ESLint set to enforce semicolons to guide you through the process. I apologize if you're in such case.

### Compat

[Compat](https://github.com/amilajack/eslint-plugin-compat) is a neat ESLint plugin that warns you if you use some JavaScript APIs that are not available in the browsers you need to support. It uses [Browserslist](https://github.com/ai/browserslist), which relies on [Can I Use](http://caniuse.com/).

- Run `yarn add --dev eslint-plugin-compat`

- Add the following to your `package.json`, to indicate that we want to support browsers that have more than 1% market share:

```json
"browserslist": ["> 1%"],
```

- Edit your `.eslintrc.json` file like so:

```json
{
  "extends": "airbnb",
  "plugins": [
    "compat"
  ],
  "rules": {
    "semi": [2, "never"],
    "no-unexpected-multiline": 2,
    "compat/compat": 2
  }
}
```

You can try the plugin by using `navigator.serviceWorker` or `fetch` in your code for instance, which should raise an ESLint warning.

### ESLint in your editor

This chapter set you up with ESLint in the terminal, which is great for catching errors at build time / before pushing, but you also probably want it integrated to your IDE for immediate feedback. Do NOT use your IDE's native ES6 linting. Configure it so the binary it uses for linting is the one in your `node_modules` folder instead. This way it can use all of your project's config, the Airbnb preset, etc. Otherwise you will just get some generic ES6 linting.

## Flow

> 💡 **[Flow](https://flowtype.org/)**: A static type checker by Facebook. It detects inconsistent types in your code. For instance, it will give you an error if you try to use a string where should be using a number.

Right now, our JavaScript code is valid ES6 code. Flow can analyze plain JavaScript to give us some insights, but in order to use its full power, we need to add type annotations in our code, which will make it non-standard. We need to teach Babel and ESLint what those type annotations are in order for these tools to not freak out when parsing our files.

- Run `yarn add --dev flow-bin babel-preset-flow babel-eslint eslint-plugin-flowtype`

`flow-bin` is the binary to run Flow in our `scripts` tasks, `babel-preset-flow` is the preset for Babel to understand Flow annotations, `babel-eslint` is a package to enable ESLint *to rely on Babel's parser* instead of its own, and `eslint-plugin-flowtype` is an ESLint plugin to lint Flow annotations. Phew.

- Update your `.babelrc` file like so:

```json
{
  "presets": [
    "env",
    "flow"
  ]
}
```

- And update `.eslintrc.json` as well:

```json
{
  "extends": [
    "airbnb",
    "plugin:flowtype/recommended"
  ],
  "plugins": [
    "flowtype",
    "compat"
  ],
  "rules": {
    "semi": [2, "never"],
    "no-unexpected-multiline": 2,
    "compat/compat": 2
  }
}
```

**Note**: The `plugin:flowtype/recommended` contains the instruction for ESLint to use Babel's parser. If you want to be more explicit, feel free to add `"parser": "babel-eslint"` in `.eslintrc.json`.

I know this is a lot to take in, so take a minute to think about it. I'm still amazed that it is even possible for ESLint to use Babel's parser to understand Flow annotations. These 2 tools are really incredible for being so modular.

- Chain `flow` to your `test` task:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src && flow"
},
```

- Create a `.flowconfig` file at the root of your project containing:

```flowconfig
[options]
suppress_comment= \\(.\\|\n\\)*\\flow-disable-next-line
```

This is a little utility that we set up to make Flow ignore any warning detected on the next line. You would use it like this, similarly to `eslint-disable`:

```js
// flow-disable-next-line
something.flow(doesnt.like).for.instance()
```

Alright, we should be all set for the configuration part.

- Add Flow annotations to `src/dog.js` like so:

```js
// @flow

class Dog {
  name: string

  constructor(name: string) {
    this.name = name
  }

  bark() {
    return `Wah wah, I am ${this.name}`
  }
}

export default Dog
```

The `// @flow` comment tells Flow that we want this file to be type-checked. For the rest, Flow annotations are typically a colon after a function parameter or a function name. Check out the [documentation](https://flowtype.org/docs/quick-reference.html) for more details.

- Add `// @flow` at the top of `index.js` as well.

`yarn test` should now both lint and type-check your code fine.

There are 2 things that I want you to try:

- In `dog.js`, replace `constructor(name: string)` by `constructor(name: number)`, and run `yarn test`. You should get a **Flow** error telling you that those types are incompatible. That means Flow is set up correctly.

- Now replace `constructor(name: string)` by `constructor(name:string)`, and run `yarn test`. You should get an **ESLint** error telling you that Flow annotations should have a space after the colon. That means the Flow plugin for ESLint is set up correctly.

🏁 If you got the 2 different errors working, you are all set with Flow and ESLint! Remember to put the missing space back in the Flow annotation.

### Flow in your editor

Just like with ESLint, you should spend some time configuring your editor / IDE to give you immediate feedback when Flow detects issues in your code.

## Jest

> 💡 **[Jest](https://facebook.github.io/jest/)**: A JavaScript testing library by Facebook. It is very simple to set up and provides everything you would need from a testing library right out of the box. It can also test React components.

- Run `yarn add --dev jest babel-jest` to install Jest and the package to make it use Babel.

- Add the following to your `.eslintrc.json` at the root of the object to allow the use of Jest's functions without having to import them in every test file:

```json
"env": {
  "jest": true
}
```

- Create a `src/dog.test.js` file containing:

```js
import Dog from './dog'

test('Dog.bark', () => {
  const testDog = new Dog('Test')
  expect(testDog.bark()).toBe('Wah wah, I am Test')
})
```

- Add `jest` to your `test` script:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src && flow && jest --coverage"
},
```

The `--coverage` flag makes Jest generate coverage data for your tests automatically. This is useful to see which parts of your codebase lack testing. It writes this data into a `coverage` folder.

- Add `/coverage/` to your `.gitignore`

🏁 Run `yarn test`. After linting and type checking, it should run Jest tests and show a coverage table. Everything should be green!

## Git Hooks with Husky

> 💡 **[Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)**: Scripts that are run when certain actions like a commit or a push occur.

Okay so we now have this neat `test` task that tells us if our code looks good or not. We're going to set up Git Hooks to automatically run this task before every `git commit` and `git push`, which will prevent us from pushing bad code to the repository if it doesn't pass the `test` task.

[Husky](https://github.com/typicode/husky) is a package that makes this very easy to set up Git Hooks.

- Run `yarn add --dev husky`

All we have to do is to create two new tasks in `scripts`, `precommit` and `prepush`:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src && flow && jest --coverage",
  "precommit": "yarn test",
  "prepush": "yarn test"
},
```

🏁 If you now try to commit or push your code, it should automatically run the `test` task.

If it does not work, it is possible that `yarn add --dev husky` did not install the Git Hooks properly. I have never encountered this issue but it happens for some people. If that's your case, run `yarn add --dev husky --force`, and maybe post a note describing your situation in [this issue](https://github.com/typicode/husky/issues/84).

**Note**: If you are pushing right after a commit, you can use `git push --no-verify` to avoid running all the tests again.

Next section: [03 - Express, Nodemon, PM2](03-express-nodemon-pm2.md#readme)

Back to the [previous section](01-node-yarn-package-json.md#readme) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
