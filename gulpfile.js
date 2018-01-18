var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');

var config = require('./config.json');

 
gulp.task('deploy', function () {

    var conn = ftp.create({
        host:       config.host,
        user:       config.user,
        password:   config.password,
        parallel:   10,
        log:        gutil.log
    });

    var globs = [
        'frontend/**',
        'backend/**',
        'img/**'
    ];

    return gulp.src( globs, { base: '.', buffer: false})
        .pipe( conn.newer('/KLJO/AspIT-Exercise-Manager'))
        .pipe( conn.dest('/KLJO/AspIT-Exercise-Manager'))

});