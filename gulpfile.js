
var gulp = require('gulp')
	, del = require('del')
	, concat = require('gulp-concat')
	, uglify = require('gulp-uglify')
	, rename = require('gulp-rename')
;

gulp.task('clean', function(cb){
	del('dist', cb);
});

gulp.task('default', ['clean'], function () {
  return gulp.src([
		'lib/iife-start.js'
	    ,'lib/crypto.js'
	    ,'lib/rsa.js'
	    ,'lib/json-sans-eval.js'
	    ,'lib/jws-3.0.js'
	    ,'lib/es6-promise-2.0.0.js'
	    ,'lib/defaultHttpRequest.js'
	    ,'lib/defaultPromiseFactory.js'
	    ,'oidc-client.js'
	    ,'lib/iife-end.js'
	])
  	.pipe(concat('oidc-client.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('dist'))
  ;
});