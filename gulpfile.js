'use strict';

var gulp = require('gulp');
var fs = require('fs');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var webpack = require('gulp-webpack');

gulp.task('sass', function () {
    return gulp.src('./assets/src/scss/**/*.scss')
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

gulp.task('customize_js', function () {
    return gulp.src('./assets/src/js/customize/customize.js')
        .pipe(notify({message: 'Customize JS starting...'}))
        .pipe(webpack({
            resolve: {
                moduleDirectories: ['./node_modules']
            },
            module: {
                loaders: [
                    {
                        test: /.jsx?$/,
                        loader: 'babel-loader',
                        exclude: '/node_modules/',
                        query: {
                            presets: ['es2015', 'react']
                        }
                    }
                ]
            },
            output: {
                filename: 'clientdash.customize.min.js'
            },
            devtool: 'source-map'
        }))
        //.pipe(sourcemaps.init())
        //.pipe(uglify())
        //.pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('./assets/dist/js/'))
        .pipe(notify({message: 'Customize JS complete'}));
});

//gulp.task('customize_babel', function() {
//
//    return browserify("./assets/src/js/customize/customize.js")
//        .transform("babelify", {presets: ["es2015", "react"], NODE_ENV: 'production' })
//        .bundle()
//        .pipe(fs.createWriteStream("./assets/dist/js/clientdash.customize.min.js"));
//
//});
//
//gulp.task('customize_uglify', ['customize_babel'], function () {
//
//    return gulp.src('./assets/dist/js/clientdash.customize.min.js')
//        .pipe(gulp.dest('./assets/dist/js/'))
//        .pipe(gulp.dest('./assets/dist/js/'))
//        .pipe(notify({message: 'Customize JS complete'}));
//});

//gulp.task('version', function () {
//    return gulp.src(['**/*.{php,js,scss,txt}', '!node_modules/'], {base: './'})
//        .pipe($.justReplace([
//            {
//                search: /\{\{VERSION}}/g,
//                replacement: package.version
//            },
//            {
//                search: /(\* Version: )\d\.\d\.\d/,
//                replacement: "$1" + package.version
//            }, {
//                search: /(define\( 'CLIENTDASH_VERSION', ')\d\.\d\.\d/,
//                replacement: "$1" + package.version
//            }, {
//                search: /(Stable tag: )\d\.\d\.\d/,
//                replacement: "$1" + package.version
//            }
//        ]))
//        .pipe(gulp.dest('./'));
//});
//
//gulp.task('generate_pot', function () {
//    return gulp.src('./**/*.php')
//        .pipe($.sort())
//        .pipe($.wpPot({
//            domain: 'clientdash',
//            destFile: 'clientdash.pot',
//            package: 'ClientDash',
//        }))
//        .pipe(gulp.dest('./languages/'));
//});
//
gulp.task('default', ['sass', 'scripts', 'customize_js'], function () {
    gulp.watch(['./assets/src/scss/**/*.scss'], ['sass']);
    gulp.watch(['./assets/src/js/*.js'], ['scripts']);
    gulp.watch(['./assets/src/js/customize/*.js'], ['customize_js']);
});
//
//gulp.task('build', ['version', 'generate_pot']);
