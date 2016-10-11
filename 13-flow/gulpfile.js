/* eslint-disable import/no-extraneous-dependencies */

const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const flow = require('gulp-flowtype');

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
    'gulpfile.js',
    'webpack.config.js',
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
