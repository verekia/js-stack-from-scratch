const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

gulp.task('build', ['lint'], () =>
  gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('lib'))
);

gulp.task('lint', () =>
  gulp.src([
    'gulpfile.js',
    'src/**/*.js',
    '!lib/**',
    '!node_modules/**',
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('build-client', ['lint'], () =>
  browserify({ entries: './src/client/app.js', debug: true })
    .transform(babelify)
    .bundle()
    .pipe(source('client-bundle.js'))
    .pipe(gulp.dest('dist'))
);
