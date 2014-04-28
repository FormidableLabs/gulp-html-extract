/**
 * Extract HTML text.
 */
var jsdom = require("jsdom"),
  gutil = require("gulp-util"),
  PluginError = gutil.PluginError,
  through2 = require("through2"),
  PLUGIN_NAME = "html-text";

/**
 * ## `html-extract`
 *
 * Extract text from HTML.
 *
 * @param {Object} opts     Options
 * @param {String} opts.sel Element selector [Default: `script`] (_optional_)
 */
module.exports = function (opts) {
  opts = opts || {};
  var sel = opts.sel || "script";

  var stream = through2.obj(function(file, enc, callback) {
    var self = this;

    if (file.isStream()) {
      return stream.emit("error",
        new PluginError(PLUGIN_NAME, "Streams are not supported!"));
    }

    if (file.isBuffer()) {
      jsdom.env({
        html: file.contents.toString("utf8"),
        done: function (errors, root) {
          var els = root.document.querySelectorAll(sel);

          // Emit fake "files" for each text snippet.
          [].forEach.call(els, function (el, i) {
            self.push(new gutil.File({
              // Name: id or tag + index.
              path: file.path + "-" + (el.id || el.tagName + "-" + i),
              contents: new Buffer(el.textContent)
            }));
          });

          callback();
        }
      });
    }
  });

  return stream;
};