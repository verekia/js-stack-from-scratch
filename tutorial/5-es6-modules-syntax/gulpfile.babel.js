import gulp from 'gulp';
import babel from 'gulp-babel';
import { exec } from 'child_process';

const paths = {
  allSrcJs: 'src/**/*.js',
};

gulp.task('build', () => {
  return gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('main', ['build'], (callback) => {
  exec('node lib/', (error, stdout) => {
    console.log(stdout);
    return callback(error);
  });
});

gulp.task('watch', () => {
  gulp.watch(paths.allSrcJs, ['main']);
});

gulp.task('default', ['watch', 'main']);
