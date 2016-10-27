/* eslint-disable import/no-extraneous-dependencies, no-console */

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import flow from 'gulp-flowtype';
import mocha from 'gulp-mocha';
import nodemon from 'gulp-nodemon';
import del from 'del';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';

const isProduction = process.env.NODE_ENV === 'production';

const CLIENT = 'client';
const SERVER = 'server';
const SHARED = 'shared';

const SRC = 'src';
const LIB = 'lib';
const PUBLIC = 'public';
const PUBLIC_JS = `${PUBLIC}/js`;
const ALL_JS_TESTS = '**/*.test.js';
const ALL_JS_OR_JSX = '**/*.js?(x)';

const paths = {
  clientSrcFiles: `${SRC}/${CLIENT}/${ALL_JS_OR_JSX}`,
  serverSrcFiles: `${SRC}/${SERVER}/${ALL_JS_OR_JSX}`,
  sharedSrcFiles: `${SRC}/${SHARED}/${ALL_JS_OR_JSX}`,

  clientLibDir: `${LIB}/${CLIENT}`,
  serverLibDir: `${LIB}/${SERVER}`,
  sharedLibDir: `${LIB}/${SHARED}`,
  clientLibTestFiles: `${LIB}/${CLIENT}/${ALL_JS_TESTS}`,
  serverLibTestFiles: `${LIB}/${SERVER}/${ALL_JS_TESTS}`,
  sharedLibTestFiles: `${LIB}/${SHARED}/${ALL_JS_TESTS}`,

  clientEntryPointFile: `${SRC}/${CLIENT}/app.jsx`,
  clientBundleFiles: `${PUBLIC_JS}/client-bundle.js?(.map)`,
  publicJsDir: PUBLIC_JS,

  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
};

const allClientFiles = [
  paths.clientSrcFiles,
  paths.sharedSrcFiles,
  paths.webpackFile,
];
const allServerFiles = [
  paths.serverSrcFiles,
  paths.sharedSrcFiles,
];
const allSharedFiles = [
  paths.sharedSrcFiles,
];


/**
 * Lint
 */

const lintTask = (type) => {
  let filesToLint;
  if (type === CLIENT) {
    filesToLint = allClientFiles;
  } else if (type === SERVER) {
    filesToLint = allServerFiles;
  } else if (type === SHARED) {
    filesToLint = allClientFiles;
  }
  filesToLint.concat(paths.gulpFile);

  return gulp.src(filesToLint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(flow({ abort: true }));
};

[CLIENT, SERVER, SHARED].forEach((type) => {
  gulp.task(`lint:${type}`, () => lintTask(type));
});


/**
 * Clean
 */

const cleanTask = (type) => {
  let filesToDelete;
  if (type === CLIENT) {
    filesToDelete = [paths.clientLibDir, paths.clientBundleFiles];
  } else if (type === SERVER) {
    filesToDelete = paths.serverLibDir;
  } else if (type === SHARED) {
    filesToDelete = paths.sharedLibDir;
  }
  return del(filesToDelete);
};

[CLIENT, SERVER, SHARED].forEach((type) => {
  gulp.task(`clean:${type}`, () => cleanTask(type));
});


/**
 * Build
 */

const buildTask = (type) => {
  let srcFiles;
  let destDir;
  if (type === CLIENT) {
    srcFiles = paths.clientSrcFiles;
    destDir = paths.clientLibDir;
  } else if (type === SERVER) {
    srcFiles = paths.serverSrcFiles;
    destDir = paths.serverLibDir;
  } else if (type === SHARED) {
    srcFiles = paths.sharedSrcFiles;
    destDir = paths.sharedLibDir;
  }
  return gulp.src(srcFiles)
    .pipe(babel())
    .pipe(gulp.dest(destDir));
};

[CLIENT, SERVER, SHARED].forEach((type) => {
  gulp.task(`build:${type}`, [`lint:${type}`, `clean:${type}`], () => buildTask(type));
});


/**
 * Test
 */

const testTask = (type) => {
  let testFiles;
  if (type === CLIENT) {
    testFiles = [paths.clientLibTestFiles, paths.sharedLibTestFiles];
  } else if (type === SERVER) {
    testFiles = [paths.serverLibTestFiles, paths.sharedLibTestFiles];
  } else if (type === SHARED) {
    testFiles = [
      paths.clientLibTestFiles,
      paths.serverLibTestFiles,
      paths.sharedLibTestFiles,
    ];
  }
  return gulp.src(testFiles).pipe(mocha());
};

gulp.task(`test:${CLIENT}`, [
  `build:${CLIENT}`,
  `build:${SHARED}`,
], () => testTask(CLIENT));

gulp.task(`test:${SERVER}`, [
  `build:${SERVER}`,
  `build:${SHARED}`,
], () => testTask(SERVER));

gulp.task(`test:${SHARED}`, [
  `build:${CLIENT}`,
  `build:${SERVER}`,
  `build:${SHARED}`,
], () => testTask(SHARED));

gulp.task('test', [`test:${CLIENT}`, `test:${SERVER}`, `test:${SHARED}`]);

/**
 * Main
 */

gulp.task('main:client', ['test:client'], () =>
  gulp.src(paths.clientEntryPointFile)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.publicJsDir))
);

gulp.task('main:server', [`test:${SERVER}`], () =>
  nodemon({
    script: paths.serverLibDir,
    watch: allServerFiles,
    task: `test:${SERVER}`,
  })
);


/**
 * Watchers
 */

gulp.task('watch', () => {
  gulp.watch(allClientFiles, [`main:${CLIENT}`]);
  gulp.watch(allSharedFiles, [`test:${SHARED}`]);
});

gulp.task('env-check:development', () => {
  if (isProduction) {
    console.error('You are running a development task but NODE_ENV is set to `production`');
    process.exit(1);
  }
});

gulp.task('development:one-build', [
  'env-check:development',
  `main:${CLIENT}`,
  `test:${SERVER}`,
  `test:${SHARED}`,
]);

gulp.task('development:watch-server', [
  'env-check:development',
  `main:${CLIENT}`,
  `main:${SERVER}`,
  `test:${SHARED}`,
]);

/**
 * Production
 */

gulp.task('env-check:production', () => {
  if (!isProduction) {
    console.error('You must set your NODE_ENV variable to `production`');
    process.exit(1);
  }
});

gulp.task('production', [
  'env-check:production',
  `main:${CLIENT}`,
  `test:${SERVER}`,
  `test:${SHARED}`,
]);


/**
 * Default `gulp` task triggered by `yarn start`
 */

gulp.task('default', ['development:watch-server', 'watch']);
