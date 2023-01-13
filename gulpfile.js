const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename"); //
const concat = require("gulp-concat");
const removeComments = require("gulp-strip-css-comments"); //удаление комментариев в файле стилей
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const groupCssMediaQueries = require("gulp-group-css-media-queries"); //объединять все идентичные селекторы в один
const imagemin = require("gulp-imagemin"); //сжатие картинок
const newer = require("gulp-newer"); //сжатие картинок
const sourcemaps = require("gulp-sourcemaps");
const webp = require("gulp-webp"); //конвертация картинок в webp формат
const fonter = require("gulp-fonter"); //конвертация шрифта
const ttf2woff2 = require("gulp-ttf2woff2"); //конвертация шрифта в woff2 формат
const ttf2woff = require("gulp-ttf2woff"); //конвертация шрифта в woff формат
const ttf2eot = require("gulp-ttf2eot");
const cssnano = require("gulp-cssnano"); //сжатие файла стиля
const del = require("del");
const browserSync = require("browser-sync").create(); //слежение за файлами
const pug = require("gulp-pug");
const nunjucksRender = require("gulp-nunjucks-render");
const fileInclude = require("gulp-file-include");

const srcPath = "src/"; //папка с исходниками
const distPath = "marcho/"; //название репозитория готового проекта изменить на нужное название

function browsersync() {
  browserSync.init({
    server: {
      baseDir: srcPath, //слежение за файлами в папке исходников
      // baseDir: distPath, //слежение за файлами в папке проекта
    },
    notify: false, //удаление всплывающего окна при обновлении
  });
}
function cleanStyle() {
  return src("src/css/*.css")
    .pipe(removeComments())
    .pipe(dest("src/css"));
}
function webpImg() {
  return src("src/img/**/*.*")
    .pipe(newer("src/img/**/*.*"))
    .pipe(webp())
    .pipe(dest("src/img"));
}
function images() {
  return src("src/img/**/*.*")
    .pipe(newer("src/img/**/*.*"))
    .pipe(
      imagemin([
        imagemin.gifsicle({
          interlaced: true,
        }),
        imagemin.mozjpeg({
          quality: 75,
          progressive: true,
        }),
        imagemin.optipng({
          optimizationLevel: 5,
        }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: true,
            },
            {
              cleanupIDs: false,
            },
          ],
        }),
      ])
    )
    .pipe(dest("src/img"));
}
function fonts() {
  return src("src/font/*.*")
    .pipe(newer("src/font/*.*"))
    .pipe(
      fonter({
        // subset: [66, 67, 68, 69, 70, 71],
        formats: ["woff", "ttf"], //конверт в формат woff
        // formats: ["woff", "ttf", "eot"], //конверт в формат woff и ttf
      })
    )
    .pipe(ttf2woff2())
    .pipe(dest("src/font"));
}

function scripts() {
  return src([
    "node_modules/jquery/dist/jquery.js",
    "node_modules/mixitup/dist/mixitup.js",
    "node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js",
    "node_modules/slick-carousel/slick/slick.js",
    "node_modules/rateyo/src/jquery.rateyo.js",
    "node_modules/ion-rangeslider/js/ion.rangeSlider.js",
    "node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js",
    "node_modules/paroller.js/dist/jquery.paroller.js",
    "node_modules/jquery-form-styler/dist/jquery.formstyler.js",
    "src/js/main.js",
  ])
    .pipe(sourcemaps.init())
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest("src/js"))
    .pipe(browserSync.stream());
}
function styles() {
  return (
    src("src/scss/*.scss", "arc/sass/*.sass")
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(groupCssMediaQueries())
      .pipe(dest("src/css"))
      .pipe(scss({ outputStyle: "compressed" }).on("error", scss.logError))
      .pipe(rename({ suffix: ".min" }))
      .pipe(
        autoprefixer({
          cascade: false,
          overrideBrowserslist: ["last 10 versions"],
          grid: true,
        })
      )
      .pipe(sourcemaps.write())
      // .pipe(dest(distPath + "/css"))//выгрузка файла в папку проекта
      .pipe(dest("src/css"))
      .pipe(browserSync.reload({ stream: true }))
  );
}
function html() {
  return (
    src(["src/html/*.html", "src/*.njk", "src/*.pug"])
      .pipe(sourcemaps.init())
      // .pipe(nunjucksRender()) //раскоментировать при работе с .njk
      // .pipe(pug({pretty: true})) //раскоментировать при работе с .pug
      .pipe(fileInclude({ prefix: "@", basepath: "@file" })) //раскоментировать при работе с .html
      .pipe(dest("src"))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(rename({ suffix: ".min" }))
      .pipe(sourcemaps.write())
      .pipe(dest("src"))
      .pipe(browserSync.reload({ stream: true }))
  );
}

function build() {
  return src(
    [
      "src/*.min.html",
      "src/css/*.min.css",
      "src/js/*.min.js",
      "src/video/*.*",
      "src/img/**/*.*",
      "src/fonts/*.woff",
      "src/fonts/*.woff2",
    ],
    {
      base: srcPath,
    }
  ).pipe(dest(distPath));
}
function cleanDist() {
  return del(distPath); //название репозитория готового проекта
}
function watching() {
  watch(["src/html/**/*.*"], html);
  watch(["src/scss/**/*.scss"], styles);
  watch(["src/sass/**/*.sass"], styles);
  watch(["src/js/**/*.js", "!src/js/main.min.js"], scripts);
  watch(["src/*.html"]).on("change", browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.webpImg = webpImg;
exports.images = images;
exports.cleanStyle = cleanStyle;
exports.fonts = fonts;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.html = html;


exports.build = series(cleanDist, cleanStyle, webpImg, images, build); //gulp build

exports.default = parallel(html, styles, scripts, browsersync, watching); //gulp
