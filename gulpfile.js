var gulp   = require('gulp')
  , babel  = require('gulp-babel')
  , mocha  = require('gulp-mocha')
  , eslint = require('gulp-eslint')
  , babelr = require('babel/register');

gulp.task('default', ['watch']);


/**
 * Compile es6 into es5
 */
gulp.task('build', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});


gulp.task('mocha',  function(){
  return gulp.src('test/*.js')
    .pipe(mocha({
        compilers: { js: babelr }
    }));
});

gulp.task('test', ['build', 'mocha']);

/**
 * Watch lib & test files an on change
 * lint, build and run mocha
 */
gulp.task('watch', function() {
  var tasks = ['lint', 'test'];

  gulp.start(tasks);
  gulp.watch(['src/**', 'test/**'], tasks);
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
