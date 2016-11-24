/**
 * Created by Maxi- PC on 24.11.2016.
 */
var gulp = require('gulp');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var shell = require('gulp-shell');
var exec = require('child_process').execSync;

gulp.task('compile', function () {
    exec('"node_modules/.bin/ngc" -p tsconfig-aot.json', function (err, stdout, stderr) {
        // console.log(stdout);
        console.log(stderr);
        console.log(err);
    });
});

gulp.task('shake', ['compile'], function () {
    exec('"node_modules/.bin/rollup" -c rollup-config.js', function (err, stdout, stderr) {
        // console.log(stdout);
        console.log(stderr);
        console.log(err);
    });
});

gulp.task('build', ['shake'], function () {
    gulp.src('index-aot.html').pipe(rename('index.html')).pipe(gulp.dest('dist'));
    gulp.src(['node_modules/zone.js/dist/zone.min.js',
        'node_modules/core-js/client/shim.min.js',
        'node_modules/moment/min/moment.min.js',
        'node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
        'node_modules/bootstrap-datepicker/dist/locales/bootstrap-datepicker.de.min.js',
        'bootstrap3.3.7/js/bootstrap.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'aot/dist/build.js']).pipe(gulp.dest('dist/js'));
    gulp.src(['node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css',
        'styles.css',
        'bootstrap3.3.7/css/bootstrap.min.css']).pipe(gulp.dest('dist/css'));
    gulp.src(['bootstrap3.3.7/fonts/*']).pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', function () {
    gulp.src(['aot', 'dist'], {read: false}).pipe(clean());
});