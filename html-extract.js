"use strict";

/**
 * Extract HTML text.
 */
var cheerio = require("cheerio");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var through2 = require("through2");
var stripIndent = require("./lib/strip-indent");
var PLUGIN_NAME = "html-text";

/**
 * ## `html-extract`
 *
 * Extract text from HTML.
 *
 * @param {Object} opts       Options
 * @param {String} opts.sel   Element selector [Default: `script`]
 * @param {String} opts.strip Strip to indent level [Default: `false`]
 * @param {String} opts.pad   Pad text to start line in source file [Default: `false`]
 * @returns {void}
 */
module.exports = function (opts) {
  opts = opts || {};
  var sel = opts.sel || "script";
  var strip = !!opts.strip;
  var pad = !!opts.pad;

  var stream = through2.obj(function (file, enc, callback) {
    /*eslint-disable no-invalid-this*/
    var self = this;
    /*eslint-enable no-invalid-this*/

    if (file.isStream()) {
      return stream.emit("error",
        new PluginError(PLUGIN_NAME, "Streams are not supported!"));
    }

    // Deleted files may have no content.
    // See: https://github.com/FormidableLabs/gulp-html-extract/issues/11
    var fileContent = (file.contents || "").toString("utf8");

    if (file.isBuffer()) {
      var contentExtracted = cheerio.load(fileContent, {
        withStartIndices: true
      });
      var els = contentExtracted(sel);

      [].forEach.call(els, function (el, i) {
        // Process children if we have them.
        if (el.children.length > 0) {
          var data = el.children[0].data;

          // Strip to indentation of first real line if specified
          if (strip) {
            data = stripIndent(data);
          }

          // Pad the file content with the corresponding top empty lines if specified
          if (pad) {
            var topText = fileContent.slice(0, el.startIndex);
            var numTopLines = (topText.match(/\r?\n/g) || []).length + 1;
            var emptyTopLines = new Array(numTopLines).join("\n");

            data = emptyTopLines + data;
          }

          self.push(new gutil.File({
            // Name: id or tag + index.
            path: file.path + "-" + (el.attribs.id || el.tagName + "-" + i),
            contents: new Buffer(data)
          }));
        }
      });
    }

    return callback();
  });

  return stream;
};
