# 03 - Express, PM2

So far we just played a bit with Node and ES6, that was not a web app. In this section we are going to use Express to create a server, and will introduce the concept of development and production environments, using PM2.

## Express

> 💡 **[Express](https://)** (TODO) is a minimal TODO

- Run `yarn add express`.

- Delete `src/index.js` and `src/dog.js`, we won't need those anymore.

- Create an `src/server` folder. Add `index.js` and `config.js` to it.

- Create an `src/server/templates` folder. Add `master-layout.js` to it.

- Create a `public` folder at the root of your project.

`app.use(staticPath, express.static('public'));` is to add a `static` prefix to your assets' URLs.

Create a `public/css/style.css` file, and add the following to it:

```css
body {
  margin: 0 auto;
  width: 1000px;
  font-family: sans-serif;
}
```

The only point of this file is to see that our public assets folder is set up correctly with some basic styling.

## TODO

Check that PM2 works on Windows.
