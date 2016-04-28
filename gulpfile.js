/*jshint strict:false */
var concat = require('gulp-concat');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');


gulp.task('lint', function() {
    gulp.src(['src/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
gulp.task('test', ['lint']);
gulp.task('scripts-libs', function() {
    gulp.src([
        'node_modules/osmtogeojson/osmtogeojson.js',
        'node_modules/angular/angular.min.js',
        'node_modules/angular-base64/angular-base64.min.js',
        'node_modules/ngstorage/ngStorage.min.js'
    ])
        .pipe(concat('dependencies.js'))
        .pipe(gulp.dest('dist'));
});
gulp.task('scripts', ['scripts-libs'], function() {
    gulp.src(['src/*.js'])
        .pipe(concat('osm.js'))
        .pipe(gulp.dest('dist'));
});
gulp.task('default', ['scripts']);
gulp.task('watch', function () {
    watch('src/*.js', () => gulp.start('scripts'));
});
