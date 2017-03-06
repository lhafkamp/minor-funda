var gulp        = require('gulp');
var watch       = require('gulp-watch');
var browserSync = require('browser-sync').create();

gulp.task('default', ['watch:js', 'watch:css', 'browser-sync']);

gulp.task('watch:css', function() {
	return gulp.watch('assets/css/styles.css', ['sync:css']);
});

gulp.task('sync:css', function() {
	gulp.src('assets/css/styles.css').pipe(browserSync.stream());
})

gulp.task('watch:js', function() {
	return gulp.watch('assets/js/script.js', ['sync:js']);
});

gulp.task('sync:js', function() {
	gulp.src('assets/js/script.js').pipe(browserSync.stream());
})

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
