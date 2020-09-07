/* eslint-disable import/no-unresolved */
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const path = require('path');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const jpegrecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
// const sourcemaps = require('gulp-sourcemaps');
// const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();

// Пути директорий
const dirBuild = 'build';
const dirApp = 'src';
const dirSource = 'assets';

const paths = {
  app: {
    html: path.join(dirApp, 'pages', '*.html'),
    style: path.join(dirApp, dirSource, 'style', 'style.scss'),
    fonts: path.join(dirApp, dirSource, 'fonts', '*.*'),
    img: path.join(dirApp, dirSource, 'img', '**/*.*'),
    js: path.join(dirApp, dirSource, 'js', '**/*.js'),
  },

  build: {
    scripts: path.join(dirBuild, 'js'),
    html: path.join(dirBuild),
    css: path.join(dirBuild, 'css'),
    fonts: path.join(dirBuild, 'fonts'),
    img: path.join(dirBuild, 'img'),
  },

  watch: {
    js: path.join(dirApp, dirSource, 'js', '**/*.js'),
    scss: path.join(dirApp, dirSource, 'style', '**/*.scss'),
    img: path.join(dirApp, dirSource, 'img', '**/*.*'),
    fonts: path.join(dirApp, dirSource, 'fonts', '**/*.*'),
    html: path.join(dirApp, 'pages', '*.html'),
  },
};
function script() {
  return gulp.src(paths.app.js).pipe(gulp.dest(paths.build.scripts));
}

function styles() {
  return gulp
    .src(paths.app.style)
    .pipe(sass())
    .pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest(paths.build.css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.build.css))
    .pipe(browserSync.reload({ stream: true }));
}

function stylesDev() {
  return gulp
    .src(paths.app.style)
    .pipe(plumber())
    .pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
    .pipe(plumber.stop())
    .pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest(paths.build.css))
    .pipe(browserSync.reload({ stream: true }));
}

function html() {
  return gulp
    .src(paths.app.html)
    .pipe(gulp.dest(paths.build.html))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts() {
  return gulp.src(paths.app.fonts).pipe(gulp.dest(paths.build.fonts));
}

async function clean() {
  return del.sync(dirBuild);
}

function images() {
  return gulp
    .src(paths.app.img)
    .pipe(
      cache(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          jpegrecompress({
            progressive: true,
            max: 90,
            min: 80,
          }),
          pngquant(),
          imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
        ])
      )
    )
    .pipe(gulp.dest(paths.build.img));
}

function server() {
  browserSync.init({
    server: {
      baseDir: 'build',
    },
    notify: false,
  });
  browserSync.watch(path.join(dirBuild, '**/*.*'), browserSync.reload);
}

function watch() {
  gulp.watch(paths.watch.js, gulp.parallel(script));
  gulp.watch(paths.watch.scss, gulp.parallel(styles));
  gulp.watch(paths.watch.html, gulp.parallel(html));
  gulp.watch(paths.watch.img, gulp.parallel(images));
}

exports.images = images;
exports.server = server;
exports.styles = styles;
exports.stylesDev = stylesDev;
exports.script = script;
exports.watch = watch;
exports.fonts = fonts;
exports.clean = clean;
exports.html = html;

gulp.task(
  'default',
  gulp.series(
    clean,
    gulp.parallel(images, script, stylesDev, fonts, html),
    gulp.parallel(server, watch)
  )
);

gulp.task('build', gulp.series(clean, gulp.parallel(fonts, script, images, styles, html)));
