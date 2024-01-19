import chai from "chai";
import fs from "fs";
import jsdom from "jsdom-global";
import { twine_lua_parser } from "../src/index.js";
jsdom()

var story;

describe("Converting to Lua", function () {
  it("Generated the same lua file as before", function () {
    const storyData = fs.readFileSync("./test/fixture.html", "utf-8");
    const div = document.createElement("div");
    div.innerHTML = storyData;
    story = div.childNodes[0];
    document.body.appendChild(story);

    const output = document.createElement("div");
    output.setAttribute("id", "output");
    document.body.appendChild(output);

    const expected = fs.readFileSync("./test/expected.lua", "utf-8");

    twine_lua_parser.init(story);
    const result = document.getElementById("output").innerHTML;
    fs.writeFileSync('./test/result.lua', result)

    chai.expect(result).to.equal(expected);
  });
});
