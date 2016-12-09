/**
 * Created by Maxi- PC on 24.11.2016.
 */
var gulp = require('gulp');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var exec = require('child_process').execSync;
var ts = require('gulp-typescript');
var install = require('gulp-install');

gulp.task('compile-client', function () {
    exec('"ksn_client/node_modules/.bin/ngc" -p ksn_client/tsconfig-aot.json', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
    });
});

gulp.task('shake-client', ['compile-client'], function () {
    exec('"ksn_client/node_modules/.bin/rollup" -c ksn_client/rollup-config.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
    });
});

gulp.task('build-client', ['shake-client'], function () {
    gulp.src('ksn_client/index-aot.html').pipe(rename('index.html')).pipe(gulp.dest('ksn_dist/ksn_client'));
    gulp.src(['ksn_client/node_modules/zone.js/dist/zone.min.js',
        'ksn_client/node_modules/core-js/client/shim.min.js',
        'ksn_client/node_modules/moment/min/moment.min.js',
        'ksn_client/node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
        'ksn_client/node_modules/bootstrap-datepicker/dist/locales/bootstrap-datepicker.de.min.js',
        'ksn_client/bootstrap3.3.7/js/bootstrap.min.js',
        'ksn_client/node_modules/jquery/dist/jquery.min.js',
        'ksn_client/aot/dist/build.js']).pipe(gulp.dest('ksn_dist/ksn_client/js'));
    gulp.src(['ksn_client/node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css',
        'ksn_client/styles.css',
        'ksn_client/bootstrap3.3.7/css/bootstrap.min.css']).pipe(gulp.dest('ksn_dist/ksn_client/css'));
    gulp.src(['ksn_client/bootstrap3.3.7/fonts/*']).pipe(gulp.dest('ksn_dist/ksn_client/fonts'));
});

gulp.task('compile-server', function () {
   var tsProject =  ts.createProject('ksn_server/tsconfig.json');
   gulp.src("ksn_server/src/**/*.ts").pipe(tsProject()).js.pipe(gulp.dest("ksn_dist/ksn_server/bin"));
});

gulp.task('build-server', ['compile-server'] , function () {
   gulp.src("ksn_server/bin/www").pipe(gulp.dest("ksn_dist/ksn_server/bin"));
   gulp.src("ksn_server/package.json").pipe(gulp.dest("ksn_dist/ksn_server")).pipe(install({production : true}));
});

gulp.task('build', ['build-client', 'build-server'], function () {

});

gulp.task('clean', function () {
    gulp.src(['ksn_client/aot', 'ksn_dist'], {read: false}).pipe(clean());
});