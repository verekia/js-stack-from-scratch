# 01 - Node, Yarn, and `package.json`

Кода за тази глава [тук](https://github.com/verekia/js-stack-walkthrough/tree/master/01-node-yarn-package-json).

В тази глава ще започнем с настройка на Node, Yarn, основен `package.json` файл и ще екпериментираме с един пакет (package).

## Node

> 💡 **[Node.js](https://nodejs.org/)** е среда за изпълнение на JavaScript. Главно се използва за бекенд разработки, но също така може да бъде използван за всякакви други. В контекста на фронтенд разбработването, може да бъде използван за изпълнението на цял набор от задачи - линтинг (linting), тестване (testing), сглобяване на файлове и т.н.

В това ръководство ще използваме Node за почти всичко, така че ще ви трябва. За да го свалите отидете [тук](https://nodejs.org/en/download/current/) за **макОС** или **Уиндоус**, или използвайте [package manager installations page](https://nodejs.org/en/download/package-manager/) за дистрибуции на Линукс.

Например, на **Ubuntu / Debian**, можете да използвате следната команда, за да инсталирате Node:

```sh
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Ще имате нужда от версии на Node > 6.5.0.

## Инструменти за управление на версиите на Node

Ако имате нужда да бъдете гъвкави и да можете да използвате различни версии на Node, прочетете [тук](https://github.com/creationix/nvm) или [тук](https://github.com/tj/n).

## NPM

NPM е основния мениджър за управление на пакети за Node. Инсталира се автоматично с инсталацията на Node. Мениджърите за управление на пакети се използват за инсталиране и управление на пакети (модули от код, написани от вас или някой друг). Ще използваме много пакети в това ръководство, но ще използваме друг пакетен мениджър, който се нарича Yarn.

## Yarn

> 💡 **[Yarn](https://yarnpkg.com/)** е друг Node пакетен мениджър, който е много по-бърз от NPM, има офлайн подръжка и си извлича зависимостите (dependencies) [по-предсказуемо](https://yarnpkg.com/en/docs/yarn-lock).

След като [излезе](https://code.facebook.com/posts/1840075619545360) през октомври 2016, получи доста добро приемане и скоро може да се превърне в избора за пакетен мениджър на JavaScript обществото. Ако искате да продължите да използвате NPM можете просто да замествате всички `yarn add` и `yarn add --dev` команди в това ръководство с `npm install --save` И `npm install --save-dev`.

Инсталирайте Yarn, следвайки следните [инструкчии](https://yarnpkg.com/en/docs/install) за вашата операционна система. Аз препоръчвам използването на  **инсталационния скрипт** от *Alternatives* таба ако сте с macOS или Unix, за да [не трябва](https://github.com/yarnpkg/yarn/issues/1505) да разчитате на други пакетни мениджъри:

```sh
curl -o- -L https://yarnpkg.com/install.sh | bash
```

## `package.json`

> 💡 **[package.json](https://yarnpkg.com/en/docs/package-json)** is the file used to describe and configure your JavaScript project. It contains general information (your project name, version, contributors, license, etc), configuration options for tools you use, and even a section to run *tasks*.

- Create a new folder to work in, and `cd` in it.
- Run `yarn init` and answer the questions (`yarn init -y` to skip all questions), to generate a `package.json` file automatically.

Here is the basic `package.json` I'll use in this tutorial:

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "license": "MIT"
}
```

## Hello World

- Create an `index.js` file containing `console.log('Hello world')`

🏁 Run `node .` in this folder (`index.js` is the default file Node looks for in a folder). It should print "Hello world".

**Note**: See that 🏁 racing flag emoji? I will use it every time you reach a **checkpoint**. We are sometimes going to make a lot of changes in a row, and your code may not work until you reach the next checkpoint.

## `start` script

Running `node .` to execute our program is a bit too low-level. We are going to use an NPM/Yarn script to trigger the execution of that code instead. That will give us a nice abstraction to be able to always use `yarn start`, even when our program gets more complicated.

- In `package.json`, add a `scripts` object like so:

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "license": "MIT",
  "scripts": {
    "start": "node ."
  }
}
```

`start` is the name we give to the *task* that will run our program. We are going to create a lot of different tasks in this `scripts` object throughout this tutorial. `start` is typically the name given to the default task of an application. Some other standard task names are `stop` and `test`.

`package.json` must be a valid JSON file, which means that you cannot have trailing commas. So be careful when editing manually your `package.json` file.

🏁 Run `yarn start`. It should print `Hello world`.

## Git and `.gitignore`

- Initialize a Git repository with `git init`

- Create a `.gitignore` file and add the following to it:

```gitignore
.DS_Store
/*.log
```

`.DS_Store` files are auto-generated macOS files that you should never have in your repository.

`npm-debug.log` and `yarn-error.log` are files that are created when your package manager encounters an error, we don't want them versioned in our repository.

## Installing and using a package

In this section we will install and use a package. A "package" is simply a piece of code that someone else wrote, and that you can use in your own code. It can be anything. Here, we're going to try a package that helps you manipulate colors for instance.

- Install the community-made package called `color` by running `yarn add color`

Open `package.json` to see how Yarn automatically added `color` in  `dependencies`.

A `node_modules` folder has been created to store the package.

- Add `node_modules/` to your `.gitignore`

You will also notice that a `yarn.lock` file got generated by Yarn. You should commit this file to your repository, as it will ensure that everyone in your team uses the same version of your packages. If you're sticking to NPM instead of Yarn, the equivalent of this file is the *shrinkwrap*.

- Write the following to your `index.js` file:

```js
const color = require('color')

const redHexa = color({ r: 255, g: 0, b: 0 }).hex()

console.log(redHexa)
```

🏁 Run `yarn start`. It should print `#FF0000`.

Congratulations, you installed and used a package!

`color` is just used in this section to teach you how to use a simple package. We won't need it anymore, so you can uninstall it:

- Run `yarn remove color`

## Two kinds of dependencies

There are two kinds of package dependencies, `"dependencies"` and `"devDependencies"`:

**Dependencies** are libraries you need for your application to function (React, Redux, Lodash, jQuery, etc). You install them with `yarn add [package]`.

**Dev Dependencies** are libraries used during development or to build your application (Webpack, SASS, linters, testing frameworks, etc). You install those with `yarn add --dev [package]`.

Next section: [02 - Babel, ES6, ESLint, Flow, Jest, Husky](02-babel-es6-eslint-flow-jest-husky.md#readme)

Back to the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
