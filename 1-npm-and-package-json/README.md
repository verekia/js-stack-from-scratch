# 1 - Node, NPM, and package.json

In this section we will set up Node, NPM, and a basic `package.json` file.

First, we need to install Node, which is not only used for back-end JavaScript, but all the tools we need to build a modern Front-End stack.

Refer to the [download page](https://nodejs.org/en/download/current/) or the [package manager installations page](https://nodejs.org/en/download/package-manager/) for the latest instructions.

```bash
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```
You want any version of Node > 6.5.0.

`npm`, the package manager for Node, comes automatically with Node, so you don't have to install it yourself.

**Note**: If Node is already installed, install `nvm` ([Node Version Manager](https://github.com/creationix/nvm)), make `nvm` install and use the latest version of Node for you.

- Create a new folder to work in, and `cd` in it.
- Run `npm init` and answer the questions (`npm init -y` to skip all questions), to generate a `package.json` file automatically.
- Create an `index.js` file containing `console.log('Hello world')`
- Run `node .` in this folder (`index.js` is the default file Node looks for in the current folder). It should print "Hello world".
- In `package.json`, add `"start": "node ."` in the `scripts` object.

`package.json` must be a valid JSON file, which means that you cannot have trailing commas. So be careful when editing manually your `package.json` file.

- Run `npm start`. It should print `Hello world`. You can now only use `npm start` to run your program.

Next section: [2 - Installing and using an NPM package](/2-packages)

Back to the [table of contents](/README.md).
