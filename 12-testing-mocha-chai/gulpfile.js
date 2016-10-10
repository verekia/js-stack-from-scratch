/* eslint-disable import/no-extraneous-dependencies */

const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

gulp.task('build', ['lint'], () =>
  gulp.src([
    'src/**/*.js',
  ])
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);

gulp.task('lint', () =>
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

gulp.task('test', ['lint', 'build'], () =>
  gulp.src('lib/test/**/*.js')
    .pipe(mocha())
);
