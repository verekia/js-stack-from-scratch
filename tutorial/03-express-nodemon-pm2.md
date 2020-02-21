# 03 - Express, Nodemon, i PM2

Kod dla tego rozdziału dostępny jest [tutaj](https://github.com/verekia/js-stack-walkthrough/tree/master/03-express-nodemon-pm2).

W tej sekcji utworzymy serwer, który będzie renderował naszą aplikację internetową. Ustawimy również tryb programowania i tryb produkcyjny dla tego serwera.

## Express

> 💡 **[Express](http://expressjs.com/)** jest zdecydowanie najpopularniejszym środowiskiem aplikacji webowych dla Node. Zapewnia bardzo prosty i minimalny interfejs API, a jego funkcje można rozszerzyć *middleware*.

Skonfigurujmy minimalnie serwer Express, aby obsługiwał stronę HTML z pewnym CSS.

- Usuń wszystko w środku `src`

Utwórz następujące pliki i foldery:

- Stwórz plik `public/css/style.css` zawierający:

```css
body {
  width: 960px;
  margin: auto;
  font-family: sans-serif;
}

h1 {
  color: limegreen;
}
```

- Stwórz pusty folder `src/client/`.

- Stwórz pusty folder `src/shared/`.

W tym folderze umieszczamy kod *isomorphic / universal* JavaScript – pliki używane zarówno przez klienta, jak i serwer. Świetnym przykładem użycia współdzielonego kodu są *routes*, jak zobaczymy w dalszej części tego samouczka, kiedy wykonamy asynchroniczne wywołanie. Tutaj po prostu mamy na przykład kilka stałych konfiguracji.

- Stwórz plik `src/shared/config.js` zawierający:

```js
// @flow

export const WEB_PORT = process.env.PORT || 8000
export const STATIC_PATH = '/static'
export const APP_NAME = 'Hello App'
```

Jeśli proces Node'a użyty do uruchomienia aplikacji ma `process.env.PORT` zestaw zmiennych środowiskowych (tak jest na przykład podczas wdrażania w Heroku), użyje tego dla portu. Jeśli nie ma, domyślnie `8000`.

- Stwórz plik `src/shared/util.js` zawierający:

```js
// @flow

// eslint-disable-next-line import/prefer-default-export
export const isProd = process.env.NODE_ENV === 'production'
```

To prosty sposób na sprawdzenie, czy działamy w trybie produkcyjnym, czy nie. Komentarz `// eslint-disable-next-line import/prefer-default-export` jest ponieważ mamy tutaj tylko jeden nazwany eksport. Możesz go usunąć podczas dodawania innych eksportów w tym pliku.

- Uruchom `yarn add express compression`

`compression` to oprogramowanie pośrednie Express do aktywacji kompresji Gzip na serwerze.

- Stwórz plik `src/server/index.js` zawierający:

```js
// @flow

import compression from 'compression'
import express from 'express'

import { APP_NAME, STATIC_PATH, WEB_PORT } from '../shared/config'
import { isProd } from '../shared/util'
import renderApp from './render-app'

const app = express()

app.use(compression())
app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))

app.get('/', (req, res) => {
  res.send(renderApp(APP_NAME))
})

app.listen(WEB_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${WEB_PORT} ${isProd ? '(production)' : '(development)'}.`)
})
```

Nic szczególnego, to niemal samouczek „Hello World dla Expressa” z kilkoma dodatkowymi importami. Używamy tutaj 2 różnych katalogów plików statycznych. `dist` dla wygenerowanych plików, `public` dla plików deklaratywnych.

- Stwórz plik `src/server/render-app.js` zawierający:

```js
// @flow

import { STATIC_PATH } from '../shared/config'

const renderApp = (title: string) =>
`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="${STATIC_PATH}/css/style.css">
  </head>
  <body>
    <h1>${title}</h1>
  </body>
</html>
`

