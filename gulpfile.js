/*
*	Task Automation to make my life easier.
*	Author: Jean-Pierre Sierens
*	===========================================================================
*/

// declarations, dependencies
// ----------------------------------------------------------------------------
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var log = require('fancy-log');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var gulpif = require('gulp-if');

var production = process.env.NODE_ENV === 'production';

// Gulp tasks
// ----------------------------------------------------------------------------
gulp.task('scripts', function () {
    bundleApp(production);
});

gulp.task('less', function(){
    return gulp.src('./less/style.less')
        .pipe(less())
        .pipe(gulpif(production, minifyCSS({keepBreaks:true})))
        .pipe(gulp.dest('www/css'));
});

gulp.task('deploy', function (){
	bundleApp(true);
});

gulp.task('watch', function () {
	gulp.watch(['./scripts/*.js', './scripts/*/*.js'], ['scripts']);
	gulp.watch(['./less/*.less', './less/*/*.less'], ['less']);
});

// When running 'npx gulp' on the terminal this task will fire.
// It will start watching for changes in every .js file.
// If there's a change, the task 'scripts' defined above will fire.
gulp.task('default', ['scripts', 'less', 'watch']);

// When deploying, run 'npx gulp build' to fire this, one-shot.
gulp.task('build', ['deploy', 'less']);

// Private Functions
// ----------------------------------------------------------------------------
function bundleApp(isProduction) {
	// Browserify will bundle all our js files together in to one and will let
	// us use modules in the front end.
	var appBundler = browserify({
    	entries: './scripts/app.js',
    	debug: !isProduction
  	})

  	appBundler
  		// transform ES6 and JSX to ES5 with babelify
		.transform(babelify, {presets: ["es2015", "react"]})
	    .bundle()
	    .on('error', log)
	    .pipe(source('app.js'))
    	.pipe(buffer())
        .pipe(gulpif(production, uglify()))
	    .pipe(gulp.dest('./www/js/'));
}
