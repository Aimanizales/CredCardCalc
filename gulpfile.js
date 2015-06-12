'use strict';

/**
 * Credit Card Calculator
 *
 * @author Aiman Abdel <aimanizales@gmail.com>
 * @package CredCardCalc
 * @module gulpfile
 */

// Module dependencies
var gulp = require('gulp'),
    // del = require('del'),
    $ = require('gulp-load-plugins')({
          pattern: ['gulp-*', 'gulp.*'],
          scope: ['devDependencies']
        });

var pkg = require('./package.json'),
    dir = pkg.folders;

/**
 * Default task ---------------------------------------
 */
gulp.task('default', ['assets', 'watch:assets', 'css', 'watch:css', 'watch:index', 'index', 'watch:js', 'js']);

/**
 * Prod task
 */
gulp.task('prod', ['assets', 'css']);

/**
 * Index
 */
gulp.task('watch:index', function () {
  gulp.watch(dir.source + 'index.html', ['index']);
});

gulp.task('index', function () {
  gulp.src(dir.source + 'index.html')
      .pipe(gulp.dest(dir.build));
});

/**
 * JS
 */
gulp.task('watch:js', function () {
  gulp.watch(dir.source + 'js/**/*', ['js']);
});

gulp.task('js', function () {
  gulp.src(dir.source + 'js/**/*')
    .pipe(gulp.dest(dir.build + 'js/'));
});


/**
 * Assets
 */
gulp.task('watch:assets', function () {
  gulp.watch(dir.source + 'img/**/*', ['assets']);
});

gulp.task('assets', function () {
  gulp.src(dir.source + 'fonts/**/*')
    .pipe(gulp.dest(dir.build + 'fonts/'));
  gulp.src(dir.source + 'img/**/*')
    .pipe(gulp.dest(dir.build + 'img/'));
});

/**
 * Css tasks ------------------------------------------
 */
gulp.task('css', function () {
  gulp.src(dir.source + 'less/main.less')
      .pipe($.less())
      .pipe(gulp.dest(dir.build + 'css'))
      // .pipe($.cssmin())
      // .pipe($.rename({ suffix: '.min' }))
      .pipe(gulp.dest(dir.build + 'css'));
});

gulp.task('watch:css', function () {
  gulp.watch(dir.source + 'less/**/*.less', ['css']);
});
