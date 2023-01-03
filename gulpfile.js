const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const groupCssMediaQueries = require("gulp-group-css-media-queries");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin-changba");
// const imagemin = require('gulp-imagemin');
const cleancss = require("gulp-clean-css");
const del = require("del");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();
const fileInclude = require("gulp-file-include");
const replace = require("gulp-replace");

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "src/",
    },
    notify: false,
  });
}

function styles() {
  return (
    src("src/scss/style.scss")
      .pipe(scss.sync({ outputStyle: "compressed" }).on("error", scss.logError))
      .pipe(scss({ outputStyle: "compressed" }))
      .pipe(cleancss({ level: 2 }))
      .pipe(concat("style.min.css"))
      .pipe(autoprefixer({
          cascade: false,
          overrideBrowserslist: ["last 10 versions"],
          grid: true,
        })
      )
      .pipe(groupCssMediaQueries())
      .pipe(dest("src/css"))
      .pipe(browserSync.stream())
  );
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
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("src/js"))
    .pipe(browserSync.stream());
}

function images() {
  return src("src/img/**/**")
    .pipe(
      imagemin()
      // [
      //   imagemin.gifsicle({ interlaced: true }),
      //   imagemin.mozjpeg({ quality: 75, progressive: true }),
      //   imagemin.optipng({ optimizationLevel: 5 }),
      //   imagemin.svgo({
      //     plugins: [
      //       { removeViewBox: true },
      //       { cleanupIDs: false }
      //     ]
      //   })
      // ]
    )
    .pipe(dest("dist/img")); //название репозитория готового проекта
}

function pugs() {
  return src("src/*.pug")
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest("src"));
}

const htmlInclude = () => {
  return src(["src/html/*.html"]) // Находит любой .html файл в папке "html", куда будем подключать другие .html файлы
    .pipe(
      fileInclude({
        prefix: "@",
        basepath: "@file",
      })
    )
    .pipe(dest("src")) // указываем, в какую папку поместить готовый файл html
    .pipe(browserSync.stream());
};

function build() {
  return src(
    [
      // 'src/**/*.html',
      "src/*.html",
      "src/pages/*.html", //
      // 'src/**/*.min.html',
      "src/*.min.html",
      "src/video/",
      "src/css/style.min.css",
      "src/fonts/*.woff",
      "src/fonts/*.woff2",
      "src/js/main.min.js",
    ],
    {
      base: "src",
    }
  ).pipe(dest("dist")); //название репозитория готового проекта
}

function cleanDist() {
  return del("dist"); //название репозитория готового проекта
}

function watching() {
  watch(["src/scss/**/*.scss"], styles);
  watch(["src/**/*.pug"], pugs);
  watch(["src/js/**/*.js", "!src/js/main.min.js"], scripts);
  watch(["src/*.html"]).on("change", browserSync.reload);
  watch(["src/pages/*.html"]).on("change", browserSync.reload); //
  watch(["src/html/**/*.html"], htmlInclude);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.htmlInclude = htmlInclude;
exports.pugs = pugs;
exports.build = series(cleanDist, images, build); //gulp build
exports.default = parallel(
  pugs,
  htmlInclude,
  styles,
  scripts,
  browsersync,
  watching
); //gulp
