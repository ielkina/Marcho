const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const sass = require("gulp-sass")(require("sass"));
const cssbeautify = require("gulp-cssbeautify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const removeComments = require("gulp-strip-css-comments");
const autoprefixer = require("gulp-autoprefixer");
const groupCssMediaQueries = require("gulp-group-css-media-queries");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const nunjucksRender = require("gulp-nunjucks-render");
const newer = require("gulp-newer");
const webp = require("gulp-webp");
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");
const cssnano = require("gulp-cssnano");
const cleanCss = require("gulp-clean-css");
const del = require("del");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();
const fileInclude = require("gulp-file-include");
const replace = require("gulp-replace");

const srcPath = "src/"; //папка с исходниками
const distPath = "marcho/"; //название репозитория готового проекта

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "src/",
    },
    notify: false,
  });
}
function cleanStyle() {
  return src("src/css/*.css")
    .pipe(removeComments())
    .pipe(cssnano())
    .pipe(dest('src/css'));
}
function webpImg() {
  return src("src/img/**/*").pipe(webp()).pipe(dest('src/img'));
}
function images() {
  return src("src/img/**/*")
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
    .pipe(
      fonter({
        formats: ["ttf", "otf", "eot", "woff", "svg"],
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
    src("src/scss/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(dest("src/css"))
      .pipe(scss({ outputStyle: "compressed" }))
      .pipe(rename({ suffix: ".min" }))
      .pipe(
        autoprefixer({
          cascade: false,
          overrideBrowserslist: ["last 10 versions"],
          grid: true,
        })
      )
      .pipe(sourcemaps.write())
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
      .pipe(fileInclude({ prefix: "@", basepath: "@file" })) //раскоментировать приработе с .html
      .pipe(sourcemaps.write())
      .pipe(dest("src"))
      .pipe(browserSync.reload({ stream: true }))
  );
}
function build() {
  return src(
    [
      "src/*.html",
      "src/css/*.css",
      "src/js/*.js",
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
  watch(["src/modules/**/*.*"], html);
  watch(["src/scss/**/*.scss"], styles);
  watch(["src/modules/**/*.scss"], styles);
  watch(["src/js/**/*.js", "!src/js/main.min.js"], scripts);
  watch(["src/modules/**/*.js", "!src/js/main.min.js"], scripts);
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
