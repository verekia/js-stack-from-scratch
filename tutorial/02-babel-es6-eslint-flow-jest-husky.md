# 02 - Babel, ES6, ESLint, Flow, Jest, i Husky

Kod dla tego rozdziału dostępny jest [tutaj](https://github.com/verekia/js-stack-walkthrough/tree/master/02-babel-es6-eslint-flow-jest-husky).

Użyjemy teraz składni ES6, co stanowi wielką poprawę w stosunku do "starej" składni ES5. Wszystkie przeglądarki i środowiska JS dobrze rozumieją ES5, ale nie ES6. Tam właśnie na ratunek przychodzi narzędzie o nazwie Babel!

## Babel

> 💡 **[Babel](https://babeljs.io/)** to kompilator, który przekształca kod ES6 (i inne rzeczy, takie jak składnia JSX Reacta) w kod ES5. Jest bardzo modułowy i może być używany w przeróżnych [środowiskach](https://babeljs.io/docs/setup/). Jest to zdecydowanie preferowany kompilator ES5 społeczności React.

- Przenieś swój `index.js` do nowego `src` folderu. Tutaj napiszesz swój kod ES6. Usuń poprzedni kod związany z `color` w `index.js`, i zamień prostym:

```js
const str = 'ES6'
console.log(`Hello ${str}`)
```

Używamy tutaj *template string*, który jest w ES6 i pozwala nam wstrzykiwać zmienne bezpośrednio do ciągu znaków bez konkatenacji za pomocą `${}`. Zauważ, że ciągi szablonów są tworzone przy użyciu **backquotes**.

- Uruchom `yarn add --dev babel-cli` aby zainstalować interfejs CLI dla Babel.

Babel CLI pochodzi z [dwóch plików wykonalnych](https://babeljs.io/docs/usage/cli/): `babel`, który kompiluje pliki ES6 w nowe pliki ES5, oraz `babel-node`, którego możesz użyć do zastąpienia połączenia z binarką `node` i uruchamiać pliki ES6 bezpośrednio w locie. `babel-node` jest świetny do programowania, ale jest ciężki i nie jest przeznaczony do produkcji. W tym rozdziale będziemy korzystać z `babel-node` aby skonfigurować środowisko programistyczne, a w następnym użyjemy `babel` do zbudowania plików ES5 do produkcji.

- W `package.json`, w Twoim skrypcie `start`, zamień `node .` z `babel-node src` (`index.js` jest domyślnym plikiem, którego szuka Node, dlatego możemy pominąć `index.js`).

Jeśli spróbujesz uruchomić teraz `yarn start`, powinien wypisać poprawne wyjście, ale Babel tak naprawdę nic nie robi. To dlatego, że nie podaliśmy żadnych informacji o transformacjach, które chcemy zastosować. Jedynym powodem, dla którego drukuje prawidłowe dane wyjściowe, jest to, że Node natywnie rozumie ES6 bez pomocy Babela. Niektóre przeglądarki lub starsze wersje Node nie byłyby jednak tak skuteczne!

- Uruchom `yarn add --dev babel-preset-env` aby zainstalować pakiet ustawień Babel o nazwie `env`, który zawiera konfiguracje dla najnowszych funkcji ECMAScript obsługiwanych przez Babel.

- Stwórz plik `.babelrc`  w katalogu głównym projektu, który jest plikiem JSON dla konfiguracji Babel. Wpisz do niego następujące polecenie, aby Babel użył ustawienia wstępnego `env`:

```json
{
  "presets": [
    "env"
  ]
}
```

🏁 `yarn start` powinien nadal działać, ale w rzeczywistości teraz coś robi. Nie możemy jednak stwierdzić, czy tak jest, ponieważ używamy `babel-node` do interpretacji kodu ES6 w locie. Wkrótce będziesz mieć dowód, że Twój kod ES6 jest faktycznie przekształcany, gdy dojdziesz do [ES6 modules syntax](#the-es6-modules-syntax) sekcji w tym rozdziale.

## ES6

> 💡 **[ES6](http://es6-features.org/)**: Najbardziej znacząca poprawa języka JavaScript. Istnieje zbyt wiele funkcji ES6, aby je tutaj wymienić, ale typowy kod ES6 używa klas z `class`, `const` i `let`, template strings, i arrow functions (`(text) => { console.log(text) }`).

### Tworzenie klasy ES6

- Stwórz nowy plik, `src/dog.js`, zawierający następującą klasę ES6:

```js
class Dog {
  constructor(name) {
    this.name = name
  }

  bark() {
    return `Wah wah, I am ${this.name}`
  }
}

module.exports = Dog
```

Nie powinno cię to dziwić, jeśli robiłeś coś z OOP w przeszłości w jakimkolwiek języku. Jest jednak stosunkowo nowy dla JavaScript. Klasa jest wystawiona na świat zewnętrzny poprzez zadanie `module.exports`.

W `src/index.js`, wpisz następująco:

```js
const Dog = require('./dog')

const toby = new Dog('Toby')

console.log(toby.bark())
```

Jak widać, w przeciwieństwie do tworzonego przez społeczność pakietu `color`, którego używaliśmy wcześniej, kiedy wymagamy jednego z naszych plików, używamy `./` w `require()`.

🏁 Uruchom `yarn start` i powinno wypisać "Wah wah, I am Toby".

### The ES6 modules syntax

Tutaj po prostu zastępujemy `const Dog = require('./dog')` poprzez `import Dog from './dog'`, która jest nowszą składnią modułów ES6 (w przeciwieństwie do składni modułów "CommonJS"). Obecnie nie jest natywnie obsługiwany przez NodeJS, więc jest to dowód na to, że Babel poprawnie przetwarza te pliki ES6.

W `dog.js`, również zamieńmy `module.exports = Dog` poprzez `export default Dog`

🏁 `yarn start` powinien znów wypisać "Wah wah, I am Toby".

## ESLint

> 💡 **[ESLint](http://eslint.org)** jest linterem z wyboru dla kodu ES6. Linter zawiera zalecenia dotyczące formatowania kodu, które wymuszają spójność stylu w kodzie i kodzie udostępnianym zespołowi. Jest to również świetny sposób na naukę JavaScript, popełniając błędy, które wyłapie ESLint.

ESLint działa z *regułami* i istnieje [wiele z nich](http://eslint.org/docs/rules/). Zamiast samodzielnie konfigurować reguły dla naszego kodu, użyjemy konfiguracji stworzonej przez Airbnb. Ta konfiguracja wykorzystuje kilka wtyczek, więc musimy je również zainstalować.

Sprawdź dla Airbnb najnowsze [instrukcje](https://www.npmjs.com/package/eslint-config-airbnb) aby poprawnie zainstalować pakiet konfiguracyjny i wszystkie jego zależności. W dniu 2017-02-03 zalecamy użycie następującego polecenia w terminalu:

```sh
npm info eslint-config-airbnb@latest peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add --dev eslint-config-airbnb@latest
```

Powinien zainstalować wszystko, czego potrzebujesz i dodać `eslint-config-airbnb`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, oraz `eslint-plugin-react` do Twojego pliku `package.json` automatycznie.

**Uwaga**: Zamieniłem `npm install` poprzez `yarn add` w tym poleceniu. To również nie będzie działać w systemie Windows, więc spójrz na plik `package.json` tego repozytorium i po prostu ręcznie zainstaluj wszystkie zależności związane z ESLint używając `yarn add --dev packagename@^#.#.#` z `#.#.#` będące wersjami podanymi w `package.json` dla każdego pakietu.

- Stwórz plik `.eslintrc.json` na górze projektu, tak jak zrobiliśmy to dla Babel, i wpisz do niego:

```json
{
  "extends": "airbnb"
}
```

Stworzymy skrypt NPM/Yarn do uruchomienia ESLint. Zainstalujmy pakiet `eslint`, aby móc korzystać z CLI `eslint`:

- Uruchom `yarn add --dev eslint`

Zaktualizuj `scripts` Twojego `package.json` aby zawierało nowe zadanie `test`:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src"
},
```

Tutaj po prostu mówimy ESLint, że chcemy, aby robił swoje z wszystkimi plikami JavaScript w folderze `src`.

Użyjemy ten standarowy `test` aby uruchomić łańcuch wszystkich poleceń, które sprawdzają poprawność naszego kodu, niezależnie od tego, czy jest to linting, sprawdzanie typu, czy testowanie jednostkowe.

- Uruchom `yarn test`, i powinieneś zobaczyć całą masę błędów za brakujące średniki oraz ostrzeżenie o używaniu `console.log()` w `index.js`. Dodaj `/* eslint-disable no-console */` na górze naszego pliku `index.js` aby pozwolić korzystać z `console` w tym pliku.

**Uwaga**: Jeśli pracujesz na systemie Windows, upewnij się, że skonfigurowałeś edytor i Git, aby używały zakończeń linii LX w systemie Unix, a nie Windows CRLF. Jeśli Twój projekt jest używany tylko w środowisku Windows, możesz dodać `"linebreak-style": [2, "windows"]` w ESLint-wej tablicy `rules` (zobacz przykład poniżej) aby wymusić CRLF.

### Średniki

Dobra, to prawdopodobnie najbardziej gorąca debata w społeczności JavaScript, porozmawiajmy o tym przez chwilę. JavaScript ma tę funkcję o nazwie Automatic Semicolon Insertion, która umożliwia pisanie kodu z lub bez średników. To naprawdę sprowadza się do osobistych preferencji i nie ma w tym temacie dobra i zła. Jeśli podoba Ci się składnia Pythona, Ruby lub Scali, prawdopodobnie spodoba Ci się pomijanie średników. Jeśli wolisz składnię Java, C # lub PHP, prawdopodobnie wolisz używać średników.

Większość ludzi pisze JavaScript ze średnikami z przyzwyczajenia. Tak było w moim przypadku, dopóki nie spróbowałem przejść bez średnika po obejrzeniu próbek kodu z dokumentacji Redux. Na początku wydawało się to trochę dziwne, po prostu dlatego, że nie byłem do tego przyzwyczajony. Po zaledwie jednym dniu pisania kodu w ten sposób nie wiedziałem, że wrócę do używania średników. Czuły się takie nieporadne i niepotrzebne. Moim zdaniem kod bez średników jest łatwiejszy dla oczu i szybszy.

Polecam przeczytać [dokumentację ESLint odnośnie średników](http://eslint.org/docs/rules/semi). Jak wspomniano na stronie, jeśli używasz semicolon-less, istnieją raczej rzadkie przypadki, w których wymagane są średniki. ESLint może chronić cię przed takimi przypadkami dzięki zasadzie `no-unexpected-multiline`. Skonfigurujmy ESLint, aby bezpiecznie przechodził bez średnika w `.eslintrc.json`:

```json
{
  "extends": "airbnb",
  "rules": {
    "semi": [2, "never"],
    "no-unexpected-multiline": 2
  }
}
```

🏁 Uruchom `yarn test`, i powinien teraz przejść pomyślnie. Spróbuj dodać gdzieś niepotrzebny średnik, aby upewnić się, że reguła jest poprawnie skonfigurowana.

Wiem, że niektórzy z was będą chcieli nadal używać średników, co sprawi, że kod podany w tym samouczku będzie niewygodny. Jeśli używasz tego samouczka tylko do nauki, jestem pewien, że nauka bez średników pozostanie do zniesienia, dopóki nie wrócisz do używania ich w prawdziwych projektach. Jeśli chcesz użyć kodu podanego w tym samouczku jako schematu, będzie to wymagało trochę przepisania, co powinno być dość szybkie, gdy ESLint ustawia wymuszanie średników, aby poprowadzić cię przez ten proces. Przepraszam, jeśli jesteś w takiej sytuacji.

### Compat

[Compat](https://github.com/amilajack/eslint-plugin-compat) to fajna wtyczka ESLint, która ostrzega, jeśli korzystasz z niektórych interfejsów API JavaScript, które nie są dostępne w przeglądarkach, a które musisz obsługiwać. Używa [Browserslist](https://github.com/ai/browserslist), która polega na [Can I Use](http://caniuse.com/).

- Uruchom `yarn add --dev eslint-plugin-compat`

- Dodaj poniższe do swojego `package.json`, wskazując, że chcemy wspierać przeglądarki, które mają ponad 1% udziału w rynku:

```json
"browserslist": ["> 1%"],
```

- Edytuj swój plik `.eslintrc.json` tak:

```json
{
  "extends": "airbnb",
  "plugins": [
    "compat"
  ],
  "rules": {
    "semi": [2, "never"],
    "no-unexpected-multiline": 2,
    "compat/compat": 2
  }
}
```

Możesz wypróbować wtyczkę, używając `navigator.serviceWorker` lub `fetch` na przykład w kodzie, który powinien wywołać ostrzeżenie ESLint.

### ESLint w Twoim edytorze

W tym rozdziale omówiono ESLint w terminalu, który doskonale nadaje się do wychwytywania błędów w czasie kompilacji / przed wypychaniem, ale prawdopodobnie również chcesz go zintegrować z IDE w celu uzyskania natychmiastowej informacji zwrotnej. NIE używaj swojego natywnego ES6 linting z IDE. Skonfiguruj go tak, aby plik binarny, którego używa do czyszczenia, był tym, który znajduje się w folderze `node_modules`. W ten sposób może korzystać ze wszystkich konfiguracji projektu, ustawienia wstępnego Airbnb itp. W przeciwnym razie otrzymasz tylko trochę ogólne linting ES6.

## Flow

> 💡 **[Flow](https://flowtype.org/)**: Sprawdzanie typu statycznego przez Facebook. Wykrywa niespójne typy w kodzie. Na przykład da ci błąd, jeśli spróbujesz użyć stringa tam, gdzie powinna być używana liczba.

W tej chwili nasz kod JavaScript jest prawidłowym kodem ES6. Flow może analizować zwykły JavaScript, aby dać nam pewne spostrzeżenia, ale aby wykorzystać jego pełną moc, musimy dodać annotacje typu w naszym kodzie, co spowoduje, że będzie on niestandardowy. Musimy nauczyć Babel i ESLint, jakie są te adnotacje typu, aby te narzędzia nie wystraszyły się podczas analizowania naszych plików.

- Uruchom `yarn add --dev flow-bin babel-preset-flow babel-eslint eslint-plugin-flowtype`

`flow-bin` to plik binarny do uruchomienia Flow w naszych zadaniach `scripts`, `babel-preset-flow` jest ustawieniem wstępnym dla Babel do zrozumienia adnotacji Flow, `babel-eslint` to pakiet do włączenia ESLint *polegać na parserze Babela* zamiast własnego, i `eslint-plugin-flowtype` to wtyczka ESLint do adnotacji Flow. Phew.

- Zaktualizuj swój plik `.babelrc` następująco:

```json
{
  "presets": [
    "env",
    "flow"
  ]
}
```

- Oraz zaktualizuj `.eslintrc.json` tak właśnie:

```json
{
  "extends": [
    "airbnb",
    "plugin:flowtype/recommended"
  ],
  "plugins": [
    "flowtype",
    "compat"
  ],
  "rules": {
    "semi": [2, "never"],
    "no-unexpected-multiline": 2,
    "compat/compat": 2
  }
}
```

**Uwaga**: `plugin:flowtype/recommended` zawiera instrukcję dotyczącą użycia parsera Babel przez ESLint. Jeśli chcesz być bardziej precyzyjny, możesz dodać `"parser": "babel-eslint"` w `.eslintrc.json`.

Wiem, że to dużo do zrobienia, więc poświęć chwilę, aby się nad tym zastanowić. Nadal jestem zdumiony, że ESLint może nawet użyć parsera Babel do zrozumienia adnotacji Flow. Te 2 narzędzia są naprawdę niesamowite, ponieważ są tak modułowe.

- Połącz `flow` ze swoim zadaniem `test`:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src && flow"
},
```

- Stwórz plik `.flowconfig` w katalogu głównym twojego projektu zawierającego:

```flowconfig
[options]
suppress_comment= \\(.\\|\n\\)*\\flow-disable-next-line
```

Jest to małe narzędzie, które skonfigurowaliśmy, aby Flow ignorował wszelkie ostrzeżenia wykryte w następnym wierszu. Użyłbyś tego w ten sposób, podobnie jak `eslint-disable`:

```js
// flow-disable-next-line
something.flow(doesnt.like).for.instance()
```

W porządku, wszyscy powinniśmy być przygotowani na część konfiguracyjną.

- Dodaj adnotację Flow do `src/dog.js` w ten sposób:

```js
// @flow

class Dog {
  name: string

  constructor(name: string) {
    this.name = name
  }

  bark() {
    return `Wah wah, I am ${this.name}`
  }
}

export default Dog
```

Komentarz `// @flow` informuje Flow, że chcemy, aby ten plik był sprawdzany pod względem typu. Poza tym adnotacje Flow są zwykle dwukropkiem po parametrze funkcji lub nazwie funkcji. Sprawdź [dokumentację](https://flowtype.org/docs/quick-reference.html), aby uzyskać więcej szczegółów.

- Dodaj `// @flow` na początku `index.js`.

`yarn test` powinien teraz zarówno lintować, jak i sprawdzać poprawność kodu.

Są dwie rzeczy, które chcę, abyś spróbował:

- W `dog.js`, zamień `constructor(name: string)` poprzez `constructor(name: number)`, i uruchom `yarn test`. Powinieneś otrzymać błąd **Flow** mówiący ci, że te typy są niekompatybilne. To oznacza, że Flow jest ustawiony prawidłowo.

- Teraz zamień `constructor(name: string)` poprzez `constructor(name:string)`, i uruchom `yarn test`. Powinieneś otrzymać błąd **ESLint** mówiący ci że, annotacje Flow powinny mieć spację po dwukropku. Oznacza to, że wtyczka Flow dla ESLint jest poprawnie skonfigurowana.

🏁 Jeśli otrzymałeś 2 różne błędy, działa, wszystko jest ustawione na Flow i ESLint! Pamiętaj, aby ponownie wstawić brakującą spację do adnotacji Flow.

### Flow w twoim edytorze

Podobnie jak w przypadku ESLint, powinieneś poświęcić trochę czasu na konfigurację edytora / IDE, aby uzyskać natychmiastową informację zwrotną, gdy Flow wykryje problemy w kodzie.

## Jest

> 💡 **[Jest](https://facebook.github.io/jest/)**: Biblioteka testująca JavaScript na Facebooku. Jest bardzo prosta w konfiguracji i zapewnia wszystko, czego potrzebujesz od biblioteki testowej od razu po wyjęciu z pudełka. Może także testować komponenty React.

- Uruchom `yarn add --dev jest babel-jest` aby zainstalować Jest oraz pakiet umożliwiający korzystanie z Babel.

- Dodaj następujące elementy do swojego `.eslintrc.json` w katalogu głównym obiektu, aby umożliwić korzystanie z funkcji Jest bez konieczności importowania ich do każdego pliku testowego:

```json
"env": {
  "jest": true
}
```

- Stwórz plik `src/dog.test.js` zawierający:

```js
import Dog from './dog'

test('Dog.bark', () => {
  const testDog = new Dog('Test')
  expect(testDog.bark()).toBe('Wah wah, I am Test')
})
```

- Dodaj `jest` do swojego `test` skryptu:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src && flow && jest --coverage"
},
```

Flaga `--coverage` sprawia, że Jest automatycznie generuje dane pokrycia dla twoich testów. Jest to przydatne, aby sprawdzić, które części twojej bazy kodu nie są testowane. Zapisuje te dane w folderze 'zasięg'.

- Dodaj `/coverage/` do swojego `.gitignore`

🏁 Uruchom `yarn test`. Po linting i sprawdzeniu typu powinien uruchomić testy Jest i pokazać tabelę zasięgu. Wszystko powinno być zielone!

## Git Hooks z Husky

> 💡 **[Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)**: Skrypty uruchamiane w przypadku wystąpienia określonych działań, takich jak zatwierdzenie lub wypchnięcie.

Ok, więc mamy teraz to miłe zadanie `test`, które mówi nam, czy nasz kod wygląda dobrze, czy nie. Zamierzamy skonfigurować Git Hooks, aby automatycznie uruchamiały to zadanie przed każdym `git commit` i` git push`, co uniemożliwi nam wypychanie złego kodu do repozytorium, jeśli nie przejdzie zadania `test`.

[Husky](https://github.com/typicode/husky) to pakiet, który sprawia, że bardzo łatwo jest skonfigurować Git Hooks.

- Uruchom `yarn add --dev husky`

Wszystko, co musimy zrobić, to stworzyć dwa nowe zadania w `scripts`, `precommit` i `prepush`:

```json
"scripts": {
  "start": "babel-node src",
  "test": "eslint src && flow && jest --coverage",
  "precommit": "yarn test",
  "prepush": "yarn test"
},
```

🏁 Jeśli teraz spróbujesz zatwierdzić lub wypchnąć kod, powinien on automatycznie uruchomić zadanie `test`.

Jeśli to nie działa, możliwe jest, że `yarn add --dev husky` nie zainstalował poprawnie Git Hooks. Nigdy nie spotkałem się z tym problemem, ale zdarza się to u niektórych osób. Jeśli ty tak miałeś, uruchom `yarn add --dev husky --force`, i może opublikuj notatkę opisującą twoją sytuację [ten issue](https://github.com/typicode/husky/issues/84).

**Uwaga**: Jeśli pushujesz zaraz po commitcie, możesz użyć `git push --no-verify` aby uniknąć ponownego uruchomienia wszystkich testów.

Następna sekcja: [03 - Express, Nodemon, PM2](03-express-nodemon-pm2.md#readme)

Powrót do [poprzedniej sekcji](01-node-yarn-package-json.md#readme) lub do [spisu treści](https://github.com/verekia/js-stack-from-scratch#table-of-contents).
