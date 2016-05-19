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
    sync = require('browser-sync').create(),
    watchify = require('watchify');

/**
 * Resume of tasks:
 * clean: delete public folder
 * styles:sass
 * styles:css
 */

// default & base:
gulp.task('base',     ['base:assets', 'base:styles', 'base:scripts', 'base:templates']);
// gulp.task('default',  ['base',        'default:server', 'default:watch']);
gulp.task('default',  ['default:server', 'default:watch']);

gulp.task('bundle', ['bundle:minifyCSS', 'bundle:uglifyJS', 'bundle:img'], function () {
    gutil.log('Bundle root directory is now ' + gutil.colors.magenta.bold(getRootDir()));
});

// base tasks:
gulp.task('base:assets', function () {
    gulp.src(PATHS.assets)
        .pipe(gulp.dest('public'));
});

gulp.task('base:templates', function () {
    var options = {
        batch: [PATHS.hbs.partials],
        helpers: TEMPLATE_HELPERS
    };

    gulp.src(PATHS.hbs.templates)
        .pipe(handlebars(TEMPLATE_CONTEXT_DATA, options))
        .pipe(rename(function (path) {path.extname = '.html';}))
        .pipe(gulp.dest('./public'));
        //.pipe(sync.reload({stream: true}));
});

gulp.task('base:styles', ['styles:sass', 'styles:vendor']);

// styles:
gulp.task('styles:sass', function () {
    gulp.src(PATHS.css.app)
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
        //.pipe(sync.reload({stream: true}));
});

gulp.task('styles:vendor', function () {
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
    //watchify(bundler)
    //    .on('update', onCodeUpdate);
    gulp.watch(PATHS.hbs.templates, ['base:templates']);
    gulp.watch(PATHS.hbs.partials + '/**', ['base:templates']);
    gulp.watch('app/styles/**/*.less', ['styles:less']);
    gulp.watch([PATHS.assets, '!app/assets/data/**'], ['base:assets']);
});

function onCodeUpdate() {
    var updateStart = Date.now();

    gutil.log('Updating', gutil.colors.cyan("'browserify'"), '...');
    browserifyBundle();
    gutil.log('Finished', gutil.colors.cyan("'browserify'"), 'after ' + gutil.colors.magenta((Date.now() - updateStart) + 'ms'));
}

//--------------------------BUNDLE--------------------------

gulp.task('bundle:minifyCSS', function () {
    gulp.src('./public/css/app.css')
        .pipe(replace(ROOT_REPLACEMENT_EXP, '$1' + getRootDir() + '$2'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public/css'));
});


//--------------------------FUNCTIONS--------------------------
function getRootDir() {
    return PATHS.root[gutil.env.target] || PATHS.root.bundle;
}

