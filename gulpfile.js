var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    prefixer    = require('gulp-autoprefixer'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    rigger      = require('gulp-rigger'),
    cssmin      = require('gulp-minify-css'),
    imagemin    = require('gulp-imagemin'),
    rimraf      = require('rimraf'),
    browserSync = require('browser-sync'),
    plumber     = require('gulp-plumber'),
    nunjucks    = require('gulp-nunjucks-html'),
    rename      = require('gulp-rename'),
    reload      = browserSync.reload;

var path = {
    build: { //куда мы все складываем
        html: './',
        js: 'js/',
        css: 'css/',
        img: 'img/',
        fonts: 'fonts/'
    },
    src: {//откуда все берем
        html: 'src/*.html',
        js: 'src/js/main.js',
        style: 'src/scss/style.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/main.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './img/*.*'
};

var config = {
    server: {
        baseDir: './'
    },
    tunnel: 'pex',
    host: 'localhost',
    port: 9000,
    logPrefix: 'Frontend_Devil'
};

gulp.task('html', function() {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(nunjucks({
            searchPaths: ["template"]
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js', function(){
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())//сжимаем наш js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style', function() {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass({errLogToConsole: true}))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.build.css))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image', function(){
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts', function(){
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('build', [
    'html',
    'js',
    'style',
    'fonts',
    'image'
]);

gulp.task('watch', function() {
    watch([path.watch.html], function(event, cb){
        gulp.start('html');
    });
    watch([path.watch.style], function(event, cb) {
        setTimeout(function(){gulp.start('style');}, 100)
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts');
    });
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('webserver', function() {
    browserSync(config);
});

gulp.task('default', ['build', 'webserver', 'watch']);