/*
* --------------------- 
* DEPLOY
*
* Upload only new files to FTP
*
* ---------------------
*/
var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

// Create config.json with {"host":"HOSTNAME","user":"YOUR_USERNAME","password":"YOUR_PASSWORD"}
var config = require('./config.json');

gulp.task('deploy', function () {
    var conn = ftp.create({
        host:       config.host,
        user:       config.user,
        password:   config.password,
        parallel:   10,
        log:        gutil.log
    });

    // Define what to upload
    var globs = [
        'frontend/**',
        'backend/**',
        'index.php',
        'login.php'
    ];

    return gulp.src( globs, { base: '.', buffer: false})
        // Name of folder to upload to
        .pipe( conn.newer('/KLJO/AspIT-Exercise-Manager'))
        .pipe( conn.dest('/KLJO/AspIT-Exercise-Manager'))
});


/*
* --------------------- 
* TRANSPILE
*
* Converts .scss to .css
*
* ---------------------
*/
var sass = require('gulp-sass');

gulp.task('transpile', function () {
    // Define source folder for .scss files
    return gulp.src('frontend/scss/style.scss')
      .pipe(sass())
      
      // Define destination folder for .css file
      .pipe(gulp.dest('frontend/css'))
});


/*
* --------------------- 
* MINIFY
*
* Minifies .css and renames to .min.css
*
* ---------------------
*/
var minify = require('gulp-csso');
var rename = require('gulp-rename');

gulp.task('minify', function () {
    // Define source folder for .css file
    return gulp.src('frontend/css/*.css')
      .pipe(minify())
      .pipe(rename({suffix: '.min'}))
        
      // Define destination folder for .min.css  
      .pipe(gulp.dest('frontend/css'))
});