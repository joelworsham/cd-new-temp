'use strict';

var gulp = require('gulp');
var fs = require('fs');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var reactify = require('reactify');

gulp.task('sass', function () {
    return gulp.src('./assets/src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename({
            dirname: '',
            suffix: '.min'
        }))
        .pipe(gulp.dest('./assets/dist/css'))
        .pipe(notify({message: 'SASS complete'}));
});

gulp.task('customize_sass', function () {
    return gulp.src('./assets/src/scss/customize/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename({
            dirname: '',
            suffix: '.min'
        }))
        .pipe(gulp.dest('./assets/dist/css'))
        .pipe(notify({message: 'SASS Customize complete'}));
});

gulp.task('customize_inpreview_sass', function () {
    return gulp.src('./assets/src/scss/customize-inpreview/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename({
            dirname: '',
            suffix: '.min'
        }))
        .pipe(gulp.dest('./assets/dist/css'))
        .pipe(notify({message: 'SASS Customize Inpreview complete'}));
});

gulp.task('scripts', function () {
    return gulp.src('./assets/src/js/*.js')
        .pipe(concat('clientdash.min.js'))
        .pipe(gulp.dest('./assets/dist/js/'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('./assets/dist/js/'))
        .pipe(notify({message: 'JS complete'}));
});

gulp.task('customize_inpreview_js', function () {
    return gulp.src('./assets/src/js/customize-inpreview.js')
        .pipe(concat('clientdash-inpreview.min.js'))
        .pipe(gulp.dest('./assets/dist/js/'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('./assets/dist/js/'))
        .pipe(notify({message: 'JS Customize inpreview complete'}));
});

gulp.task('customize_js', function () {
    return browserify({
        entries: './assets/src/js/customize/customize.js',
        debug: true
    })
        .transform(babelify, {presets: ["es2015", "react"]})
        .bundle()
        .pipe(source('clientdash-customize.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./assets/dist/js/'))
        .pipe(notify({message: 'JS Customize complete'}));
});

gulp.task('default', ['sass', 'scripts', 'customize_sass', 'customize_inpreview_sass', 'customize_inpreview_js', 'customize_js'], function () {
    gulp.watch(['./assets/src/scss/*.scss'], ['sass']);
    gulp.watch(['./assets/src/scss/customize/*.scss'], ['customize_sass']);
    gulp.watch(['./assets/src/scss/customize-inpreview/*.scss'], ['customize_inpreview_sass']);
    gulp.watch(['./assets/src/js/*.js'], ['scripts']);
    gulp.watch(['./assets/src/js/customize/*.js'], ['customize_js']);
    gulp.watch(['./assets/src/js/customize/customize-inpreview.js'], ['customize_inpreview_js']);
});
//
//gulp.task('build', ['version', 'generate_pot']);
