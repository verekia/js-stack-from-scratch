# 08 - Bootstrap oraz JSS

Kod dla tego rozdziały dostępny jest tutaj [`master-no-services`](https://github.com/verekia/js-stack-boilerplate/tree/master-no-services) branch dla [JS-Stack-Boilerplate repository](https://github.com/verekia/js-stack-boilerplate).

W porządku! Czas na remont naszej brzydkiej aplikacji. Użyjemy Twitter Bootstrap, aby nadać mu kilka podstawowych stylów. Następnie dodamy bibliotekę CSS-in-JS, aby dodać niestandardowe style.

## Twitter Bootstrap

> 💡 **[Twitter Bootstrap](http://getbootstrap.com/)** to biblioteka komponentów interfejsu użytkownika.

Istnieją 2 opcje zintegrowania Bootstrap z aplikacją React. Oba mają swoje zalety i wady:

- Korzystanie z oficjalnej wersji, **która używa jQuery i Tether** do zachowania swoich komponentów.
- Korzystając z biblioteki innej firmy, która ponownie implementuje wszystkie składniki Bootstrap w React, jak [React-Bootstrap](https://react-bootstrap.github.io/) lub [Reactstrap](https://reactstrap.github.io/).

Biblioteki innych firm zapewniają bardzo wygodne komponenty React, które znacznie zmniejszają wzdęcie kodu w porównaniu z oficjalnymi komponentami HTML i znacznie integrują się z bazą kodu React. Biorąc to pod uwagę, muszę powiedzieć, że bardzo niechętnie ich używam, ponieważ zawsze będą one *za* oficjalnymi wydaniami (czasami potencjalnie daleko w tyle). Nie będą również działać z motywami Bootstrap, które implementują własne JS. To dość trudna wada, biorąc pod uwagę, że jedną z głównych zalet Bootstrap jest ogromna społeczność projektantów, którzy tworzą piękne motywy.

Z tego powodu zamierzam dokonać kompromisu integrując oficjalne wydanie wraz z jQuery i Tether. Jednym z problemów tego podejścia jest oczywiście rozmiar naszego pakietu. Dla twojej informacji, pakiet waży około 200 KB (Gzipped) z jQuery, Tether i JS Bootstrap. Myślę, że to rozsądne, ale jeśli to dla ciebie za dużo, prawdopodobnie powinieneś rozważyć inną opcję Bootstrap, a nawet w ogóle nie używać Bootstrap.

### Bootstrap's CSS

- Usuń `public/css/style.css`

- Uruchom `yarn add bootstrap@4.0.0-alpha.6`

- Skopiuj `bootstrap.min.css` i `bootstrap.min.css.map` z `node_modules/bootstrap/dist/css` do twojego `public/css` folderu.

- Zedytuj `src/server/render-app.jsx` tak:

```html
<link rel="stylesheet" href="${STATIC_PATH}/css/bootstrap.min.css">
```

### Bootstrap's JS z jQuery i Tether

Teraz, gdy na naszej stronie są załadowane style Bootstrap, potrzebujemy zachowania JavaScript dla komponentów.

- Uruchom `yarn add jquery tether`

- Zedytuj `src/client/index.jsx` tak:

```js
import $ from 'jquery'
import Tether from 'tether'

// [right after all your imports]

window.jQuery = $
window.Tether = Tether
require('bootstrap')
```

Spowoduje to załadowanie kodu JavaScript Bootstrap.

### Komponenty Bootstrap

W porządku, czas skopiować i wkleić całą masę plików.

- Edytuj `src/shared/component/page/hello-async.jsx` w ten sposób:

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

- Zedytuj `src/shared/component/page/hello.jsx` w ten sposób:

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

- Edytuj `src/shared/component/page/home.jsx` w ten sposób:

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

- Edytuj `src/shared/component/page/not-found.jsx` tak:

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

- Edytuj `src/shared/component/button.jsx` tak:

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

- Stwórz plik `src/shared/component/footer.jsx` zawierający:

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

- Stwórz `src/shared/component/modal-example.jsx` zawierające:

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

- Edytuj `src/shared/app.jsx` jak tu:

```js
const App = () =>
  <div style={{ paddingTop: 54 }}>
```

To jest przykład *React inline style*.

To przełoży się na: `<div style="padding-top:54px;">` w twoim DOM. Potrzebujemy tego stylu, aby przesuwać zawartość pod paskiem nawigacji, ale to jest tutaj ważne. [React inline styles](https://speakerdeck.com/vjeux/react-css-in-js) to świetny sposób na izolację stylów komponentu od globalnej przestrzeni nazw CSS, ale ma swoją cenę: Nie możesz używać niektórych natywnych funkcji CSS, takich jak `:hover`, Media Queries, animacje, czy `font-face`. To jest [jeden z powodów](https://github.com/cssinjs/jss/blob/master/docs/benefits.md#compared-to-inline-styles) dla których zamierzamy zintegrować bibliotekę CSS-in-JS, JSS, w dalszej części tego rozdziału.

- Edytuj `src/shared/component/nav.jsx` tak oto:

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

Jest tu coś nowego, `handleNavLinkClick`. Jednym z problemów, jakie napotkałem podczas używania paska nawigacyjnego 'navbar' Bootstrap w SPA, jest to, że kliknięcie linku na telefonie komórkowym nie zwija menu i nie przewija do góry strony. To świetna okazja, aby pokazać przykład, w jaki sposób zintegrowałbyś jakiś kod specyficzny dla jQuery / Bootstrap w swojej aplikacji:

```js
import $ from 'jquery'
// [...]

const handleNavLinkClick = () => {
  $('body').scrollTop(0)
  $('.js-navbar-collapse').collapse('hide')
}

<NavLink /* [...] */ onClick={handleNavLinkClick}>
```

**Uwaga**: Usunąłem atrybuty związane z dostępnością (takie jak atrybuty `aria`), aby kod był bardziej czytelny *w kontekście tego samouczka*. **Powinieneś je absolutnie przywrócić**. Zapoznaj się z dokumentacją i przykładami kodu Bootstrap, aby zobaczyć, jak z nich korzystać.

🏁 Twoja aplikacja powinna być teraz całkowicie stylizowana za pomocą Bootstrap.

## Obecny stan CSS

W 2016 r. Ustalono typowy nowoczesny stos JavaScript. Różne biblioteki i narzędzia skonfigurowane w tym samouczku są w zasadzie takie *najnowocześniejszy standard branżowy* (*kaszel - mimo że za rok może stać się całkowicie przestarzały - kaszel*). Tak, to skomplikowany stos do skonfigurowania, ale przynajmniej większość front-endowych deweloperów zgadza się, że React-Redux-Webpack jest właściwą drogą. Jeśli chodzi o CSS, mam dość złe wiadomości. Nic nie zostało ustalone, nie ma standardowej drogi, nie ma standardowego stosu.

SASS, BEM, SMACSS, SUIT, Bass CSS, React Inline Styles, LESS, Styled Components, CSSX, JSS, Radium, Web Components, CSS Modules, OOCSS, Tachyons, Stylus, Atomic CSS, PostCSS, Aphrodite, React Native for Web, i wiele innych, o których zapominam, to różne podejścia lub narzędzia do wykonania pracy. Wszyscy robią to dobrze, co jest problemem, nie ma wyraźnego zwycięzcy, to wielki bałagan.

Fajne React kids preferują React inline styles, CSS-in-JS, lub CSS Modules podejścia, ponieważ naprawdę dobrze integrują się z React i rozwiązują wiele programowo [issues](https://speakerdeck.com/vjeux/react-css-in-js) z którymi regularnie walczą CSS.

Moduły CSS działają dobrze, ale nie wykorzystują mocy JavaScript i jego wielu funkcji w stosunku do CSS. Po prostu zapewniają enkapsulację, co jest w porządku, ale moim zdaniem styl React Inline i CSS-in-JS przenoszą stylizację na inny poziom. Moją osobistą propozycją byłoby użycie wbudowanych stylów React dla popularnych stylów (tego też musisz użyć dla React Native) i użycie biblioteki CSS-in-JS do takich rzeczy jak `:hover` i media queries.

Są [tony bibliotek CSS-in-JS](https://github.com/MicheleBertoli/css-in-js). JSS jest w pełni funkcjonalny, dobrze zaokrąglony i [wydajny](https://github.com/cssinjs/jss/blob/master/docs/performance.md).

## JSS

> 💡 **[JSS](http://cssinjs.org/)** to biblioteka CSS-in-JS do pisania stylów w JavaScript i wstawiania ich do aplikacji.

Teraz, gdy mamy szablon podstawowy z Bootstrap, napiszmy trochę niestandardowego CSS. Wspomniałem wcześniej, że style wbudowane React nie mogą obsługiwać zapytań `:hover` i multimediów, dlatego pokażemy prosty przykład tego na stronie głównej za pomocą JSS. Z JSS można korzystać za pośrednictwem biblioteki 'reag-jss', która jest wygodna w użyciu ze składnikami React.

- Uruchom `yarn add react-jss`

Dodaj następujące elementy do swojego pliku `.flowconfig` , jak jest obecnie Flow [issue](https://github.com/cssinjs/jss/issues/411) z JSS:

```flowconfig
[ignore]
.*/node_modules/jss/.*
```

### Server-side

JSS może renderować style na serwerze do wstępnego renderowania.

- Dodaj następujące stałe do `src/shared/config.js`:

```js
export const JSS_SSR_CLASS = 'jss-ssr'
export const JSS_SSR_SELECTOR = `.${JSS_SSR_CLASS}`
```

- Edytuj `src/server/render-app.jsx` tak oto:

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

Pierwszą rzeczą, którą klient powinien zrobić po renderowaniu aplikacji po stronie klienta, jest pozbycie się wygenerowanych przez serwer stylów JSS.

- Dodaj następujące elementy do `src/client/index.jsx` po `ReactDOM.render` wywołaniu (przed `setUpSocket(store)` przykładowo):

```js
import { APP_CONTAINER_SELECTOR, JSS_SSR_SELECTOR } from '../shared/config'
// [...]

const jssServerSide = document.querySelector(JSS_SSR_SELECTOR)
// flow-disable-next-line
jssServerSide.parentNode.removeChild(jssServerSide)

setUpSocket(store)
```

Edytuj `src/shared/component/page/home.jsx` tak:

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

W przeciwieństwie do wbudowanych stylów React, JSS używa klas. Przekazujesz style do `injectSheet`, a klasy CSS kończą się w rekwizytach twojego komponentu.

🏁 Uruchom `yarn start` i `yarn dev:wds`. Otwórz stronę główną. Pokaż źródło strony (nie w inspektorze), aby zobaczyć, że style JSS są obecne w DOM podczas początkowego renderowania w `<style class="jss-ssr">` elemencie (tylko na stronie głównej). Powinny zniknąć u inspektora, zastąpione przez `<style type="text/css" data-jss data-meta="HomePage">`.

**Uwaga**: W trybie produkcyjnym `data-meta` jest zaciemniona. Słodkie!

Jeśli najedziesz kursorem na etykietę "Hover me", powinna ona zmienić kolor na czerwony. Jeśli zmienisz rozmiar okna przeglądarki, aby było węższe niż 800 pikseli, etykieta "Zmień rozmiar okna" powinna zmienić kolor na czerwony. Zielony przycisk rozszerza klasy CSS Bootstrap za pomocą właściwości JSS `composes`.

Następna sekcja: [09 - Travis, Coveralls, Heroku](09-travis-coveralls-heroku.md#readme)

Powrót do [poprzedniej sekcji](07-socket-io.md#readme) lub do [spisu treści](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
