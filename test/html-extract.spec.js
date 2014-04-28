var fs = require("fs"),

  chai = require("chai"),
  expect = chai.expect,

  gutil = require("gulp-util"),
  extract = require("../html-extract"),
  html = fs.readFileSync(__dirname + "/test.html", "utf8");

describe("html-extract", function () {

  beforeEach(function () {
    // Fake file.
    this.file = new gutil.File({
      path: "./test/test.html",
      contents: new Buffer(html)
    });
  });

  it("should handle no matches", function (done) {
    var stream = extract(),
      err;


    stream
      .on("data", function () {
        console.log("TODO HERE HI", arguments);
      })
      .on("error", function (err) {
        err = err;
      })
      .on("end", function () {
        expect(err).to.not.be.ok;
        done(err);
      })
      .end(this.file);
  });

  it("should handle no matches with custom selectors");

  it("should extract scripts by default");

  it("should extract custom selectors");
});
