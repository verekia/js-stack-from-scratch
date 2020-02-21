# 04 - Webpack, React, oraz Hot Module Replacement

Dostępny kod dla tego rozdziału jest [tutaj](https://github.com/verekia/js-stack-walkthrough/tree/master/04-webpack-react-hmr).

## Webpack

> 💡 **[Webpack](https://webpack.js.org/)** to *module bundler*. Pobiera całą masę różnych plików źródłowych, przetwarza je i łączy w jeden (zwykle) plik JavaScript o nazwie bundle, który jest jedynym plikiem, który wykona klient.

Stwórzmy podstawowe *hello world* i bundle z Webpack.

- W `src/shared/config.js`, dodaj następujące consty:

```js
export const WDS_PORT = 7000

export const APP_CONTAINER_CLASS = 'js-app'
export const APP_CONTAINER_SELECTOR = `.${APP_CONTAINER_CLASS}`
```

- Stwórz plik `src/client/index.js` zawierający:

```js
import 'babel-polyfill'

import { APP_CONTAINER_SELECTOR } from '../shared/config'

document.querySelector(APP_CONTAINER_SELECTOR).innerHTML = '<h1>Hello Webpack!</h1>'
```

Jeśli chcesz używać niektórych najnowszych funkcji ES w kodzie klienta, takich jak `Promise`, musisz dołączyć [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/) przed czymkolwiek innym w twoim bundle.

- Uruchom `yarn add babel-polyfill`

Jeśli uruchomisz ESLint na tym pliku, będzie narzekać odnośnie że `document` jest niezdefiniowany.

- Dodaj poniższe do `env` w twoim `.eslintrc.json` aby pozwolić korzystać z `window` i `document`:

```json
"env": {
  "browser": true,
  "jest": true
}
```

Dobra, teraz musimy połączyć tę aplikację kliencką ES6 w pakiet ES5.

- Stwórz plik `webpack.config.babel.js` zawierający:

```js
// @flow

import path from 'path'

import { WDS_PORT } from './src/shared/config'
import { isProd } from './src/shared/util'

export default {
  entry: [
    './src/client',
  ],
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProd ? '/static/' : `http://localhost:${WDS_PORT}/dist/`,
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
    ],
  },
  devtool: isProd ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: WDS_PORT,
  },
}
```

Ten plik służy do opisania, w jaki sposób należy złożyć nasz pakiet: `entry` jest punktem wyjścia naszej aplikacji, `output.filename` to nazwa pakietu do wygenerowania, `output.path` i `output.publicPath` opisz folder docelowy i adres URL. Umieszczamy pakiet w folderze `dist`, które będą zawierać rzeczy generowane automatycznie (w przeciwieństwie do deklaratywnego CSS, który stworzyliśmy wcześniej, w którym istnieje `public`). `module.rules` to miejsce, w którym każesz Webpackowi zastosować pewne leczenie do pewnego rodzaju plików. Mówimy tutaj, że chcemy wszystkie pliki `.js` i `.jsx` (dla Reacta) oprócz tych w `node_modules` aby przejść przez coś zwanego `babel-loader`. Chcemy również, aby te dwa rozszerzenia były używane do 'rozwiązywania' modułów podczas ich 'importowania'. Wreszcie deklarujemy port dla Webpack Dev Server.

**Uwaga**: Rozszerzenie `.babel.js` to funkcja Webpack do zastosowania naszych transformacji Babel do tego pliku konfiguracyjnego.

`babel-loader` to wtyczka do pakietu Webpack, która transponuje Twój kod, tak jak robiliśmy to od początku tego samouczka. Jedyną różnicą jest to, że tym razem kod skończy się w przeglądarce zamiast na serwerze.

- Uruchom `yarn add --dev webpack webpack-dev-server babel-core babel-loader`

`babel-core` jest peer-dependency dla `babel-loader`, więc też to zainstalowaliśmy.

- Dodaj `/dist/` do swojego `.gitignore`

### Tasks update

W trybie programowania będziemy korzystać z `webpack-dev-server` aby skorzystać z Hot Module Reloading (w dalszej części tego rozdziału), a do produkcji po prostu skorzystamy `webpack` do tworzenia bundles. W obu przypadkach, flaga `--progress` jest przydatna do wyświetlania dodatkowych informacji, gdy Webpack kompiluje twoje pliki. W produkcji przekażemy również flagę `-p` do `webpack`, aby zminimalizować nasz kod, a zmienną `NODE_ENV` ustawić na `production`.

Zaktualizujmy nasze `scripts` aby wdrożyć to wszystko i ulepszyć również niektóre inne zadania:

```json
"scripts": {
  "start": "yarn dev:start",
  "dev:start": "nodemon -e js,jsx --ignore lib --ignore dist --exec babel-node src/server",
  "dev:wds": "webpack-dev-server --progress",
  "prod:build": "rimraf lib dist && babel src -d lib --ignore .test.js && cross-env NODE_ENV=production webpack -p --progress",
  "prod:start": "cross-env NODE_ENV=production pm2 start lib/server && pm2 logs",
  "prod:stop": "pm2 delete server",
  "lint": "eslint src webpack.config.babel.js --ext .js,.jsx",
  "test": "yarn lint && flow && jest --coverage",
  "precommit": "yarn test",
  "prepush": "yarn test && yarn prod:build"
},
```

W `dev:start` wyraźnie deklarujemy rozszerzenia plików do monitorowania, `.js` oraz `.jsx`, i dodaj `dist` w ignorowanych katalogach.

Stworzyliśmy osobny task `lint` i dodaliśmy `webpack.config.babel.js` do plików dla lint.

- Następnie utwórzmy kontener dla naszej aplikacji w `src/server/render-app.js`, i dołącz pakiet, który zostanie wygenerowany:

```js
// @flow

