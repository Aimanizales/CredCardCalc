// Module dependencies
//   "scripts": {
//   "start": "gulp clean && gulp",
//   "build:local": "gulp clean && gulp base && gulp bundle:img",
//   "build:prod": "gulp clean && gulp base && gulp bundle",
//   "help": "gulp reference"
// 
var PATHS = require('./utils/config').paths,
    gulp = require('gulp'),
    less = require('gulp-less'),
    sync = require('browser-sync').create(),
    watchify = require('watchify');


// default & base:
gulp.task('base',     ['base:assets', 'base:styles',    'base:scripts', 'base:templates']);
// gulp.task('default',  ['base',        'default:server', 'default:watch']);
gulp.task('default',  ['default:server', 'default:watch']);

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

// - server
gulp.task('default:server', function () {
    sync.init({
        server: {
            baseDir: "./public/"
        }
    });
});

//  - watch for me, while I'm gone...
gulp.task('default:watch', function () {
    watchify(bundler)
        .on('update', onCodeUpdate);
    gulp.watch(PATHS.hbs.templates, ['base:templates']);
    gulp.watch(PATHS.hbs.partials + '/**', ['base:templates']);
    gulp.watch('app/styles/**/*.less', ['styles:less']);
    gulp.watch([PATHS.assets, '!app/assets/data/**'], ['base:assets']);
});
