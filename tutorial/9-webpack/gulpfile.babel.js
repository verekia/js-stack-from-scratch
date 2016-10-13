/* eslint-disable import/no-extraneous-dependencies */

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';

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
    'webpack.config.babel.js',
    'src/**/*.js',
    'src/**/*.jsx',
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('default', ['lint']);
