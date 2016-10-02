- Install the community-made package called `color` by running `npm install --save color`.
- Open `package.json` to see how `--save` automatically added `color` in  `dependencies`.
- A `node_modules` folder has also been created to store the package.
- Add `const Color = require('color');` in `index.js`
- Use the package like this for instance: `const redHexa = Color({r: 255, g: 0, b: 0}).hexString();`
- Print `redHexa`, it should show `#FF0000`

- Create a `.gitignore` file and put `node_modules` and `npm-debug.log` in it.

**Note**: There are 2 kinds of package dependencies, `"dependencies"` and `"devDependencies"`. `"dependencies"` is more general than `"devDependencies"`, which are packages that you only need during development, not production (typically, build-related packages). In the context of this minimal tutorial, we are only going to use `"dependencies"`.
