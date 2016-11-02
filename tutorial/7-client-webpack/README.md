# 7 - Клиентское приложение ~на основе Webpack~

## Структура нашего приложения

- Create a `dist` folder at the root of your project, and add the following `index.html` file to it:
- Создайте директорию `dist` в корне вашего проекта, и добавьте туда файл `index.html` со следующим содержанием:

```html
<!doctype html>
<html>
  <head>
  </head>
  <body>
    <div class="app"></div>
    <script src="client-bundle.js"></script>
  </body>
</html>
```

В директории `src` создайте следующие поддиректории: `server`, `shared`, `client` и переместите текущий `index.js`  в папку `server`, а `dog.js` в `shared`. Создайте `app.js` в директории `client`.

We are not going to do any Node back-end yet, but this separation will help you see more clearly where things belong. You'll need to change the `import Dog from './dog';` in `server/index.js` to `import Dog from '../shared/dog';` though, or ESLint will detect errors for unresolved modules.
Мы пока что не собираемся создавать на Node серверную часть, но это разделение поможет более ясно понять что к чему относится. Вам нужно заменить `import Dog from './dog';` в `server/index.js` на `import Dog from '../shared/dog';`, иначе ESLint обнаружит ошибки неразрешаемых модулей.

Напишите в `client/app.js`:

```javascript
import Dog from '../shared/dog';

const browserToby = new Dog('Browser Toby');

document.querySelector('.app').innerText = browserToby.bark();
```

Добавьте следующее в `package.json`, после `eslintConfig`:

```json
"env": {
  "browser": true
}
```
Таким образом мы сможем использовать такие переменные как `window` или `document`, которые всегда доступны в браузере, без предупреждений ESLint о необъявленных переменных.

Если вы желаете использовать самые последние возможности ES6 в клиентском коде, такие как `Promise` (обещания - прим. пер.), вам нужно включить [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/) в ваш код.

- Запустите `yarn add babel-polyfill`

И вставьте в самое начало `app.js` импорт этого модуля:

```javascript
import 'babel-polyfill';
```

Включение ~~полифила~~ (англ. polyfill) прибавляет объема вашей сборке, поэтому подключайте  его только когда применяете конструкции, которые он охватывает. Для того, чтобы показать более полный шаблон кода в этом руководстве, я его применяю, и он появится примерах в следующих частях.

## Webpack

В среде Node вы можете свободно использовать `import` для различных файлов и Node разрешит (англ. resolve) их посредством файловой системы. В браузере файловая система отсутствует, следовательно `import` ведет в никуда. Для того чтобы `app.js`, являющийся точкой входа для приложения, получил всю древовидную структуру импортируемых файлов, мы собираемся "собрать" все это дерево зависимостей в один файл. Webpack - нужный для этого инструмент.

Webpack, как и Gulp, использует конфигурационные файлы вида `webpack.config.js`. В них возможно использование ES6 импорта и экспорта точно таким же способом, как мы делали с Gulp относительно Babel: обозначая этот файл как `webpack.config.babel.js`.

- Создайте пустой файл `webpack.config.babel.js`

- Пока вы в нем, добавьте `webpack.config.babel.js` в задачу `lint` в Gulp, и еще несколько констант с путями (`paths` - англ):

```javascript
const paths = {
  allSrcJs: 'src/**/*.js',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
  libDir: 'lib',
  distDir: 'dist',
};

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
);
```

Мы должы научить Webpack обрабатывать ES6 файлы с помощью Babel (точно так же как мы показали Gulp как это делать через `gulp-babel`). Для Webpack, когда нужно обработать файлы, не являющиеся простым старым JavaScript, мы используем *загрузчики* (loaders). Давайте установим загрузчик Babel для Webpack:

- Запустите `yarn add --dev babel-loader`

- Напишите следующее в `webpack.config.babel.js` файле:

```javascript
export default {
  output: {
    filename: 'client-bundle.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
```

Давайте это немного проанализируем:

Этот файл нужен чтобы сообщить Webpack некоторую информацию. `output.filename` - имя файла генерируемой сборки. `devtool: 'source-map'` - позволяет использовать source maps (карты кода) для упрощения отладки в браузере. В `module.loaders` есть свойство `test` с регулярным выражением, определяющим какие файлы должны обрабатываться загрузчиком `babel-loader`. Поскольку мы будем использовать как `.js` так и `.jsx` файлы (для React) в следующих частях, наше выражение выглядит как `/\.jsx?$/`. Директория `node_modules` исключена (exclude) поскольку ее не нужно транспилировать. Таким образом, когда код импортирует (`import`) пакеты, расположенные в `node_modules`, Babel не тратит время на обработку этих файлов. Раздел `resolve` сообщает Webpack файлы какого типа мы хотим подключать через `import`, позволяя тем самым опускать расширения в именах файлов, например как в `import Foo from './foo'`, где `foo` может быть `foo.js` или `foo.jsx`.

