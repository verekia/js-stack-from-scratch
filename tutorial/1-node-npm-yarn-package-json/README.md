# 1 - Node, NPM, Yarn, and package.json

In this section we will set up Node, NPM, Yarn, and a basic `package.json` file.

First, we need to install Node, which is not only used for back-end JavaScript, but all the tools we need to build a modern Front-End stack.

Head to the [download page](https://nodejs.org/en/download/current/) for macOS or Windows binaries, or the [package manager installations page](https://nodejs.org/en/download/package-manager/) for Linux distributions.

For instance, on **Ubuntu / Debian**, you would run the following commands to install Node:

```bash
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

You want any version of Node > 6.5.0.

`npm`, the default package manager for Node, comes automatically with Node, so you don't have to install it yourself.

**Note**: If Node is already installed, install `nvm` ([Node Version Manager](https://github.com/creationix/nvm)), make `nvm` install and use the latest version of Node for you.

[Yarn](https://yarnpkg.com/) is another package manager which is much faster than NPM, has offline support, and fetches dependencies [more predictably](https://yarnpkg.com/en/docs/yarn-lock). Since it [came out](https://code.facebook.com/posts/1840075619545360) in October 2016, it received a very quick adoption and is becoming the new package manager of choice of the JavaScript community. We are going to use Yarn in this tutorial. If you want to stick to NPM you can simply replace all `yarn add` and `yarn add --dev` commands of this tutorial by `npm install --save` and `npm install --save-dev`.

- Install Yarn by following the [instructions](https://yarnpkg.com/en/docs/install). You can likely install it with `npm install -g yarn` or `sudo npm install -g yarn` (yeah, we're using NPM to install Yarn, much like you would use Internet Explorer or Safari to install Chrome!).

- Create a new folder to work in, and `cd` in it.
- Run `yarn init` and answer the questions (`yarn init -y` to skip all questions), to generate a `package.json` file automatically.
- Create an `index.js` file containing `console.log('Hello world')`.
- Run `node .` in this folder (`index.js` is the default file Node looks for in the current folder). It should print "Hello world".

Running `node .` to execute our program is a bit too low-level. We are going to use an NPM/Yarn script to trigger the execution of that code instead. That will give us a nice abstraction to be able to always use `yarn start`, even when our program gets more complicated.

- In `package.json`, add a `scripts` object to the root object like so:

```json
"scripts": {
  "start": "node ."
}
```

`package.json` must be a valid JSON file, which means that you cannot have trailing commas. So be careful when editing manually your `package.json` file.

- Run `yarn start`. It should print `Hello world`.

- Create a `.gitignore` file and add the following to it:

```gitignore
npm-debug.log
yarn-error.log
```

**Note**: If you take a look at the `package.json` files I provide, you will see a `tutorial-test` script in every chapter. Those scripts let me test that the chapter works fine when running `yarn && yarn start`. You can delete them in your own projects.

Next section: [2 - Installing and using a package](/tutorial/2-packages)

Back to the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
