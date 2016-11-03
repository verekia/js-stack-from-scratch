/* eslint-disable import/no-extraneous-dependencies, no-console */

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import nodemon from 'gulp-nodemon';
import del from 'del';

const paths = {
  allSrcJs: 'src/**/*.js',
  allServerFiles: ['src/server/**/*.js', 'src/shared/**/*.js'],
  gulpFile: 'gulpfile.babel.js',
  libDir: 'lib',
};

gulp.task('lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('clean', () => del(paths.libDir));

gulp.task('build', ['lint', 'clean'], () =>
  gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.libDir))
);

gulp.task(`main`, [`build`], () =>
  nodemon({
    script: paths.serverLibDir,
    watch: allServerFiles,
    tasks: 'build',
  })
);

gulp.task('watch', () => {
  gulp.watch(paths.allSrcJs, ['main']);
});

gulp.task('default', ['watch', 'main']);