import { APP_CONTAINER_CLASS, STATIC_PATH, WDS_PORT } from '../shared/config'
import { isProd } from '../shared/util'

const renderApp = (title: string) =>
`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="${STATIC_PATH}/css/style.css">
  </head>
  <body>
    <div class="${APP_CONTAINER_CLASS}"></div>
    <script src="${isProd ? STATIC_PATH : `http://localhost:${WDS_PORT}/dist`}/js/bundle.js"></script>
  </body>
</html>
`

export default renderApp
```

W zależności od środowiska, w którym się znajdujemy, dołączymy Webpack Server Dev Server bundle lub pakiet produkcyjny. Zauważ, że ścieżka do Webpack Dev Server to *virtual*, `dist / js / bundle.js` nie jest w rzeczywistości odczytywany z twojego dysku twardego w trybie programowania. Konieczne jest również podanie Webpack Dev Server innego portu niż główny port.

- Końcowo, w `src/server/index.js`, podkręć swój `console.log` tak oto:

```js
console.log(`Server running on port ${WEB_PORT} ${isProd ? '(production)' :
  '(development).\nKeep "yarn dev:wds" running in an other terminal'}.`)
```

To da innym programistom wskazówkę, co zrobić, jeśli spróbują po prostu uruchomić `yarn start` bez Webpack Dev Server.

W porządku, to było wiele zmian, zobaczmy, czy wszystko działa zgodnie z oczekiwaniami:

🏁 Uruchom `yarn start` w terminaly. Otwórz inną kartę lub okno terminala i uruchom w nim `yarn dev: wds`. Gdy Webpack Dev Server zakończy generowanie pakietu i jego zasobów (które powinny być plikami ~ 600kB) i oba procesy zawieszą się na twoich terminalach, otwórz `http://localhost:8000/` i powinieneś zobaczyć 'Hello Webpack!'. Otwórz konsolę Chrome i na karcie Source sprawdź, które pliki są uwzględnione. Powinieneś zobaczyć tylko `static/css/style.css` w `localhost:8000/` i mieć wszystkie swoje pliki źródłowe ES6 w `webpack://./src`. Oznacza to, że sourcemaps działają. W swoim edytorze, w `src/client/index.js`, spróbuj zmienić 'Hello Webpack!' na dowolny inny ciąg. Podczas zapisywania pliku Webpack Dev Server w twoim terminalu powinien wygenerować nowy pakiet, a karta Chrome powinna się ponownie załadować automatycznie.

- Zabij poprzednie procesy w swoich terminalach za pomocą Ctrl + C, a następnie uruchom `yarn prod:build`, i następnie `yarn prod:start`. Otwórz `http://localhost:8000/` i nadal powinieneś zobaczyć "Hello Webpack!". Tym razem znajdziesz na karcie Source konsoli Chrome `static/js/bundle.js` pod `localhost:8000/`, ale nie źródła `webpack://`. Kliknij na `bundle.js` aby upewnić się, że jest zminimalizowane. Uruchom `yarn prod:stop`.

Dobra robota, wiem, że to było dość zagmatwane. Zasługujesz na przerwę! Następna sekcja jest łatwiejsza.

**Uwaga**: Polecam mieć otwarte co najmniej 3 terminale, jeden dla twojego serwera Express, jeden dla Webpack Dev Server, a drugi dla Git, testów i ogólnych poleceń, takich jak instalowanie pakietów z `yarn`. Najlepiej jest podzielić ekran terminala na wiele paneli, aby zobaczyć je wszystkie.

