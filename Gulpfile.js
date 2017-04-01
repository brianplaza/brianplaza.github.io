var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
})

gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
})

gulp.task('default', ['sass', 'watch']);
