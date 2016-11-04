# 12 - Flow

[Flow](https://flowtype.org/) - статический типизатор (static type checker). Он определяет несоответствие типов в вашем коде и позволяет напрямую декларировать типы через аннотации. 

- Для того, чтобы Babel мог понимать и убирать аннотации Flow в процессе транспиляции, установите плагин Flow для Babel выполнив `yarn add --dev babel-preset-flow`. Затем добавье `"flow"` после `babel.presets` в `package.json`.

- Создайте пустой файл `.flowconfig` в корне проекта.

- Запустите `yarn add --dev gulp-flowtype` чтобы установить Gulp плагин для Flow, и добавьте `flow()` в задачу `lint`:

```javascript
import flow from 'gulp-flowtype';

// [...]

gulp.task('lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
    paths.webpackFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(flow({ abort: true })) // Add Flow here
);
```

Опция `abort` прерывает задачу Gulp если Flow обнаруживает проблему.

Отлично, теперь мы можем запустить Flow.

- Добавьте аннотации Flow в `src/shared/dog.js` так, чтобы:

```javascript
// @flow

class Dog {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  bark(): string {
    return `Wah wah, I am ${this.name}`;
  }

  barkInConsole() {
    /* eslint-disable no-console */
    console.log(this.bark());
    /* eslint-enable no-console */
  }

}

export default Dog;
```

Комментарий `// @flow` говорит Flow что мы хотим проверять типы для этого файла. В остальном, аннотации Flow - это обычно двоеточие после параметра фукции или имени функции. Подробности посмотрите в документации.

Теперь, если вы запустите `yarn start`, Flow будет работать, но ESLint начнет жаловаться, что используется нестандартный синтаксис. 
Поскольку парсер Babel отлично справляется с парсингом Flow контента (благодаря установленному нами плагину `babel-preset-flow`), было бы здорово, если бы ESLint мог опираться на парсер Babel, вместо того, чтобы пытаться самому понять аннотации Flow. Вообще, это возможно при использовании пакета `babel-eslint`. Давайте сделаем это.

- Запустите `yarn add --dev babel-eslint`

- В `package.json`, после `eslintConfig`, добавьте следующее свойство: `"parser": "babel-eslint"`

Теперь `yarn start` должен одновременно анализировать код с помощью ESLint и проверять типы посредством Flow.

Теперь, поскольку ESLint и Babel совместно использовать общий парсер, мы можем заставить ESLint проверять наши Flow аннотации, используя плагин `eslint-plugin-flowtype`.

- Запустите `yarn add --dev eslint-plugin-flowtype` и добавьте `"flowtype"` после `eslintConfig.plugins` в `package.json`, и добавьте `"plugin:flowtype/recommended"` после `eslintConfig.extends` в массив после `"airbnb"`.

Теперь если вы, например, введете `name:string` в качестве аннотации, ESLint должен пожаловаться, что вы забыли пробел после двоеточия. 

**Замечание**: Свойство `"parser": "babel-eslint"` которое я заставил вас написать в `package.json` вообще-то входит в конфигурацию `"plugin:flowtype/recommended"`, так что теперь можете убрать его, чтобы сократить `package.json`. С другой стороны, оставить его здесь будет более наглядным, так что это на ваше предпочтение. Поскольку это руководство нацелено на максимальную краткость, я уберу.

- Вы можете теперь добавить `// @flow` в каждый `.js` и `.jsx` файл в папке `src`, запустить `yarn test` или `yarn start`, и добавлять аннотации везде где этого попросит Flow.

Вы можете обнаружить неожиданный случай в `src/client/component/message.jsx`:

```javascript
const Message = ({ message }: { message: string }) => <div>{message}</div>;
```

Как можете видеть, при деструктурировании параметра функции, вы должны делать аннотации для выделяемых свойств в виде объекта в литеральной нотации.

Другим случаем, с которым вы столкнетесь, будет в `src/client/reducers/dog-reducer.js`. Flow начнет жаловаться, что Immutable не имеет возвращаемого значения по умолчанию. Эта проблема описана тут: [#863 on Immutable](https://github.com/facebook/immutable-js/issues/863), и имеет два обходных путя:

```javascript
import { Map as ImmutableMap } from 'immutable';
// или
import * as Immutable from 'immutable';
```

Пока Immutable официально не разрешит проблему, просто выберите то, что вам больше нравится, когда импортируете компоненты Immutable. Лично я, буду использовать `import * as Immutable from 'immutable'`, поскольку это короче и не потребует рефакторинга кода после того, как проблема будет решена.

**Замечание**: Если Flow определяет ошибки типизации в папке `node_modules`, добавьте раздел `[ignore]` в файл `.flowconfig` чтобы указать какие именно пакеты игнорировать (не игнорируйте полностью директорию `node_modules`). Это может выглядеть так:
```
[ignore]

.*/node_modules/gulp-flowtype/.*
```
В моем случе плагин `linter-flow` для Atom обнаружил ошибки типизации в директории `node_modules/gulp-flowtype`, которая содержит файлы аннотированные `// @flow`.

Теперь у вас есть "пуленепробиваемый" код, который проанализирован, протипизирован и протестирован - отличная работа!

Назад в [предыдущий раздел](/tutorial/11-testing-mocha-chai-sinon) или [Содержание](/README.md).
