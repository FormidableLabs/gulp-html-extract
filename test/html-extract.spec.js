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

  it("should handle no matches with custom selectors", function (done) {
    var stream = extract({ sel: ".NO_MATCH" }),
      count = 0,
      err;

    stream
      .on("data", function () {
        count++;
      })
      .on("error", function (err) {
        err = err;
      })
      .on("end", function () {
        expect(err).to.not.be.ok;
        expect(count).to.equal(0);
        done(err);
      })
      .end(this.file);
  });

  it("should extract scripts by default", function (done) {
    var stream = extract(),
      count = 0,
      err;

    stream
      .on("data", function (file) {
        count++;
        expect(file.path.toString()).to.contain("-script");
        expect(file.contents.toString()).to.contain("var ");
      })
      .on("error", function (err) {
        err = err;
      })
      .on("end", function () {
        expect(err).to.not.be.ok;
        expect(count).to.equal(2);
        done(err);
      })
      .end(this.file);
  });

  it.skip("should extract custom selectors", function () {

  });
});
