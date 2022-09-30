// Импорт пакетов
const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const size = require('gulp-size')
const newer = require('gulp-newer')
const browsersync = require('browser-sync').create()
const del = require('del')

// Пути исходных файлов src и пути к результирующим файлам dest
const paths = {
    html: {
        src: ['src/*.html'],
        dest: 'dist/'
    },
    styles: {
        src: ['src/styles/**'],
        mainsrc: ['src/styles/main.less'],
        dest: 'dist/css/'
    },
    scripts: {
        src: ['src/scripts/**'],
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img/'
    },
    fonts: {
        src: 'src/fonts/**/*',
        dest: 'dist/fonts/'
    }
}

// Очистить каталог dist, удалить все кроме изображений
function clean() {
    return del(['dist/*', '!dist/img', '!dist/fonts'])
}

// Обработка html и pug
function html() {
    return gulp.src(paths.html.src)
    .pipe(size({
        showFiles:true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream())
}

// Обработка препроцессоров стилей
function styles() {
    return gulp.src(paths.styles.mainsrc)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles:true
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browsersync.stream())
}

// Обработка Java Script, Type Script и Coffee Script
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles:true
        }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browsersync.stream())
}

// Сжатие изображений
function img() {
    return gulp.src(paths.images.src)
        .pipe(newer(paths.images.dest))
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(size({
            showFiles:true
        }))
        .pipe(gulp.dest(paths.images.dest))
}

// Перенос шрифтов
function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
}

// Отслеживание изменений в файлах и запуск лайв сервера
function watch() {
    browsersync.init({
        server: {
            baseDir: "./dist"
        }
    })
    gulp.watch(paths.html.dest).on('change', browsersync.reload)
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.fonts.src, fonts)
    gulp.watch(paths.images.src, img)
}

// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.
exports.clean = clean

exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.img = img
exports.fonts = fonts
exports.watch = watch

// Таск, который выполняется по команде gulp
exports.default = gulp.series(clean, html, gulp.parallel(styles, scripts, img, fonts), watch)
