# CredCardCalc

## Pending tasks: 
1. --Update package.json.--
2. Update gulpfile.js.
3. Run scripts, check each task and see how public folder changes for each case.
4. Modify the less file.

```javascript
//  vars
var gulp = require('gulp'),
    del = require('del'),
    sync = require('browser-sync').create(),
    taskListing = require('gulp-task-listing'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS = require('gulp-minify-css'),
    browserify = require('browserify'),
    gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    gutil = require('gulp-util'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    less = require('gulp-less'),
    handlebars = require('gulp-compile-handlebars'),
    bundle = false,
    bundler = browserify({
        entries: ['./app/scripts/index.js'],
        debug: true, // Gives us sourcemapping
        cache: {},
        packageCache: {},
        fullPaths: true // Requirement of watchify
    });


//  helper functions
//  - watchify util functions
function browserifyBundle() {
    var updateStart = Date.now(),
        bundlerResult = bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('app.js'))
        .pipe(gulp.dest('./public/js'))
        .pipe(sync.reload({
            stream: true
        }));

    return bundlerResult;
}

function onCodeUpdate() {
    var updateStart = Date.now();

    gutil.log('Updating', gutil.colors.cyan("'browserify'"), '...');
    browserifyBundle();
    gutil.log('Finished', gutil.colors.cyan("'browserify'"), 'after ' + gutil.colors.magenta((Date.now() - updateStart) + 'ms'));
}


function getRootDir() {
    return PATHS.root[gutil.env.target] || PATHS.root.bundle;
}

// base  help task
gulp.task('reference', taskListing);

//  - scripts
gulp.task('scripts:browserify', browserifyBundle);

// task to concatenate vendor minified scripts
gulp.task('scripts:js', function () {
    gulp.src(PATHS.js.vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('base:scripts', ['scripts:browserify']);

// image optimization
gulp.task('bundle:img', function () {
    return gulp.src('./public/img/**')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./public/img'));
});

//  - bundle ops
gulp.task('bundle:uglifyJS', function () {
    gulp.src('./public/js/app.js')
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./public/js/'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('bundle:minifyCSS', function () {
    gulp.src('./public/css/app.css')
        .pipe(replace(ROOT_REPLACEMENT_EXP, '$1' + getRootDir() + '$2'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('bundle', ['bundle:minifyCSS', 'bundle:uglifyJS', 'bundle:img'], function () {
    gutil.log('Bundle root directory is now ' + gutil.colors.magenta.bold(getRootDir()));
});

```


## References
[abduzeedo ui design analytics](http://abduzeedo.com/ui-design-analytics)
