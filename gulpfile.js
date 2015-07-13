var gulp = require("gulp");
var babel = require("gulp-babel");
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
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

gulp.task('watch', function() {
    gulp.watch(['lib/**', 'test/**'], ['lint', 'test']);
});


gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
});



