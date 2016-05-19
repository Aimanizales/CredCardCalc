// Module dependencies
//   "scripts": {
//   "start": "gulp clean && gulp",
//   "build:local": "gulp clean && gulp base && gulp bundle:img",
//   "build:prod": "gulp clean && gulp base && gulp bundle",
//   "help": "gulp reference"
// 
var PATHS = require('./utils/config').paths,
    TEMPLATE_CONTEXT_DATA = require('./app/templates/utils/values'),
    TEMPLATE_HELPERS = require('./app/templates/utils/helpers'),
    ROOT_REPLACEMENT_EXP = /((?:src|url|href)\s*[=(:]\s*["']?\s*)(\/[^"'\/])/gi,
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    handlebars = require('gulp-compile-handlebars'),
    minifyCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    watchify = require('watchify');

/**
 * Resume of tasks:
 * clean: delete public folder
 * styles:sass
 * styles:css
 */

//============================= main tasks =============================
gulp.task('default', ['base', 'default:server', 'default:watch']);
// gulp.task('base',    ['base:assets', 'base:styles', 'base:scripts', 'base:templates']);
gulp.task('base',    ['base:assets', 'base:templates', 'base:styles']);
gulp.task('bundle',  ['bundle:minifyCSS', 'bundle:uglifyJS', 'bundle:img'], function () {
    gutil.log('Bundle root directory is now ' + gutil.colors.magenta.bold(getRootDir()));
});

//============================= assets =============================
gulp.task('base:assets', function () {
    gulp.src(PATHS.assets)
        .pipe(gulp.dest('./public/assets'));
});

//============================= templates =============================
gulp.task('base:templates', function () {
    var options = {
        batch: [PATHS.hbs.partials],
        helpers: TEMPLATE_HELPERS
    };

    gulp.src(PATHS.hbs.templates)
        .pipe(handlebars(TEMPLATE_CONTEXT_DATA, options))
        .pipe(rename(function (path) {path.extname = '.html';}))
        .pipe(gulp.dest('./public'))
        .pipe(browserSync.reload({stream:true}));
});


//============================= styles =============================
gulp.task('base:styles', ['styles:sass', 'styles:vendor']);

gulp.task('styles:sass', function () {
    gulp.src(PATHS.css.app)
        .pipe(sass())
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('styles:vendor', function () {
    gulp.src(PATHS.css.vendor)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./public/css'));
});


//============================= clean =============================
gulp.task('clean', function () {
    return del([
        'public'
    ]);
});

//============================= server =============================
gulp.task('default:server', function () {
    browserSync.init({
        server: {
            baseDir: "./public/"
        }
    });
});

//============================= watch =============================
gulp.task('default:watch', function () {
    //watchify(bundler)
    //    .on('update', onCodeUpdate);
    gulp.watch(PATHS.hbs.templates,         ['base:templates']);
    gulp.watch(PATHS.hbs.partials + '/**',  ['base:templates']);
    gulp.watch('app/styles/**/*.scss',      ['styles:sass']);
    gulp.watch([PATHS.assets, '!app/assets/data/**'], ['base:assets']);
});

//============================= bundle =============================
gulp.task('bundle:minifyCSS', function () {
    gulp.src('./public/css/app.css')
        .pipe(replace(ROOT_REPLACEMENT_EXP, '$1' + getRootDir() + '$2'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public/css'));
});


//============================= functions =============================
function getRootDir() {
    return PATHS.root[gutil.env.target] || PATHS.root.bundle;
}

function onCodeUpdate() {
    var updateStart = Date.now();
    gutil.log('Updating', gutil.colors.cyan("'browserify'"), '...');
    browserifyBundle();
    gutil.log('Finished', gutil.colors.cyan("'browserify'"), 'after ' + gutil.colors.magenta((Date.now() - updateStart) + 'ms'));
}

