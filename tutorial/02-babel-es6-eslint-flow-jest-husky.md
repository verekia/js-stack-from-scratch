# 02 - Babel, ES6, ESLint, Flow, Jest, i Husky

Kod dla tego rozdziału dostępny jest [tutaj](https://github.com/verekia/js-stack-walkthrough/tree/master/02-babel-es6-eslint-flow-jest-husky).

Użyjemy teraz składni ES6, co stanowi wielką poprawę w stosunku do "starej" składni ES5. Wszystkie przeglądarki i środowiska JS dobrze rozumieją ES5, ale nie ES6. Tam właśnie na ratunek przychodzi narzędzie o nazwie Babel!

## Babel

> 💡 **[Babel](https://babeljs.io/)** to kompilator, który przekształca kod ES6 (i inne rzeczy, takie jak składnia JSX Reacta) w kod ES5. Jest bardzo modułowy i może być używany w przeróżnych [środowiskach](https://babeljs.io/docs/setup/). Jest to zdecydowanie preferowany kompilator ES5 społeczności React.

- Przenieś swój `index.js` do nowego `src` folderu. Tutaj napiszesz swój kod ES6. Usuń poprzedni kod związany z `color` w `index.js`, i zamień prostym:

```js
const str = 'ES6'
console.log(`Hello ${str}`)
```

Używamy tutaj *template string*, który jest w ES6 i pozwala nam wstrzykiwać zmienne bezpośrednio do ciągu znaków bez konkatenacji za pomocą `${}`. Zauważ, że ciągi szablonów są tworzone przy użyciu **backquotes**.

- Uruchom `yarn add --dev babel-cli` aby zainstalować interfejs CLI dla Babel.

Babel CLI pochodzi z [dwóch plików wykonalnych](https://babeljs.io/docs/usage/cli/): `babel`, który kompiluje pliki ES6 w nowe pliki ES5, oraz `babel-node`, którego możesz użyć do zastąpienia połączenia z binarką `node` i uruchamiać pliki ES6 bezpośrednio w locie. `babel-node` jest świetny do programowania, ale jest ciężki i nie jest przeznaczony do produkcji. W tym rozdziale będziemy korzystać z `babel-node` aby skonfigurować środowisko programistyczne, a w następnym użyjemy `babel` do zbudowania plików ES5 do produkcji.

- W `package.json`, w Twoim skrypcie `start`, zamień `node .` z `babel-node src` (`index.js` jest domyślnym plikiem, którego szuka Node, dlatego możemy pominąć `index.js`).

Jeśli spróbujesz uruchomić teraz `yarn start`, powinien wypisać poprawne wyjście, ale Babel tak naprawdę nic nie robi. To dlatego, że nie podaliśmy żadnych informacji o transformacjach, które chcemy zastosować. Jedynym powodem, dla którego drukuje prawidłowe dane wyjściowe, jest to, że Node natywnie rozumie ES6 bez pomocy Babela. Niektóre przeglądarki lub starsze wersje Node nie byłyby jednak tak skuteczne!

- Uruchom `yarn add --dev babel-preset-env` aby zainstalować pakiet ustawień Babel o nazwie `env`, który zawiera konfiguracje dla najnowszych funkcji ECMAScript obsługiwanych przez Babel.

- Stwórz plik `.babelrc`  w katalogu głównym projektu, który jest plikiem JSON dla konfiguracji Babel. Wpisz do niego następujące polecenie, aby Babel użył ustawienia wstępnego `env`:

```json
{
  "presets": [
    "env"
  ]
}
```

🏁 `yarn start` powinien nadal działać, ale w rzeczywistości teraz coś robi. Nie możemy jednak stwierdzić, czy tak jest, ponieważ używamy `babel-node` do interpretacji kodu ES6 w locie. Wkrótce będziesz mieć dowód, że Twój kod ES6 jest faktycznie przekształcany, gdy dojdziesz do [ES6 modules syntax](#the-es6-modules-syntax) sekcji w tym rozdziale.

## ES6

> 💡 **[ES6](http://es6-features.org/)**: Najbardziej znacząca poprawa języka JavaScript. Istnieje zbyt wiele funkcji ES6, aby je tutaj wymienić, ale typowy kod ES6 używa klas z `class`, `const` i `let`, template strings, i arrow functions (`(text) => { console.log(text) }`).

### Tworzenie klasy ES6

- Stwórz nowy plik, `src/dog.js`, zawierający następującą klasę ES6:

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

Nie powinno cię to dziwić, jeśli robiłeś coś z OOP w przeszłości w jakimkolwiek języku. Jest jednak stosunkowo nowy dla JavaScript. Klasa jest wystawiona na świat zewnętrzny poprzez zadanie `module.exports`.

W `src/index.js`, wpisz następująco:

```js
const Dog = require('./dog')

const toby = new Dog('Toby')

console.log(toby.bark())
```

Jak widać, w przeciwieństwie do tworzonego przez społeczność pakietu `color`, którego używaliśmy wcześniej, kiedy wymagamy jednego z naszych plików, używamy `./` w `require()`.

🏁 Uruchom `yarn start` i powinno wypisać "Wah wah, I am Toby".

### The ES6 modules syntax

Tutaj po prostu zastępujemy `const Dog = require('./dog')` poprzez `import Dog from './dog'`, która jest nowszą składnią modułów ES6 (w przeciwieństwie do składni modułów "CommonJS"). Obecnie nie jest natywnie obsługiwany przez NodeJS, więc jest to dowód na to, że Babel poprawnie przetwarza te pliki ES6.

W `dog.js`, również zamieńmy `module.exports = Dog` poprzez `export default Dog`

🏁 `yarn start` powinien znów wypisać "Wah wah, I am Toby".

## ESLint

> 💡 **[ESLint](http://eslint.org)** jest linterem z wyboru dla kodu ES6. Linter zawiera zalecenia dotyczące formatowania kodu, które wymuszają spójność stylu w kodzie i kodzie udostępnianym zespołowi. Jest to również świetny sposób na naukę JavaScript, popełniając błędy, które wyłapie ESLint.

ESLint działa z *regułami* i istnieje [wiele z nich](http://eslint.org/docs/rules/). Zamiast samodzielnie konfigurować reguły dla naszego kodu, użyjemy konfiguracji stworzonej przez Airbnb. Ta konfiguracja wykorzystuje kilka wtyczek, więc musimy je również zainstalować.

Sprawdź dla Airbnb najnowsze [instrukcje](https://www.npmjs.com/package/eslint-config-airbnb) aby poprawnie zainstalować pakiet konfiguracyjny i wszystkie jego zależności. W dniu 2017-02-03 zalecamy użycie następującego polecenia w terminalu:

```sh
npm info eslint-config-airbnb@latest peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add --dev eslint-config-airbnb@latest
```

Powinien zainstalować wszystko, czego potrzebujesz i dodać `eslint-config-airbnb`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, oraz `eslint-plugin-react` do Twojego pliku `package.json` automatycznie.

**Uwaga**: Zamieniłem `npm install` poprzez `yarn add` w tym poleceniu. To również nie będzie działać w systemie Windows, więc spójrz na plik `package.json` tego repozytorium i po prostu ręcznie zainstaluj wszystkie zależności związane z ESLint używając `yarn add --dev packagename@^#.#.#` z `#.#.#` będące wersjami podanymi w `package.json` dla każdego pakietu.

- Stwórz plik `.eslintrc.json` na górze projektu, tak jak zrobiliśmy to dla Babel, i wpisz do niego:

```json
{
  "extends": "airbnb"
}
```

Stworzymy skrypt NPM/Yarn do uruchomienia ESLint. Zainstalujmy pakiet `eslint`, aby móc korzystać z CLI `eslint`:

- Uruchom `yarn add --dev eslint`

Zaktualizuj `scripts` Twojego `package.json` aby zawierało nowe zadanie `test`:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src"
},
```

Here we just tell ESLint that we want it to lint all JavaScript files under the `src` folder.

We will use this standard `test` task to run a chain of all the commands that validate our code, whether it's linting, type checking, or unit testing.

- Run `yarn test`, and you should see a whole bunch of errors for missing semicolons, and a warning for using `console.log()` in `index.js`. Add `/* eslint-disable no-console */` at the top of our `index.js` file to allow the use of `console` in this file.

**Note**: If you're on Windows, make sure you configure your editor and Git to use Unix LF line endings and not Windows CRLF. If your project is only used in Windows environments, you can add `"linebreak-style": [2, "windows"]` in ESLint's `rules` array (see the example below) to enforce CRLF instead.

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
