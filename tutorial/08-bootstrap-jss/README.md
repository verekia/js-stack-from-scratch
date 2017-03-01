# 08 - Bootstrap and JSS

**The code of this chapter is available in the [`master-no-services`](https://github.com/verekia/js-stack-boilerplate/tree/master-no-services) branch of the [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate).**

Alright! It's time to give our ugly app a facelift. We are going to use Twitter Bootstrap to give it some base styles. We'll then add a CSS-in-JS library to add some custom styles.

## Twitter Bootstrap

> Blah

There are 2 options to integrate Bootstrap in a React app. Both have their pros and cons:

- Using the official release, **which uses jQuery and Tether** for the behavior of its components.
- Using a third-party library that re-implements all of Bootstrap's components in React, like [React-Bootstrap](https://react-bootstrap.github.io/) or [Reactstrap](https://reactstrap.github.io/).

Third-party libraries provide very convenient React components that dramatically reduce the code bloat compared to the official HTML components, and integrate greatly with your React codebase. That being said, I must say that I am quite reluctant to use them, because they will always be *behind* the official releases (sometimes potentially far behind). They also won't work with Bootstrap themes that implement their own JS. That's a pretty tough drawback considering that one major strength of Bootstrap is its huge community of designers who make beautiful themes.

For this reason, I'm going to make the tradeoff of integrating the official release, alongside with jQuery and Tether. One of the concerns of this approach is file size of our bundle of course. For your information, the bundle weights about 200KB (Gzipped) with jQuery, Tether, and Bootstrap's JS included. I think that's reasonable, but if that's too much for your use case, you should probably consider an other option for Bootstrap, or even not using Bootstrap at all.

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

- Edit `src/shared/component/page/hello-async.jsx` like so:

```js
// @flow

import React from 'react'
import Helmet from 'react-helmet'

import MessageAsync from '../../container/message-async'
import HelloAsyncButton from '../../container/hello-async-button'

const title = 'Async Hello Page'

const HelloAsyncPage = () =>
  <div className="container mt-4">
    <Helmet
      title={title}
      meta={[
        { name: 'description', content: 'A page to say hello asynchronously' },
        { property: 'og:title', content: title },
      ]}
    />
    <div className="row">
      <div className="col-12">
        <h1>{title}</h1>
        <MessageAsync />
        <HelloAsyncButton />
      </div>
    </div>
  </div>

export default HelloAsyncPage
```

- Edit `src/shared/component/page/hello.jsx` like so:

```js
// @flow

import React from 'react'
import Helmet from 'react-helmet'

import Message from '../../container/message'
import HelloButton from '../../container/hello-button'

const title = 'Hello Page'

const HelloPage = () =>
  <div className="container mt-4">
    <Helmet
      title={title}
      meta={[
        { name: 'description', content: 'A page to say hello' },
        { property: 'og:title', content: title },
      ]}
    />
    <div className="row">
      <div className="col-12">
        <h1>{title}</h1>
        <Message />
        <HelloButton />
      </div>
    </div>
  </div>

export default HelloPage
```

- Edit `src/shared/component/page/home.jsx` like so:

```js
// @flow

import React from 'react'
import Helmet from 'react-helmet'

import ModalExample from '../modal-example'
import { APP_NAME } from '../../config'

const HomePage = () =>
  <div>
    <Helmet
      meta={[
        { name: 'description', content: 'Hello App is an app to say hello' },
        { property: 'og:title', content: APP_NAME },
      ]}
    />
    <div className="jumbotron">
      <div className="container">
        <h1 className="display-3 mb-4">{APP_NAME}</h1>
      </div>
    </div>
    <div className="container">
      <div className="row">
        <div className="col-md-4 mb-4">
          <h3 className="mb-3">Bootstrap</h3>
          <p>
            <button type="button" role="button" data-toggle="modal" data-target=".js-modal-example" className="btn btn-primary">Open Modal</button>
          </p>
        </div>
        <div className="col-md-4 mb-4">
          <h3 className="mb-3">JSS (soon)</h3>
        </div>
        <div className="col-md-4 mb-4">
          <h3 className="mb-3">Websockets</h3>
          <p>Open your browser console.</p>
        </div>
      </div>
    </div>
    <ModalExample />
  </div>

export default HomePage
```

- Edit `src/shared/component/page/not-found.jsx` like so:

```js
// @flow

import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'
import { HOME_PAGE_ROUTE } from '../../routes'

const title = 'Page Not Found!'

const NotFoundPage = () =>
  <div className="container mt-4">
    <Helmet title={title} />
    <div className="row">
      <div className="col-12">
        <h1>{title}</h1>
        <div><Link to={HOME_PAGE_ROUTE}>Go to the homepage</Link>.</div>
      </div>
    </div>
  </div>

export default NotFoundPage
```

- Edit `src/shared/component/button.jsx` like so:

```js
// [...]
<button
  onClick={handleClick}
  className="btn btn-primary"
  type="button"
  role="button"
>{label}</button>
// [...]
```

- Create a `src/shared/component/footer.jsx` containing:

```js
// @flow

import React from 'react'
import { APP_NAME } from '../config'

const Footer = () =>
  <div className="container mt-5">
    <hr />
    <footer>
      <p>© {APP_NAME} 2017</p>
    </footer>
  </div>

export default Footer
```

- Create a `src/shared/component/modal-example.jsx` containing:

```js
// @flow

import React from 'react'

const ModalExample = () =>
  <div className="js-modal-example modal fade">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Modal title</h5>
          <button type="button" className="close" data-dismiss="modal">×</button>
        </div>
        <div className="modal-body">
          This is a Bootstrap modal. It uses jQuery.
        </div>
        <div className="modal-footer">
          <button type="button" role="button" className="btn btn-primary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

export default ModalExample
```

- Edit `src/shared/app.jsx` like so:

```js
const App = () =>
  <div style={{ paddingTop: 54 }}>  
```

This is an example of a *React inline style*.

This will translate into: `<div style="padding-top:54px;">` in your DOM. We need this style to push the content under the navigation bar, but that's what's important here. [React inline styles](https://speakerdeck.com/vjeux/react-css-in-js) are a great way to isolate your component's styles from the global CSS namespace, but it comes at a price: You cannot use some native CSS features like `:hover`, Media Queries, animations, or `font-face`. That's the reason why we're going to integrate a CSS-in-JS library, JSS, later in this chapter. For now, just keep in mind that you can use React inline styles this way if you don't need `:hover`.

- Edit `src/shared/component/nav.jsx` like so:

```js
// @flow

import $ from 'jquery'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { APP_NAME } from '../config'
import {
  HOME_PAGE_ROUTE,
  HELLO_PAGE_ROUTE,
  HELLO_ASYNC_PAGE_ROUTE,
  NOT_FOUND_DEMO_PAGE_ROUTE,
} from '../routes'

const navLinkActiveStyle = { color: 'white' }

const handleNavLinkClick = () => {
  $('body').scrollTop(0)
  $('.js-navbar-collapse').collapse('hide')
}

const Nav = () =>
  <nav className="navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
    <button className="navbar-toggler navbar-toggler-right" type="button" role="button" data-toggle="collapse" data-target=".js-navbar-collapse">
      <span className="navbar-toggler-icon" />
    </button>
    <Link to={HOME_PAGE_ROUTE} className="navbar-brand">{APP_NAME}</Link>
    <div className="js-navbar-collapse collapse navbar-collapse">
      <ul className="navbar-nav mr-auto">
        {[
          { route: HOME_PAGE_ROUTE, label: 'Home' },
          { route: HELLO_PAGE_ROUTE, label: 'Say Hello' },
          { route: HELLO_ASYNC_PAGE_ROUTE, label: 'Say Hello Asynchronously' },
          { route: NOT_FOUND_DEMO_PAGE_ROUTE, label: '404 Demo' },
        ].map(link => (
          <li className="nav-item" key={link.route}>
            <NavLink to={link.route} className="nav-link" activeStyle={navLinkActiveStyle} exact onClick={handleNavLinkClick}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  </nav>

export default Nav
```

There is something new here, `handleNavLinkClick`. One issue I encountered using Bootstrap's `navbar` in an SPA is that clicking on a link of mobile does not collapse the menu, and does not scroll back to the top of the page. This is a great opportunity to show you an example of how you would integrate some jQuery / Bootstrap-specific code in your app:

```js
const handleNavLinkClick = () => {
  $('body').scrollTop(0)
  $('.js-navbar-collapse').collapse('hide')
}

<NavLink /* [...] */ onClick={handleNavLinkClick}>
```

**Note**: I've removed accessibility-related attributes (like `aria` attributes) to make the code more readable *in the context of this tutorial*. **You should absolutely put them back**. Refer to Bootstrap's documentation and code samples to see how to use them.

🏁 Run

## JSS

> Blah

Now that we have some base template with Bootstrap, let's write some custom CSS. I mentioned earlier that React inline styles could not handle `:hover` and media queries, so we'll show a simple example of this on the homepage using JSS. JSS can be used via `react-jss`, a library that is convenient to use with React components.

- Run `yarn add react-jss`

Add the following to your `.flowconfig` file, as there is currently a Flow [issue](https://github.com/cssinjs/jss/issues/411) with JSS:

```flowconfig
[ignore]
.*/node_modules/jss/.*
```

### Server-side

JSS can render styles on the server for the initial rendering.

- Add the following constants to `src/shared/config.js`:

```js
export const JSS_SSR_CLASS = 'jss-ssr'
export const JSS_SSR_SELECTOR = `.${JSS_SSR_CLASS}`
```

- Edit `src/server/render-app.jsx` like so:

```js
import { SheetsRegistry, SheetsRegistryProvider } from 'react-jss'
// [...]
import { APP_CONTAINER_CLASS, JSS_SSR_CLASS, STATIC_PATH, WDS_PORT } from '../shared/config'
// [...]
const renderApp = (location: string, plainPartialState: ?Object, routerContext: ?Object = {}) => {
  const store = initStore(plainPartialState)
  const sheets = new SheetsRegistry()
  const appHtml = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={location} context={routerContext}>
        <SheetsRegistryProvider registry={sheets}>
          <App />
        </SheetsRegistryProvider>
      </StaticRouter>
    </Provider>)
```

## Client-side

The first thing the client should do after rendering the app client-side, is to get rid of the server-generated JSS styles.

- Add the following to `src/client/index.jsx` after the `ReactDOM.render` calls (before `setUpSocket(store)` for instance):

```js
const jssServerSide = document.querySelector(JSS_SSR_SELECTOR)
// flow-disable-next-line
jssServerSide.parentNode.removeChild(jssServerSide)
```

Edit `src/shared/component/page/home.jsx` like so:

```js
import injectSheet from 'react-jss'
// [...]
const styles = {
  hoverMe: {
    '&:hover': {
      color: 'red',
    },
  },
  '@media (max-width: 800px)': {
    resizeMe: {
      color: 'red',
    },
  },
}

const HomePage = ({ classes }: { classes: Object }) =>
  // [...]
  <div className="col-md-4 mb-4">
    <h3 className="mb-3">JSS</h3>
    <p className={classes.hoverMe}>Hover me.</p>
    <p className={classes.resizeMe}>Resize the window.</p>
  </div>
  // [...]

export default injectSheet(styles)(HomePage)
```

🏁 Run

**The code of this chapter is available in the [`master-no-services`](https://github.com/verekia/js-stack-boilerplate/tree/master-no-services) branch of the [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate).**

Next section: [09 - Travis, Coveralls, Heroku](/tutorial/09-travis-coveralls-heroku)

Back to the [previous section](/tutorial/07-socket-io) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
