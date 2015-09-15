var fs = require("fs"),
  path = require("path"),

  chai = require("chai"),
  expect = chai.expect,

  gutil = require("gulp-util"),
  extract = require("../html-extract"),
  html = fs.readFileSync(path.join(__dirname, "test.html"), "utf8");

describe("html-extract", function () {

  beforeEach(function () {
    // Fake file.
    this.file = new gutil.File({
      path: "test/test.html",
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
        expect(file.path).to.contain("-script");
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

  it("should extract custom selectors", function (done) {
    var stream = extract({ sel: "textarea" }),
      count = 0,
      err;

    stream
      .on("data", function (file) {
        count++;
        expect(file.path).to.contain("-textarea");
        expect(file.contents.toString()).to.contain("_TEXT");
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

  it("should match id", function (done) {
    var stream = extract({ sel: "#first-textarea" }),
      count = 0,
      err;

    stream
      .on("data", function (file) {
        var text = file.contents.toString().replace(/^\s*|\s*$/g, "");

        count++;
        expect(file.path).to.contain("first-textarea");
        expect(text).to.equal("FIRST_TEXT");
      })
      .on("error", function (err) {
        err = err;
      })
      .on("end", function () {
        expect(err).to.not.be.ok;
        expect(count).to.equal(1);
        done(err);
      })
      .end(this.file);
  });
});
