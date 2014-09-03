/*jshint strict:false */
var concat = require('gulp-concat');
var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  gulp.src(['src/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
gulp.task('test', ['lint']);
gulp.task('scripts-libs', function() {
  gulp.src([
      'bower_components/osmtogeojson/osmtogeojson.js',
      'bower_components/angular/angular.min.js',
      'bower_components/angular-base64/angular-base64.min.js',
      'bower_components/ngstorage/ngStorage.min.js'
    ])
    .pipe(concat('dependencies.js'))
    .pipe(gulp.dest('dist'));
});
gulp.task('scripts', ['scripts-libs'], function() {
  gulp.src(['src/*.js'])
    .pipe(concat("osm.js"))
    .pipe(gulp.dest('dist'));
});
gulp.task('default', ['scripts']);
gulp.task('watch', function () {
  gulp.watch('src/*.js', ['scripts', 'lint']);
});
