/* eslint-disable import/no-extraneous-dependencies */

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';
import flow from 'gulp-flowtype';

gulp.task('build', ['typecheck', 'lint'], () =>
  gulp.src([
    'src/**/*.js',
    'src/**/*.jsx',
  ])
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);

gulp.task('lint', ['typecheck'], () =>
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

gulp.task('typecheck', () =>
  gulp.src([
    'src/**/*.js',
    'src/**/*.jsx',
  ])
    .pipe(flow())
);

gulp.task('test', ['typecheck', 'lint', 'build'], () =>
  gulp.src('lib/test/**/*.js')
    .pipe(mocha())
);
