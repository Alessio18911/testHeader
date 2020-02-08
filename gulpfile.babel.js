const { src, dest, series, watch } = require("gulp");
const plumber = require("gulp-plumber");
const del = require("del");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cmq = require("css-mqpacker");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const csso = require("gulp-csso");
const htmlmin = require("gulp-html-minify");
const browserSync = require("browser-sync").create();
const build = series(clean, copy, css, html);

function html() {
  return src("source/*.html")
    .pipe(htmlmin())
    .pipe(dest("dist"));
}

function css() {
  return src("source/scss/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass())
    .pipe(csso())
    .pipe(postcss([cmq({ sort: true }), autoprefixer()]))
    .pipe(rename({ basename: "style-v1", suffix: ".min" }))
    .pipe(dest("dist/css", { sourcemaps: true }))
    .pipe(browserSync.stream());
}

function copy() {
  return src(["source/fonts/**/*", "source/img/**/*"], { base: "source" })
    .pipe(dest("./dist"));
}

function clean() {
  return del("dist");
}

function server() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  watch("source/*.html", series(html, refreshPage));
  watch("source/scss/**/*", css);
}

function refreshPage(done) {
  browserSync.reload();
  done();
}

exports.default = series(build, server);
exports.build = build;
exports.clean = clean;
