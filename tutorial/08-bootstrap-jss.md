# 08 - Bootstrap и JSS

Кода за тази глава можете да намерите в [`master-no-services`](https://github.com/verekia/js-stack-boilerplate/tree/master-no-services) клон на [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate).

Окей! Време е да направите приложението си да изгежда красиво. Ще използваме Twitter Bootstrap, за да приложим основни стилове върху него. След това ще добавим една CSS-in-JS библиотека, за да добавим още някои по-специфични стилове.

## Twitter Bootstrap

> 💡 **[Twitter Bootstrap](http://getbootstrap.com/)** е библиотека с компоненти за построяване на *потребителски интерфейс* (UI components).

Има два начина за интегриране на Bootstrap в React приложение. И двата имат техните предимства и недостатъци:

- Да се използва официалния релийз, **който използва jQuery и Tether** за функционалността на компонентите.
- Да се използва отделна библиотека, която реимплементира всички Bootstrap компоненти в React, като например [React-Bootstrap](https://react-bootstrap.github.io/) или [Reactstrap](https://reactstrap.github.io/).

Third-party библиотеките предлагат доста удобни за употреба React компоненти, които намаляват значително много кода, който се използва, в сравнение с официалните HTML компоненти, а освен това интеграцията им с React е много добре направена. И въпреки казаното до тук, аз не съм голям привърженик на използването им, тъй като те винаги остават *назад* от официалните релийзи (понякога значително назад). Също така те биха били несъвестими с Bootstrap теми, които използват свой собствен JS. Това е доста сериозен недостатък, имайки предвид, че едно от основните предимства на Bootstrap е голямата му поддръжка от дизайнери, които създават красиви теми.

Поради тази причина ще използвам официалния релийз, който върви с jQuery и Tether. Едно от нещата, на които трябва да обърнем внимание когато използваме този подход е размера на файловете на нашия пакет. За ваша информация, размерът на пакета е около 200Кб (Gzipped) с включени jQuery, Tether и JavaScript-a на Bootstrap. Мисля, че това е разумно, но в случай че е прекалено много за вас, може би трябва да помислите за алтернатива на Bootstrap или дори за вариант да не го използвате въобще.

### Bootstrap's CSS

- Изтрийте `public/css/style.css`

- Изпълнете `yarn add bootstrap@4.0.0-alpha.6`

- Копирайте `bootstrap.min.css` и `bootstrap.min.css.map` от `node_modules/bootstrap/dist/css` във вашата `public/css` папка.

- Редактирайте `src/server/render-app.jsx`, както следва:

```html
<link rel="stylesheet" href="${STATIC_PATH}/css/bootstrap.min.css">
```

### Bootstrap's JS с jQuery и Tether

Сега, след като вече сме заредили стиловете от Bootstrap на нашата страница, ще ни трябват JavaScript функционалността на компонентите.

- Изпълнете `yarn add jquery tether`

- Редактирайте `src/client/index.jsx`, както следва:

```js
import $ from 'jquery'
import Tether from 'tether'

// [right after all your imports]

window.jQuery = $
window.Tether = Tether
require('bootstrap')
```

Това ще зареди JavaScript кода на Bootstrap.

### Bootstrap компоненти

Окей, време е да копирате няколко файла.

- Редактирайте `src/shared/component/page/hello-async.jsx` файла, както следва:

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

- Редактирайте `src/shared/component/page/hello.jsx` файла, както следва:

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

- Редактирайте `src/shared/component/page/home.jsx` файла, както следва:

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

- Редактирайте `src/shared/component/page/not-found.jsx` файла, както следва:

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

- Редактирайте `src/shared/component/button.jsx`, както следва:

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

- Създайте `src/shared/component/footer.jsx` файл, съдържащ:

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

- Създайте `src/shared/component/modal-example.jsx` файл, съдържащ:

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

- Редактирайте `src/shared/app.jsx` файла, както следва:

```js
const App = () =>
  <div style={{ paddingTop: 54 }}>
```

Това е пример за  *React inline style*.

Това ще се преведе в: `<div style="padding-top:54px;">` във вашия DOM. Искаме този стил да избута съдържанието под лентата за навигация. [React inline styles](https://speakerdeck.com/vjeux/react-css-in-js) е чудесен начин за изолиране на стиловете на вашите компоненти от глобалната CSS зона на действие (namespace), но като всяко нещо и това си има цена : Не можете да използвате някои вградени CSS свойства като `:hover`, Media Queries, анимации или `font-face`. Това е [една от причините](https://github.com/cssinjs/jss/blob/master/docs/benefits.md#compared-to-inline-styles), поради която ще интегрираме CSS-in-JS библиотека, JSS, по-късно в тази глава.

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
            <NavLink to={link.route} className="nav-link" activeStyle={{ color: 'white' }} exact onClick={handleNavLinkClick}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  </nav>

export default Nav
```

There is something new here, `handleNavLinkClick`. One issue I encountered using Bootstrap's `navbar` in an SPA is that clicking on a link on mobile does not collapse the menu, and does not scroll back to the top of the page. This is a great opportunity to show you an example of how you would integrate some jQuery / Bootstrap-specific code in your app:

```js
import $ from 'jquery'
// [...]

const handleNavLinkClick = () => {
  $('body').scrollTop(0)
  $('.js-navbar-collapse').collapse('hide')
}

<NavLink /* [...] */ onClick={handleNavLinkClick}>
```

**Note**: I've removed accessibility-related attributes (like `aria` attributes) to make the code more readable *in the context of this tutorial*. **You should absolutely put them back**. Refer to Bootstrap's documentation and code samples to see how to use them.

🏁 Your app should now be entirely styled with Bootstrap.

## The current state of CSS

In 2016, the typical modern JavaScript stack settled. The different libraries and tools this tutorial made you set up are pretty much the *cutting-edge industry standard* (*cough – even though it could become completely outdated in a year from now – cough*). Yes, that's a complex stack to set up, but at least, most front-end devs agree that React-Redux-Webpack is the way to go. Now regarding CSS, I have some pretty bad news. Nothing settled, there is no standard way to go, no standard stack.

SASS, BEM, SMACSS, SUIT, Bass CSS, React Inline Styles, LESS, Styled Components, CSSX, JSS, Radium, Web Components, CSS Modules, OOCSS, Tachyons, Stylus, Atomic CSS, PostCSS, Aphrodite, React Native for Web, and many more that I forget are all different approaches or tools to get the job done. They all do it well, which is the problem, there is no clear winner, it's a big mess.

The cool React kids tend to favor React inline styles, CSS-in-JS, or CSS Modules approaches though, since they integrate really well with React and solve programmatically many [issues](https://speakerdeck.com/vjeux/react-css-in-js) that regular CSS approaches struggle with.

CSS Modules work well, but they don't leverage the power of JavaScript and its many features over CSS. They just provide encapsulation, which is fine, but React inline styles and CSS-in-JS take styling to an other level in my opinion. My personal suggestion would be to use React inline styles for common styles (that's also what you have to use for React Native), and use a CSS-in-JS library for things like `:hover` and media queries.

There are [tons of CSS-in-JS libraries](https://github.com/MicheleBertoli/css-in-js). JSS is a full-featured, well-rounded, and [performant](https://github.com/cssinjs/jss/blob/master/docs/performance.md) one.

## JSS

> 💡 **[JSS](http://cssinjs.org/)** is a CSS-in-JS library to write your styles in JavaScript and inject them into your app.

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
  // [...]
      <link rel="stylesheet" href="${STATIC_PATH}/css/bootstrap.min.css">
      <style class="${JSS_SSR_CLASS}">${sheets.toString()}</style>
  // [...]
```

## Client-side

The first thing the client should do after rendering the app client-side, is to get rid of the server-generated JSS styles.

- Add the following to `src/client/index.jsx` after the `ReactDOM.render` calls (before `setUpSocket(store)` for instance):

```js
import { APP_CONTAINER_SELECTOR, JSS_SSR_SELECTOR } from '../shared/config'
// [...]

const jssServerSide = document.querySelector(JSS_SSR_SELECTOR)
// flow-disable-next-line
jssServerSide.parentNode.removeChild(jssServerSide)

setUpSocket(store)
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
  specialButton: {
    composes: ['btn', 'btn-primary'],
    backgroundColor: 'limegreen',
  },
}

const HomePage = ({ classes }: { classes: Object }) =>
  // [...]
  <div className="col-md-4 mb-4">
    <h3 className="mb-3">JSS</h3>
    <p className={classes.hoverMe}>Hover me.</p>
    <p className={classes.resizeMe}>Resize the window.</p>
    <button className={classes.specialButton}>Composition</button>
  </div>
  // [...]

export default injectSheet(styles)(HomePage)
```

Unlike React inline styles, JSS uses classes. You pass styles to `injectSheet` and the CSS classes end up in the props of your component.

🏁 Run `yarn start` and `yarn dev:wds`. Open the homepage. Show the source of the page (not in the inspector) to see that the JSS styles are present in the DOM at the initial render in the `<style class="jss-ssr">` element (only on the Home page). They should be gone in the inspector, replaced by `<style type="text/css" data-jss data-meta="HomePage">`.

**Note**: In production mode, the `data-meta` is obfuscated. Sweet!

If you hover over the "Hover me" label, it should turn red. If you resize your browser window to be narrower than 800px, the "Resize your window" label should turn red. The green button is extending Bootstrap's CSS classes using JSS' `composes` property.

Next section: [09 - Travis, Coveralls, Heroku](09-travis-coveralls-heroku.md#readme)

Back to the [previous section](07-socket-io.md#readme) or the [table of contents](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
