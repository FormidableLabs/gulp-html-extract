/**
 * Gulp file.
 */
var fs = require("fs"),
  gulp = require("gulp"),
  jshint = require("gulp-jshint");

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Strip comments from JsHint JSON files (naive).
var _jshintCfg = function (name) {
  var raw = fs.readFileSync(name).toString();
  return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
};

// ----------------------------------------------------------------------------
// JsHint
// ----------------------------------------------------------------------------
gulp.task("jshint", function () {
  gulp
    .src([
      "*.js"
    ])
    .pipe(jshint(_jshintCfg(".jshintrc.json")))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

// ----------------------------------------------------------------------------
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("check",      ["jshint"]);
gulp.task("default",    ["check"]);
