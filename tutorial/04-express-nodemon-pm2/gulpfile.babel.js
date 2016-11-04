/* eslint-disable import/no-extraneous-dependencies, no-console */

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import nodemon from 'gulp-nodemon';
import runSequence from 'run-sequence';
import del from 'del';

const ALL_JS_FILES = '**/*.js';

const paths = {
  serverSrcFiles: `src/server/${ALL_JS_FILES}`,
  sharedSrcFiles: `src/shared/${ALL_JS_FILES}`,
  gulpFile: 'gulpfile.babel.js',
  libDir: 'lib',
};

paths.allServerSrcFiles = [paths.serverSrcFiles, paths.sharedSrcFiles];
paths.serverLibDir = `${paths.libDir}/server`;


gulp.task('lint:server', () =>
  gulp.src(paths.allServerSrcFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('clean:server', () =>
  del.sync(paths.serverLibDir)
);

gulp.task('build:server', () =>
  gulp.src(paths.allServerSrcFiles)
  .pipe(babel())
  .pipe(gulp.dest(paths.serverLibDir))
);

gulp.task('sequence:build:server', callback =>
  runSequence('lint:server', 'clean:server', 'build:server', callback)
);

gulp.task('main:server', ['sequence:build:server'], () =>
  nodemon({
    script: paths.serverLibDir,
    watch: paths.allServerSrcFiles,
    tasks: 'sequence:build:server',
  })
);

gulp.task('default', ['main:server']);
