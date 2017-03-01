/* eslint-disable import/no-extraneous-dependencies, no-console */

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import flow from 'gulp-flowtype';
import mocha from 'gulp-mocha';
import nodemon from 'gulp-nodemon';
import del from 'del';
import runSequence from 'run-sequence';
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
const ALL_JS_OR_JSX = '**/*.js?(x)';
const ALL_JS_OR_JSX_TESTS = '**/*.test.js?(x)';

const paths = {
  clientSrcFiles: `${SRC}/${CLIENT}/${ALL_JS_OR_JSX}`,
  serverSrcFiles: `${SRC}/${SERVER}/${ALL_JS_OR_JSX}`,
  sharedSrcFiles: `${SRC}/${SHARED}/${ALL_JS_OR_JSX}`,
  clientSrcTestFiles: `${SRC}/${CLIENT}/${ALL_JS_OR_JSX_TESTS}`,
  serverSrcTestFiles: `${SRC}/${SERVER}/${ALL_JS_OR_JSX_TESTS}`,
  sharedSrcTestFiles: `${SRC}/${SHARED}/${ALL_JS_OR_JSX_TESTS}`,

  clientLibDir: `${LIB}/${CLIENT}`,
  serverLibDir: `${LIB}/${SERVER}`,
  sharedLibDir: `${LIB}/${SHARED}`,

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
 * Clean
 */

gulp.task(`clean:${CLIENT}`, () => del([paths.clientLibDir, paths.clientBundleFiles]));
gulp.task(`clean:${SERVER}`, () => del(paths.serverLibDir));
gulp.task(`clean:${SHARED}`, () => del(paths.sharedLibDir));

gulp.task('clean', (callback) => {
  runSequence(`clean:${CLIENT}`, `clean:${SERVER}`, `clean:${SHARED}`, callback);
});


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

gulp.task('lint', (callback) => {
  runSequence(`lint:${CLIENT}`, `lint:${SERVER}`, `lint:${SHARED}`, callback);
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
  gulp.task(`build:${type}`, () => buildTask(type));
});

gulp.task('build', (callback) => {
  runSequence(`build:${CLIENT}`, `build:${SERVER}`, `build:${SHARED}`, callback);
});


/**
 * Test
 */

const testTask = (type) => {
  let testFiles;
  if (type === CLIENT) {
    testFiles = [paths.clientSrcTestFiles, paths.sharedSrcTestFiles];
  } else if (type === SERVER) {
    testFiles = [paths.serverSrcTestFiles, paths.sharedSrcTestFiles];
  } else if (type === SHARED) {
    testFiles = [
      paths.clientSrcTestFiles,
      paths.serverSrcTestFiles,
      paths.sharedSrcTestFiles,
    ];
  }
  return gulp.src(testFiles).pipe(mocha());
};

[CLIENT, SERVER, SHARED].forEach((type) => {
  gulp.task(`test:${type}`, () => testTask(type));
});

gulp.task('test', (callback) => {
  runSequence(`test:${CLIENT}`, `test:${SERVER}`, `test:${SHARED}`, callback);
});

/**
 * Main
 */

gulp.task(`main:${CLIENT}`, () =>
  gulp.src(paths.clientEntryPointFile)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.publicJsDir))
);

gulp.task(`main:${SERVER}`, [`full-sequence:${SERVER}`], () =>
  nodemon({
    script: paths.serverLibDir,
    watch: allServerFiles,
    tasks: `full-sequence:${SERVER}`,
  })
);


/**
 * Sequences
 */

gulp.task(`full-sequence:${CLIENT}`, (callback) => {
  runSequence(`clean:${CLIENT}`, `lint:${CLIENT}`, `test:${CLIENT}`,
    `build:${CLIENT}`, `main:${CLIENT}`, callback);
});

gulp.task(`full-sequence:${SERVER}`, (callback) => {
  runSequence(`clean:${SERVER}`, `lint:${SERVER}`, `test:${SERVER}`,
    `build:${SERVER}`, callback);
});

gulp.task(`full-sequence:${SHARED}`, (callback) => {
  runSequence(`clean:${SHARED}`, `lint:${SHARED}`, `test:${SHARED}`,
    `build:${SHARED}`, callback);
});

gulp.task('full-sequence', (callback) => {
  runSequence('clean', 'lint', 'test', 'build', callback);
});

/**
 * Watchers
 */

gulp.task('watch', () => {
  gulp.watch(allClientFiles, [`full-sequence:${CLIENT}`]);
  gulp.watch(allSharedFiles, [`full-sequence:${SHARED}`]);
});

gulp.task('env-check:development', () => {
  if (isProduction) {
    console.error('You are running a development task but NODE_ENV is set to `production`');
    process.exit(1);
  }
});

gulp.task('development:one-build', (callback) => {
  runSequence('env-check:development', 'full-sequence', callback);
});

gulp.task('development:watch-server', (callback) => {
  runSequence(
    'env-check:development',
    `full-sequence:${CLIENT}`,
    `full-sequence:${SHARED}`,
    `main:${SERVER}`,
    callback
  );
});

/**
 * Production
 */

gulp.task('env-check:production', () => {
  if (!isProduction) {
    console.error('You must set your NODE_ENV variable to `production`');
    process.exit(1);
  }
});

gulp.task('production', (callback) => {
  runSequence('env-check:production', 'full-sequence', callback);
});


/**
 * Default `gulp` task triggered by `yarn start`
 */

gulp.task('default', (callback) => {
  runSequence('development:watch-server', 'watch', callback);
});
