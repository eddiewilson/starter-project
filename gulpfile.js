// Include gulp
const gulp = require('gulp'); 

// Include Our Plugins
const jslint = require('gulp-jslint');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss'); // Vertical Rhythm
const cssnano = require('gulp-cssnano');
const browserSync = require('browser-sync').create();
const marked = require('marked');
const babel = require('gulp-babel');

// Lint Task
gulp.task('lint', () => {
    return gulp.src('assets/js/*.js')
        .pipe(jslint({ /* this object represents the JSLint directives being passed down */ }))
        .pipe(jslint.reporter( 'default' ));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], () => {

    browserSync.init({
        proxy: "localhost"
    });
    gulp.watch("assets/scss/**/*.scss", ['sass']);
    gulp.watch("index.php").on('change', browserSync.reload);
});

// Compile Our Sass

gulp.task('sass', () => {
  gulp.src('./assets/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe( postcss([
    			require('autoprefixer')
    		]) 
    	)
    .pipe(cssnano())
    .pipe(gulp.dest(''))
    .pipe(browserSync.stream());
});

// Marked for Markdown
const preserveFirstComment = () => {
  var set = false;

  return () => {
     if (set) return false;
     set = true;
     return true;
  };
};

// ES6 & Concatenate & Minify JS

gulp.task('scripts', () => {
    return gulp.src('assets/js/*.js')
        .pipe(babel({
            // presets: ['es2015']
        }))
        .pipe(concat('all.js'))
        // .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify({preserveComments: preserveFirstComment()}))
        .pipe(gulp.dest('dist/'));
});

// Watch Files For Changes
gulp.task('watch', () => {
    gulp.watch('assets/js/*.js', ['lint', 'scripts']);
    gulp.watch('assets/scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch', 'serve']);