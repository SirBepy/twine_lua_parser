var expect = require("chai").expect;
var fs = require("fs");
require("jsdom-global")();

var story;

describe("Converting to JSON", function () {
  it("should generate the correct JSON", function () {
    var storyData = fs.readFileSync("fixture.html", "utf-8");
    var div = document.createElement("div");
    div.innerHTML = storyData;
    story = div.childNodes[0];
    document.body.appendChild(story);

    var output = document.createElement("div");
    output.setAttribute("id", "output");
    document.body.appendChild(output);

    var expected = fs.readFileSync("output.json", "utf-8");

    require("../src/twine_lua_parser.js");

    window.twine_lua_parser.init(story);
    var result = document.getElementById("output").innerHTML;

    expect(result).to.equal(expected);
  });
});
