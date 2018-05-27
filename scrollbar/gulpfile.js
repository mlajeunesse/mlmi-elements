/*
*	NODE MODULES
*/
var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync').create();

/*
*	SERVE
*/
gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: './'
		},
		notify: false,
		browser: 'google chrome',
		open: true
	})
})

/*
*	SASS
*/
gulp.task('sass', function() {
	gulp.src(['src/scss/scrollbar.scss'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'uncompressed' }))
		.pipe(gulp.dest('dist/css'))
		.pipe(autoprefixer({ browsers: ['last 2 versions'] }))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename({ extname: '.min.css' }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({
      		stream: true
    	}))
});

/*
*	JS
*/
gulp.task('js', function()
{
	gulp.src(['src/js/scrollbar.js'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(gulp.dest('dist/js'))
		.pipe(rename({ extname: '.min.js' }))
		.pipe(uglify())
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest('dist/js'));
});

/*
*	WATCH
*/
gulp.task('watch', function() {
	gulp.watch(['src/scss/**/*.scss'], ['sass']);
	gulp.watch(['src/js/**/*.js'], ['js']);
	gulp.watch(['*.html', 'dist/js/*.js']).on('change', browserSync.reload);
});

/*
*	CLEAN
*/
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

/*
*	RUN
*/
gulp.task('default', ['build', 'watch', 'serve']);
gulp.task('build', ['js', 'sass']);
