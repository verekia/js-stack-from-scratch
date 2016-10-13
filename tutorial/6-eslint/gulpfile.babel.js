/* eslint-disable import/no-extraneous-dependencies */

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';

gulp.task('build', ['lint'], () =>
  gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);

gulp.task('lint', () =>
  gulp.src([
    'gulpfile.babel.js',
    'src/**/*.js',
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('default', ['build']);
