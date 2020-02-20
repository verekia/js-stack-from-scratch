# 09 - Travis, Coveralls, i Heroku

Kod tego rozdziału dostępny jest na `master` branchu [repozytorium JS-Stack-Boilerplate](https://github.com/verekia/js-stack-boilerplate).

W tym rozdziale integruję naszą aplikację z usługami stron trzecich. Usługi te oferują bezpłatne i płatne plany użytkowania. Korzystanie z takich usług w samouczku, który opiera się wyłącznie na społecznościowych i bezpłatnych narzędziach typu open source, jest nieco kontrowersyjne, dlatego utrzymuję 2 różne branche [repozytorium JS-Stack-Boilerplate](https://github.com/verekia/js-stack-boilerplate), `master` oraz `master-no-services`.

## Travis

> 💡 **[Travis CI](https://travis-ci.org/)** jest popularną platformą ciągłej integracji, bezpłatną dla projektów typu open source.

Jeśli Twój projekt jest publicznie hostowany na GitHub, integracja Travis jest bardzo prosta. Najpierw uwierzytelnij się za pomocą konta GitHub na Travis i dodaj swoje repozytorium.

- Następnie, stwórz plik `.travis.yml` zawierający:

```yaml
language: node_js
node_js: node
script: yarn test && yarn prod:build
```

Travis automatycznie wykryje, że używasz Yarn, ponieważ masz plik `yarn.lock`. Za każdym razem, gdy wypychasz kod do swojego repozytorium GitHub, uruchamia `yarn test && yarn prod:build`. Jeśli nic nie pójdzie źle, powinieneś otrzymać zielonego builda.

## Coveralls

> 💡 **[Coveralls](https://coveralls.io)** to usługa, która udostępnia historię i statystyki dotyczące zasięgu testu.

Jeśli Twój projekt jest open source na Github i zgodny z obsługiwanymi przez Coveralls usługami Continuous Integration, jedyne, co musisz zrobić, to przesłać plik pokrycia wygenerowany przez Jest do binarki `coveralls`.

- Uruchom `yarn add --dev coveralls`

- Edytuj Twój `.travis.yml` `script` instrukcjami jak:

```yaml
script: yarn test && yarn prod:build && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
```

Teraz, za każdym razem, gdy Travis zbuduje, automatycznie prześle Twoje dane dotyczące pokrycia testowego Jest do Coveralls.

## Odznaki

Czy na Travis i Coveralls wszystko jest zielone? Świetnie, pokaż to światu z błyszczącymi odznakami!

Możesz użyć kodu dostarczonego bezpośrednio przez Travis lub Coveralls, lub użyć [shields.io](http://shields.io/) aby ujednolicić lub dostosować odznaki. Użyjmy tutaj shields.io.

- Utwórz lub edytuj swój `README.md` w następujący sposób:

```md
[![Build Status](https://img.shields.io/travis/GITHUB-USERNAME/GITHUB-REPO.svg?style=flat-square)](https://travis-ci.org/GITHUB-USERNAME/GITHUB-REPO)
[![Coverage Status](https://img.shields.io/coveralls/GITHUB-USERNAME/GITHUB-REPO.svg?style=flat-square)](https://coveralls.io/github/GITHUB-USERNAME/GITHUB-REPO?branch=master)
```

Oczywiście, zamień `GITHUB-USERNAME/GITHUB-REPO` Twoją aktualną nazwą użytkownika Github i nazwą repozytorium.

## Heroku

> 💡 **[Heroku](https://www.heroku.com/)** to [PaaS](https://en.wikipedia.org/wiki/Platform_as_a_service) do wdrażania. Dba o szczegóły infrastruktury, dzięki czemu możesz skupić się na tworzeniu aplikacji bez martwienia się o to, co dzieje się za kulisami.

Ten samouczek nie jest w żaden sposób sponsorowany przez Heroku, ale Heroku jest doskonałą platformą. Pokażę Ci, jak wdrożyć na nim Twoją aplikację. Tak, to rodzaj darmowej miłości, którą otrzymujesz, gdy budujesz świetny produkt.

**Uwaga**: Mogę dodać sekcję AWS w tym rozdziale później, ale jedna rzecz na raz.

### Konfiguracja sieci

- Jeśli jeszcze tego nie zrobiono, zainstaluj [Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs) i zaloguj się.

- Przejdź do swojego [Heroku Dashboard](https://dashboard.heroku.com/) i stwórz 2 aplikacje, jedną nazwaną `your-project` i drugą przykładowo `your-project-staging`.

Pozwolimy Heroku zająć się transpilingiem naszego kodu ES6/Flow za pomocą Babel i wygenerować pakiety klientów za pomocą Webpacka. Ale skoro są `devDependencies`, Yarn nie zainstaluje ich w środowisku produkcyjnym takim jak Heroku. Zmieńmy to zachowanie za pomocą `NPM_CONFIG_PRODUCTION` zmiennej env.

- W obu aplikacjach, pod Settings > Config Variables, dodaj `NPM_CONFIG_PRODUCTION` ustawione `false`.

- Utwórz Pipeline, i przyznaj Heroku dostęp do swojego GitHuba.

- Dodaj obie aplikacje do pipeline, spraw, aby automatycznie wdrożyła zmiany w `master` i włącz Przegląd aplikacji.

W porządku, przygotujmy nasz projekt do wdrożenia w Heroku.

### Działanie w produkcji trybu lokalnego

- Utwórz plik `.env` zawierający:

```.env
NODE_ENV='production'
PORT='8000'
```

W tym pliku należy umieścić tylko zmienne local-only i secret. Nie przesyłaj go do publicznego repozytorium, jeśli Twój projekt jest prywatny.

- Dodaj `/.env` do swojego `.gitignore`

- Stwórz plik `Procfile` zawierający:

```Procfile
web: node lib/server
```

Tam określamy punkt wejścia naszego serwera.

Nie będziemy już używać PM2, zamiast tego użyjemy `heroku local`, aby uruchomić lokalnie w trybie produkcyjnym.

- Uruchom `yarn remove pm2`

- Edytuj swój skrypt `prod:start` w `package.json`:

```json
"prod:start": "heroku local",
```

- Usuń `prod:stop` z `package.json`. Już go nie potrzebujemy, ponieważ `heroku local` jest procesem zawieszenia, który możemy zabić za pomocą Ctrl+C, w przeciwieństwie do `pm2 start`.

🏁 Uruchom `yarn prod:build` oraz `yarn prod:start`. Powinien uruchomić serwer i pokazać logi.

### Wdrożenie do produkcji

- Dodaj następujące linie do swojego `scripts` w `package.json`:

```json
"heroku-postbuild": "yarn prod:build",
```

`heroku-postbuild` to zadanie, które będzie uruchamiane za każdym razem, gdy wdrażasz aplikację w Heroku.

Prawdopodobnie zechcesz także określić konkretną wersję Node lub Yarn, której ma używać Heroku.

- Dodaj to do swojego `package.json`:

```json
"engines": {
  "node": "7.x",
  "yarn": "0.20.3"
},
```

- Stwórz plik `app.json` zawierający:

```json
{
  "env": {
    "NPM_CONFIG_PRODUCTION": "false"
  }
}
```

To jest dla Review Apps do użycia.

Teraz powinieneś już być gotowy do korzystania z wdrożeń Heroku Pipeline.

🏁 Utwórz nową gałąź gita, wprowadź zmiany i otwórz GitHub Pull Request, aby utworzyć instancję Review App. Sprawdź zmiany w adresie URL Review App, i jeśli wszystko wygląda dobrze, scal Pull Request z `master` na GitHub. Kilka minut później aplikacja do testowania powinna zostać automatycznie wdrożona. Sprawdź zmiany w adresie URL aplikacji, a jeśli wszystko nadal wygląda dobrze, dodaj na produkcję.

Gotowe! Gratulacje, jeśli ukończyłeś cały samouczek od scratch.

Zasługujesz na ten medal emoji: 🏅

Powrót do [poprzedniej sekcji](08-bootstrap-jss.md#readme) lub [spisu treści](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
