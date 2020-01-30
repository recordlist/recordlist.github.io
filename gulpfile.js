// Load plugins
const browsersync = require("browser-sync").create();
const gulp = require("gulp");
const gulp_uglify = require("gulp-uglify");
var concat = require('gulp-concat');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function(cb) {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

  // modernizr + respond
  gulp.src([
    './node_modules/modernizr/dist/modernizr-3.8.0.min.js',
    './node_modules/respond.js/dest/respond.min.js'
  ])
  .pipe(concat('modernizr-3.8.0-respond-1.4.2.min.js'))
  .pipe(gulp.dest('./vendor/modernizr'))

  cb();

});

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    }
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Watch files
function watchFiles() {
  gulp.watch("./css/*", browserSyncReload);
  gulp.watch("./**/*.html", browserSyncReload);
}

gulp.task("default", gulp.parallel('vendor'));

// dev task
gulp.task("dev", gulp.parallel(watchFiles, browserSync));
