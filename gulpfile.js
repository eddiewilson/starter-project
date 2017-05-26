// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jslint = require('gulp-jslint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var postcss = require('gulp-postcss'); // Vertical Rhythm
var cssnano = require('gulp-cssnano');
var browserSync = require('browser-sync').create();
var marked = require('marked');
// var babel = require('gulp-babel');
var svgSprite = require('gulp-svg-sprite');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('assets/js/*.js')
        .pipe(jslint({ /* this object represents the JSLint directives being passed down */ }))
        .pipe(jslint.reporter( 'default' ));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        proxy: "localhost"
    });
    gulp.watch("assets/scss/**/*.scss", ['sass']);
    gulp.watch("index.php").on('change', browserSync.reload);
});

// Compile Our Sass

gulp.task('sass', function() {
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
const preserveFirstComment = function() {
  var set = false;

  return function() {
     if (set) return false;
     set = true;
     return true;
  };
};

// SVG Sprite
var svgConfig = {
    shape : {
        // dimension : { // Set maximum dimensions
        //     maxWidth : 32,
        //     maxHeight : 32
        // },
        dest : 'intermediate' // Keep the intermediate files
    },
    mode : {
        bust : true,
        sprite : "sprite.<mode>.svg",
        symbol : true
    },
    svg : {
	    doctypeDeclaration : false,
	    xmlDeclaration : false
    }
};
gulp.task('svg', function() {
    gulp.src('assets/img/icons/*.svg')
    .pipe(svgSprite(svgConfig))
    .pipe(gulp.dest('dist/img/icons'));
});

// ES6 & Concatenate & Minify JS

gulp.task('scripts', function() {
    return gulp.src('assets/js/*.js')
        // .pipe(babel({
        //     // presets: ['es2015']
        // }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('assets/js/*.js', ['lint', 'scripts']);
    gulp.watch('assets/scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'svg', 'watch', 'serve']);