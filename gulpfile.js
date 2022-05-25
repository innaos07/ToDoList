const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');




gulp.task("sass", function () {
    return gulp.src('./sass/**/*.scss')
    .pipe(sourcemaps.init())
   

    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'));
});

// // exports.watch = function () {
// //   gulp.watch('./sass/**/*.scss', ['sass']);
// // };

gulp.task("watch", function () {
    gulp.watch('./sass/**/*.scss', gulp.series('sass'))
});
