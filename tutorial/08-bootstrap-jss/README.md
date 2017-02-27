# 08 - Bootstrap and JSS

**The code of this chapter is available in the [`master-no-services`](https://github.com/verekia/js-stack-boilerplate/tree/master-no-services) branch of the [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate).**

Alright! It's time to give our ugly app a facelift. We are going to use Twitter Bootstrap to give it some base styles. We'll then add a CSS-in-JS library to add some custom styles.

## Twitter Bootstrap

> Blah

There are 2 options to integrate Bootstrap in a React app. Both have their pros and cons:

- Using the official release, **which uses jQuery and Tether** for the behavior of its components.
- Using a third-party library that re-implements all of Bootstrap's components in React, like [React-Bootstrap](https://react-bootstrap.github.io/) or [Reactstrap](https://reactstrap.github.io/).

Third-party libraries provide very convenient React components that dramatically reduce the code bloat compared to the official HTML components, and integrate greatly with your React codebase. That being said, I must say that I am quite reluctant to use them, because they will always be *behind* the official releases (sometimes potentially far behind). They also won't work with Bootstrap themes that implement their own JS. That's a pretty tough drawback considering that one major strength of Bootstrap is its huge community of designers who make beautiful themes.

For this reason, I'm going to make the difficult tradeoff of integrating the official release, alongside with jQuery and Tether in our app. One of the concerns of this approach is file size of our bundle of course. For your information, the bundle weights about 200KB (Gzipped) with jQuery, Tether, and Bootstrap's JS included. I think that's reasonable, but if that's too much for your use case, you should probably consider an other option for Bootstrap, or even not using Bootstrap at all.

### jQuery and Tether

- Run `yarn add jquery tether`

- Edit `src/client/index.jsx` like so:

```js
import $ from 'jquery'
import Tether from 'tether'

// [right after all your imports]

window.jQuery = $
window.Tether = Tether
require('bootstrap')
```

### Bootstrap Components

Alright, it's time for you to copy-paste a whole bunch of files.

// TODO add all files

- app.jsx

In this file, you can see that we use a *React inline style*:

```js
<div style={{ paddingTop: 54 }}>

// Which could also be written in a more CSS-like fashion:

const style = {
  paddingTop: 54,
}

<div style={style}>
```

This will translate into: `<div style="padding-top:54px;">` in your DOM. We need this style to push the content under the navigation bar, but that's what's important here. [React inline styles](https://speakerdeck.com/vjeux/react-css-in-js) are a great way to isolate your component's styles from the global CSS namespace, but it comes at a price: You cannot use some native CSS features like `:hover`, Media Queries, animations, or `font-face`. That's the reason why we're going to integrate a CSS-in-JS library, JSS, later in this chapter. For now, just keep in mind that you can use React inline styles this way if you don't need `:hover`

Ah, there is something new here, `handleNavLinkClick`. One issue I encountered using Bootstrap's `navbar` in an SPA is that clicking on a link of mobile does not collapse the menu, and does not scroll back to the top of the page. This is a great opportunity to show you an example of how you would integrate some jQuery / Bootstrap-specific code in your app:

```js
const handleNavLinkClick = () => {
  $('body').scrollTop(0)
  $('.js-navbar-collapse').collapse('hide')
}

<NavLink /* [...] */ onClick={handleNavLinkClick}>
```

**Note**: I've removed accessibility-related attributes (like `aria` attributes) to make the code more readable *in the context of this tutorial*. **You should absolutely put them back**. Refer to Bootstrap's documentation and code samples to see how to use them.

## JSS

> Blah

`.flowconfig`:

```flowconfig
[ignore]
.*/node_modules/jss/.*
```

**The code of this chapter is available in the [`master-no-services`](https://github.com/verekia/js-stack-boilerplate/tree/master-no-services) branch of the [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate).**

Next section: [09 - Travis, Coveralls, Heroku](/tutorial/09-travis-coveralls-heroku)

Back to the [previous section](/tutorial/07-socket-io) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
