# 6 - ESLint

Мы собираемся контролировать качество кода (англ. lint - прим. переводчика) чтобы перехватывать потенциальные проблемы. ESLint - предпочтительный анализатор кода (англ. linter - прим. переводчика) для ES6. Вместо того чтобы самим определять правила для нашего кода, мы воспользуемся конфигурацией, созданной Airbnb. В этой конфигурации используется несколько плагинов, поэтому мы их тоже установим.

- Запустите `yarn add --dev eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react`

Как вы видите, вы можете установить несколько пакетов одной командой. Как обычно, они все добавятся в ваш `package.json`.

В `package.json`, добавьте свойство `eslintConfig` с таким содержанием:
```json
"eslintConfig": {
  "extends": "airbnb",
  "plugins": [
    "import"
  ]
},
```
В разделе `plugins` мы сообщаем ESLint что используем синтакисис ES6 `import`.

**Замечание**: Вместо свойства `eslintConfig` в `package.json` можно использовать файл `.eslintrc.js` в корне вашего проекта. Так же как и с конфигурацией Babel, мы стараемся избегать загромождения корневой директории большим количеством файлов, но если у вас сложная конфигурация ESLint, рассмотрите такую альтернативу.

Мы создадим задачу для Gulp, которая запускает ESLint для нас. Поэтому установим также плагин ESLint для Gulp:

- запустите `yarn add --dev gulp-eslint`

Добавьте следующую задачу в ваш `gulpfile.babel.js`:

```javascript
import eslint from 'gulp-eslint';

const paths = {
  allSrcJs: 'src/**/*.js',
  gulpFile: 'gulpfile.babel.js',
  libDir: 'lib',
};

// [...]

gulp.task('lint', () => {
  return gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
```

Здесь мы говорм Gulp, что для этой задачи мы хотим подключить `gulpfile.babel.js` и JS файлы, расположенные в src`.

Откорректируйте задачу `build` так, чтобы `lint` предваряла ее запуск:

```javascript
gulp.task('build', ['lint', 'clean'], () => {
  // ...
});
```

- Запустите `yarn start`. Вы должны увидеть набор ошибок кода (англ. linting errors - прим. переводчика) в этом Gulp-файле и предупреждений об использовании `console.log()` в `index.js`.

One type of issue you will see is `'gulp' should be listed in the project's dependencies, not devDependencies (import/no-extraneous-dependencies)`. That's actually a false negative. ESLint cannot know which JS files are part of the build only, and which ones aren't, so we'll need to help it a little bit using comments in code. In `gulpfile.babel.js`, at the very top, add:
Один из видов ошибок будет: `'gulp' should be listed in the project's dependencies, not devDependencies (import/no-extraneous-dependencies)` ('gulp' должен подключаться в разделе `dependencies`, а не `devDependencies`). Вообще-то это неверная ошибка. 

```javascript```
/* eslint-disable import/no-extraneous-dependencies */
```

This way, ESLint won't apply the rule `import/no-extraneous-dependencies` in this file.

Now we are left with the issue `Unexpected block statement surrounding arrow body (arrow-body-style)`. That's a great one. ESLint is telling us that there is a better way to write the following code:

```javascript
() => {
  return 1;
}
```

It should be rewritten into:

```javascript
() => 1
```

Because when a function only contains a return statement, you can omit the curly braces, return statement, and semicolon in ES6.

So let's update the Gulp file accordingly:

```javascript
gulp.task('lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('clean', () => del(paths.libDir));

gulp.task('build', ['lint', 'clean'], () =>
  gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.libDir))
);
```

The last issue left is about `console.log()`. Let's say that we want this `console.log()` to be valid in `index.js` instead of triggering a warning in this example. You might have guessed it, we'll put `/* eslint-disable no-console */` at the top of our `index.js` file.

- Run `yarn start` and we are now all clear again.

**Note**: This section sets you up with ESLint in the console. It is great for catching errors at build time / before pushing, but you also probably want it integrated to your IDE. Do NOT use your IDE's native linting for ES6. Configure it so the binary it uses for linting is the one in your `node_modules` folder. This way it can use all of your project's config, the Airbnb preset, etc. Otherwise you will just get a generic ES6 linting.


Next section: [7 - Client app with Webpack](/tutorial/7-client-webpack)

Back to the [previous section](/tutorial/5-es6-modules-syntax) or the [table of contents](https://github.com/verekia/js-stack-from-scratch).
