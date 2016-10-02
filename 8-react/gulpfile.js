const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

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
    'gulpfile.js',
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
