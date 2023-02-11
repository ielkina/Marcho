const { src, dest, watch, parallel, series } = require("gulp");
// ----------------------------------------------------------
const scss = require("gulp-sass")(require("sass"));
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename"); //
const concat = require("gulp-concat");
const size = require("gulp-size");
const csso = require("gulp-csso");
const removeComments = require("gulp-strip-css-comments"); //удаление комментариев в файле стилей
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const groupCssMediaQueries = require("gulp-group-css-media-queries"); //объединять все идентичные селекторы в один
const imagemin = require("gulp-imagemin"); //сжатие картинок
const newer = require("gulp-newer"); //сжатие картинок
const cleanCss = require("gulp-clean-css");
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
const svgSprite = require("gulp-svg-sprite");
// -----------------------------------------------------------
const srcPath = "src/"; //папка с исходниками
const distPath = "SimpleFood/"; //название репозитория готового проекта изменить на нужное название

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
  return src("src/css/*.css").pipe(removeComments()).pipe(dest("src/css"));
}

function images() {
  return src("src/img/**/*.*")
    .pipe(newer("src/img/**/*.*"))
    .pipe(
      size({
        title: "jpg, png, svg до",
      })
    )
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
    .pipe(
      size({
        title: "jpg, png, svg",
      })
    )
    .pipe(dest(distPath + "img/"))
    .pipe(
      size({
        title: "webp до",
      })
    )
    .pipe(webp())
    .pipe(
      size({
        title: "webp",
      })
    )
    .pipe(dest(distPath + "img/"));
}

function fonts() {
  return src("src/fonts/*.*")
    .pipe(newer("src/fonts/*.*"))
    .pipe(
      fonter({
        // subset: [66, 67, 68, 69, 70, 71],
        formats: ["woff", "ttf"], //конверт в формат woff
        // formats: ["woff", "ttf", "eot"], //конверт в формат woff и ttf
      })
    )
    .pipe(ttf2woff2())
    .pipe(dest("src/fonts"));
}

function svgSprites() {
  return src("src/img/svg/*.svg") // выбираем в папке с иконками все файлы с расширением svg
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "./sprite.svg", // указываем имя файла спрайта и путь
          },
        },
      })
    )
    .pipe(dest("src/img/svg")); // указываем, в какую папку поместить готовый файл спрайта
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
    "node_modules/vshowbox/dist/vshowbox.npm.js",
    // "node_modules/slideshow-popup-modal/dist/bod-modal.js",
    "src/js/main.js",
  ])
    .pipe(sourcemaps.init())
    .pipe(
      size({
        title: "js до",
      })
    )
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(
      size({
        title: "js",
      })
    )
    .pipe(dest("src/js"))
    .pipe(browserSync.stream());
}

function styles() {
  return src("src/scss/*.scss", "src/sass/*.sass")
    .pipe(sourcemaps.init())
    .pipe(
      size({
        title: "style до",
      })
    )
    .pipe(sass().on("error", sass.logError)) //при работе с sass раскоментировать
    .pipe(groupCssMediaQueries())
    .pipe(csso())
    .pipe(
      autoprefixer({
        cascade: false,
        overrideBrowserslist: ["last 10 versions"],
        grid: true,
      })
    )
    .pipe(
      cleanCss({
        level: 2,
      })
    )
    .pipe(
      rename({
        basename: "main",
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(
      size({
        title: "style",
      })
    )
    .pipe(dest("src/css"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function html() {
  return (
    src(["src/html/*.html", "src/pages/*.html", "src/*.njk", "src/*.pug"])
      .pipe(
        size({
          title: "html, pug до",
        })
      )
      // .pipe(gulpPug()) //при работе с Pug раскоментировать
      .pipe(
        htmlmin({
          collapseWhitespace: true,
        })
      ) //при работе с Html раскоментировать
      .pipe(
        fileInclude({
          prefix: "@",
          basepath: "@file",
        })
      )
      .pipe(
        size({
          title: "html, pug",
        })
      )
      .pipe(dest("src"))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

function build() {
  return src(
    [
      "src/*.html",
      "src/css/*.min.css",
      "src/js/*.min.js",
      "src/files/*.*",
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
  return del(distPath);
}

function watching() {
  watch(["src/img/svg/*.svg"], svgSprites);
  watch(["src/html/**/*.*"], html);
  watch(["src/scss/**/*.scss"], styles);
  watch(["src/js/**/*.js", "!src/js/main.min.js"], scripts);
  watch(["src/*.html"]).on("change", browserSync.reload);
}

exports.browsersync = browsersync;
exports.cleanStyle = cleanStyle;
exports.images = images;
exports.fonts = fonts;
exports.svgSprites = svgSprites;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, cleanStyle, images, build); //gulp build
exports.default = parallel(
  svgSprites,
  fonts,
  html,
  styles,
  scripts,
  browsersync,
  watching
); //gulp