export default renderApp
```

Wiesz jak zwykle masz *silniki szablonów* na zapleczu? Są one prawie przestarzałe, ponieważ JavaScript obsługuje ciągi szablonów. Tutaj tworzymy funkcję, która przyjmuje parametr `title` jako parametr i wstrzykuje go zarówno do tagów `title`, jak i `h1` strony, zwracając pełny ciąg HTML. Używamy również stałej `STATIC_PATH` jako ścieżki podstawowej dla wszystkich naszych zasobów statycznych.

### Podświetlanie składni ciągów szablonów HTML w Atom (opcjonalnie)

W zależności od edytora może być możliwe uzyskanie wyróżnienia składni działającego dla kodu HTML wewnątrz ciągów szablonów. W Atom, jeśli ciąg szablonu zostanie poprzedzony tagiem `html` (lub dowolnym tagiem, który *kończy się* na `html`, np. `Ilovehtml`), automatycznie podświetli zawartość tego łańcucha. Czasami używam tagu `html` biblioteki `common-tags`, aby skorzystać z tego:

```js
import { html } from `common-tags`

const template = html`
<div>Wow, colors!</div>
`
```

Nie umieściłem tej sztuczki na początku tego samouczka, ponieważ wydaje się, że działa ona tylko w Atomie i jest mniej niż idealna. Jednak niektórzy z was, użytkownicy Atom, mogą uznać to za przydatne.

W każdym razie, wracając do biznesu!

- W `package.json` zmień swój `start` skrypt tak oto: `"start": "babel-node src/server",`

🏁 Uruchom `yarn start`, i wpisz `localhost:8000` w swoją przeglądarkę. Jeśli wszystko działa zgodnie z oczekiwaniami, powinna zostać wyświetlona pusta strona z tekstem 'Hello App' zarówno w tytule karty, jak i zielonym nagłówkiem na stronie.

**Uwaga**: Niektóre procesy - zwykle procesy, które czekają, aż coś się wydarzy, na przykład serwer - uniemożliwiają wprowadzanie poleceń w terminalu, dopóki nie zostaną wykonane. Aby przerwać takie procesy i odzyskać sprawnie swój, naciśnij  **Ctrl+C**. Możesz alternatywnie otworzyć nową kartę terminala, jeśli chcesz, aby działały, jednocześnie umożliwiając wprowadzanie poleceń. Możesz także uruchomić te procesy w tle, ale to nie wchodzi w zakres tego samouczka.

## Nodemon

> 💡 **[Nodemon](https://nodemon.io/)** to narzędzie do automatycznego restartowania serwera Node, gdy nastąpią zmiany plików w katalogu.

Będziemy używać Nodemona za każdym razem, gdy będziemy w trybie **development**.

- Uruchom `yarn add --dev nodemon`

- Zmień swój `scripts` tak:

```json
"start": "yarn dev:start",
"dev:start": "nodemon --ignore lib --exec babel-node src/server",
```

`start` jest teraz tylko wskaźnikiem do innego zadania, `dev: start`. To daje nam warstwę abstrakcji, aby dostosować to, co jest domyślnym zadaniem.

W `dev: start`, flaga `--ignore lib` ma *nie* restartować serwera, gdy nastąpią zmiany w katalogu `lib`. Nie masz jeszcze tego katalogu, ale zamierzamy go wygenerować w następnej sekcji tego rozdziału, więc wkrótce będzie to miało sens. Nodemon zwykle uruchamia plik binarny `node`. W naszym przypadku, ponieważ używamy Babel, możemy powiedzieć Nodemonowi, aby zamiast tego użył pliku binarnego `babel-node`. W ten sposób zrozumie cały kod ES6 / Flow.

🏁 Uruchom 'yarn start' i otwórz `localhost: 8000`. Śmiało zmień stałą `APP_NAME` w `src / shared / config.js`, co powinno uruchomić restart serwera w terminalu. Odśwież stronę, aby zobaczyć zaktualizowany tytuł. Należy pamiętać, że ten automatyczny restart serwera różni się od *Hot Module Replacement*, która ma miejsce, gdy składniki strony są aktualizowane w czasie rzeczywistym. Tutaj nadal potrzebujemy ręcznego odświeżania, ale przynajmniej nie musimy zabijać procesu i restartować go ręcznie, aby zobaczyć zmiany. Wymiana Hot Module Replacement zostanie wprowadzona w następnym rozdziale.

## PM2

> 💡 **[PM2](http://pm2.keymetrics.io/)** jest menedżerem procesów dla Node. Utrzymuje procesy przy produkcji i oferuje mnóstwo funkcji do zarządzania nimi i monitorowania.

Będziemy używać PM2, ilekroć będziemy w trybie **production**.

- Uruchom `yarn add --dev pm2`

W produkcji chcesz, aby Twój serwer był tak wydajny, jak to możliwe. `babel-node` uruchamia cały proces transpilacji Babel dla twoich plików przy każdym wykonaniu, czego nie chcesz w produkcji. Babel musi wykonać całą tę pracę wcześniej, a nasz serwer będzie obsługiwał zwykłe, wcześniej skompilowane pliki ES5.

Jedną z głównych cech Babel jest pobranie folderu kodu ES6 (zwykle o nazwie `src`) i przeniesienie go do folderu kodu ES5 (zwykle o nazwie `lib`).

Ten folder `lib` jest generowany automatycznie, więc dobrą praktyką jest wyczyszczenie go przed nową kompilacją, ponieważ może zawierać niechciane stare pliki. Prostym pakietem do usuwania plików z obsługą wielu platform jest `rimraf`.

- Uruchom `yarn add --dev rimraf`

Dodajmy następujący `prod:build` task do naszego `scripts`:

```json
"prod:build": "rimraf lib && babel src -d lib --ignore .test.js",
```

- Uruchom `yarn prod:build`, i powinien wygenerować folder `lib` zawierający transpilowany kod, z wyjątkiem plików kończących się na `.test.js` (zwróć uwagę, że pliki `.test.jsx` są również ignorowane przez ten parametr).

- Dodaj `/lib/` do swojego `.gitignore`

Ostatnia rzecz: przekażemy zmienną środowiskową `NODE_ENV` do naszego pliku binarnego PM2. W Unixie zrobiłbyś to, uruchamiając `NODE_ENV = production pm2`, ale Windows używa innej składni. Użyjemy małego pakietu o nazwie `cross-env`, aby ta składnia działała również w systemie Windows.

- Uruchom `yarn add --dev cross-env`

Zaktualizujmy nasz `package.json` w ten sposób:

```json
"scripts": {
  "start": "yarn dev:start",
  "dev:start": "nodemon --ignore lib --exec babel-node src/server",
  "prod:build": "rimraf lib && babel src -d lib --ignore .test.js",
  "prod:start": "cross-env NODE_ENV=production pm2 start lib/server && pm2 logs",
  "prod:stop": "pm2 delete server",
  "test": "eslint src && flow && jest --coverage",
  "precommit": "yarn test",
  "prepush": "yarn test"
},
```

🏁 Uruchom `yarn prod:build`, następnie uruchom `yarn prod: start`. PM2 powinien pokazywać aktywny proces. Przejdź do `http: // localhost: 8000 /` w przeglądarce i powinieneś zobaczyć swoją aplikację. Twój terminal powinien wyświetlać dzienniki, które powinny brzmieć 'Serwer działający na porcie 8000 (produkcja).'. Zauważ, że dzięki PM2 twoje procesy są uruchamiane w tle. Jeśli naciśniesz Ctrl+C, zabije to polecenie `pm2 logs`, które było ostatnim poleceniem w naszym łańcuchu `prod: start`, ale serwer powinien nadal renderować stronę. Jeśli chcesz zatrzymać serwer, uruchom `yarn prod:stop`

Teraz, gdy mamy zadanie `prod: build`, dobrze byłoby upewnić się, że działa dobrze przed przekazaniem kodu do repozytorium. Ponieważ prawdopodobnie nie jest konieczne uruchamianie go dla każdego zatwierdzenia, sugeruję dodanie go do zadania `prepush`:

```json
"prepush": "yarn test && yarn prod:build"
```

🏁 Uruchom `yarn prepush` lub po prostu wypchnij pliki, aby uruchomić proces.

**Uwaga**: Nie mamy tutaj żadnego testu, więc Jest trochę narzeka. Zignoruj to na razie.

Następna sekcja: [04 - Webpack, React, HMR](04-webpack-react-hmr.md#readme)

Powrót do [poprzedniej sekcji](02-babel-es6-eslint-flow-jest-husky.md#readme) lub do [spisu treści](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
