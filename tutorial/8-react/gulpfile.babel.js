/* eslint-disable import/no-extraneous-dependencies */

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

gulp.task('build-server', ['lint'], () =>
  gulp.src([
    'src/server/**/*.js',
    'src/shared/**/*.js',
  ])
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);

gulp.task('lint', () =>
  gulp.src([
    'gulpfile.babel.js',
    'src/**/*.js',
    'src/**/*.jsx',
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('build-client', ['lint'], () =>
  browserify({ entries: './src/client/app.jsx', debug: true })
    .transform(babelify)
    .bundle()
    .pipe(source('client-bundle.js'))
    .pipe(gulp.dest('dist'))
);
