// Module dependencies
//   "scripts": {
//   "start": "gulp clean && gulp",
//   "build:local": "gulp clean && gulp base && gulp bundle:img",
//   "build:prod": "gulp clean && gulp base && gulp bundle",
//   "help": "gulp reference"
// 
var gulp = require('gulp');


// default & base:
gulp.task('base',     ['base:assets', 'base:styles',    'base:scripts', 'base:templates']);
gulp.task('default',  ['base',        'default:server', 'default:watch']);

// base tasks:
gulp.task('base:assets', function () {
    gulp.src(PATHS.assets)
        .pipe(gulp.dest('public'));
});
gulp.task('base:styles', ['styles:css', 'styles:less']);


// styles:
gulp.task('styles:less', function () {
    gulp.src(PATHS.css.app)
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./public/css'))
        .pipe(sync.reload({stream: true}
    ));
});

gulp.task('styles:css', function () {
    gulp.src(PATHS.css.vendor)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./public/css'));
});


// clean build files
gulp.task('clean', function () {
    return del([
        'public'
    ]);
});