## React

> 💡 **[React](https://facebook.github.io/react/)** to biblioteka do tworzenia interfejsów użytkownika przez Facebook. Wykorzystuje **[JSX](https://facebook.github.io/react/docs/jsx-in-depth.html)** składnie do reprezentowania elementów i komponentów HTML przy jednoczesnym wykorzystaniu siły JavaScript.

W tej sekcji wyrenderujemy trochę tekstu przy użyciu React i JSX.

Najpierw zainstalujmy React i ReactDOM:

- Uruchom `yarn add react react-dom`

Zmień nazwę swojego pliku `src/client/index.js` na `src/client/index.jsx` i napisz w nim trochę kodu React:

```js
// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './app'
import { APP_CONTAINER_SELECTOR } from '../shared/config'

ReactDOM.render(<App />, document.querySelector(APP_CONTAINER_SELECTOR))
```

- Stwórz plik `src/client/app.jsx` zawierający:

```js
// @flow

import React from 'react'

const App = () => <h1>Hello React!</h1>

export default App
```

Ponieważ używamy tutaj składni JSX, musimy powiedzieć Babelowi, że musi go przekształcić za pomocą ustawienia wstępnego `babel-preset-reag`. I kiedy już nad tym pracujemy, dodamy również wtyczkę Babel o nazwie `flow-React-proptypes`, która automatycznie generuje PropTypes z adnotacji Flow dla twoich składników React.

- Uruchom `yarn add --dev babel-preset-react babel-plugin-flow-react-proptypes` i zedytuj swój plik `.babelrc` w ten sposób:

```json
{
  "presets": [
    "env",
    "flow",
    "react"
  ],
  "plugins": [
    "flow-react-proptypes"
  ]
}
```

🏁 Uruchom `yarn start` i `yarn dev:wds` oraz wciśnij `http://localhost:8000`. Powinieneś widzieć "Hello React!".

Teraz spróbuj zmienić tekst w `src / client / app.jsx` na coś innego. Webpack Dev Server powinien ponownie załadować stronę automatycznie, co jest całkiem fajne, ale zamierzamy ją jeszcze ulepszyć.

## Hot Module Replacement

> 💡 **[Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)** (*HMR*) to potężna funkcja Webpacka, która zastępuje moduł w locie bez ponownego ładowania całej strony.

Aby HMR działał z React, będziemy musieli ulepszyć kilka rzeczy.

- Uruchom `yarn add react-hot-loader@next`

- Edytuj swój `webpack.config.babel.js` tak oto:

```js
import webpack from 'webpack'
// [...]
entry: [
  'react-hot-loader/patch',
  './src/client',
],
// [...]
devServer: {
  port: WDS_PORT,
  hot: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
},
plugins: [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
],
```

`headers` ma umożliwić udostępnianie zasobów pochodzących z różnych źródeł, co jest niezbędne dla HMR.

- Edytuj swój plik `src/client/index.jsx`:

```js
// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './app'
import { APP_CONTAINER_SELECTOR } from '../shared/config'

const rootEl = document.querySelector(APP_CONTAINER_SELECTOR)

const wrapApp = AppComponent =>
  <AppContainer>
    <AppComponent />
  </AppContainer>

ReactDOM.render(wrapApp(App), rootEl)

if (module.hot) {
  // flow-disable-next-line
  module.hot.accept('./app', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./app').default
    ReactDOM.render(wrapApp(NextApp), rootEl)
  })
}
```

Musimy uczynić naszą 'aplikację' dzieckiem 'AppContainer' 'react-hot-loader' i musimy 'wymagać' następnej wersji naszej 'aplikacji' podczas ponownego ładowania. Aby ten proces był czysty i OK, tworzymy małą funkcję `wrapApp`, której używamy w obu miejscach potrzebnych do renderowania `App`. Możesz przesunąć `eslint-disable global-demand` na górę pliku, aby uczynić go bardziej czytelnym.

🏁 Uruchom ponownie proces `yarn dev: wds`, jeśli nadal był uruchomiony. Otwórz `localhost: 8000`. Na karcie Konsola powinny być widoczne niektóre dzienniki dotyczące HMR. Śmiało zmień coś w `src / client / app.jsx`, a twoje zmiany powinny zostać odzwierciedlone w przeglądarce po kilku sekundach, bez przeładowywania całej strony!

Następna sekcja: [05 - Redux, Immutable, Fetch](05-redux-immutable-fetch.md#readme)

Powrót do [poprzedniej sekcji](03-express-nodemon-pm2.md#readme) albo [spisu treści](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
