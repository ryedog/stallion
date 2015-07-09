var gulp = require("gulp");
var babel = require("gulp-babel");
var mocha = require('gulp-mocha');

gulp.task("default", function () {
  return gulp.src("lib/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

gulp.task('mocha',  function(){
  return gulp.src("test/*.js")
    .pipe(mocha());
});

gulp.task("test", ['default', 'mocha']);