И так, мы настроили Webpack, но нам до сих пор требуется способ *запустить* его.

## Подключение Webpack к Gulp

Webpack может делать множество вещей. Он даже может полностью заменить Gulp, если проект в основном выполняется на стороне клиента. Gulp в свою очередь, как более общий инструмент, больше подходит для таких вещей как анализ кода (linting), тестирование, запуск задач на стороне сервера. Он так же проще в понимании для новичков чем чем сложное конфигурирование Webpack. У нас уже довольно хорошо настроен рабочий процесс на базе Gulp, так что интеграция Webpack в процес сборки пройдет проще простого.

Давайте создадим в Gulp задачу по запуску Webpack. Откройте `gulpfile.babel.js`.

We don't need the `main` task to execute `node lib/` anymore, since we will open `index.html` to run our app. 
Поскольку мы ~~will open~~ `index.html` чтобы запускать наше приложение, нам больше не требуется задача `main` чтобы выполнять `node lib/`.

- Уберите `import { exec } from 'child_process'`.

Аналогично плагинам для Gulp, пакет `webpack-stream` позволяет очень просто интегрировать Webpack в Gulp.

- Устанавливаем пакет: `yarn add --dev webpack-stream`

- Добавляем следующие `import`:

```javascript
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';
```

Вторая строчка просто подключает наш конфигурационный файл.

Как было сказанно ранее, в следующей части мы собираемся использовать `.jsx` файлы (на клиенте и даже позже на сервере), так что давайте настроим это сейчас, чтобы затем иметь фору.

- Измените константы следующим образом:

```javascript
const paths = {
  allSrcJs: 'src/**/*.js?(x)',
  serverSrcJs: 'src/server/**/*.js?(x)',
  sharedSrcJs: 'src/shared/**/*.js?(x)',
  clientEntryPoint: 'src/client/app.js',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
  libDir: 'lib',
  distDir: 'dist',
};
```

Здесь `.js?(x)` - просто шаблон, соответсвующий `.js` и `.jsx` файлам.

Теперь у нас есть константы для различных частей приложения и файл, указывающий на начальную точку сборки (entry point file).

- Измените задачу `main` так:

```javascript
gulp.task('main', ['lint', 'clean'], () =>
  gulp.src(paths.clientEntryPoint)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.distDir))
);
```

**Замечание**: Задача `build` сейчас транспилирует код ES6 в ES5 для каждого `.js` файла, расположенного в `src`. Поскольку мы разделили код на  `server`, `shared` и `client`, то мы могли бы компилировать только `server` и `shared` (поскольку Webpack позаботится о `client`). Тем не менее, в разделе Тестирование нам потребуется Gulp для компиляции клиентского кода чтобы тестировать его вне Webpack. Так что пока-что мы не дойдем до этого раздела, будет ~~несколько избыточное дублирование в~~ `build`. Давайте договоримся, что пока это нормально. Вообще мы даже не будем использовать `build` и директорию `lib` пока не доберемся до этой части, так что все что нас сейчас волнует - это клиентская сборка.

- Запустите `yarn start`, вы должны увидеть построенный Webpack файл `client-bundle.js`. Откройте `index.html` в браузере. Должно отобразиться "Wah wah, I am Browser Toby".

Одна последняя вещь: в отличие от директории `lib`, файлы `dist/client-bundle.js` и `dist/client-bundle.js.map` не очищаются задачей `clean` перед каждой сборкой.

- Добавьте `clientBundle: 'dist/client-bundle.js?(.map)'` в нашу конфигурацию путей (`paths`), и настройте задачу `clean` следующим образом:

```javascript
gulp.task('clean', () => del([
  paths.libDir,
  paths.clientBundle,
]));
```

- Добавьте `/dist/client-bundle.js*` в файл `.gitignore`:

Следующий раздел: [8 - React](/tutorial/8-react)

Назад в [предыдущий раздел](/tutorial/6-eslint) или [Содержание](https://github.com/verekia/js-stack-from-scratch).
