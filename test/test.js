import { expect } from "chai";
import fs from "fs";
import jsdom from "jsdom-global";
jsdom();

describe("Converting to Lua", function () {
  const cleanup = jsdom();

  afterEach(() => (document.body.innerHTML = ""));
  after(() => cleanup());

  const genericTestFunction = (fileName) => {
    it(`Testing: ${fileName}`, async () => {
      const storyData = fs.readFileSync(
        `./test/test_inputs/test_${fileName}.html`,
        "utf-8"
      );
      const div = document.createElement("div");
      div.innerHTML = storyData;
      const story = div.childNodes[0];
      document.body.appendChild(story);

      const output = document.createElement("div");
      output.setAttribute("id", `output`);
      document.body.appendChild(output);

      const expected = fs.readFileSync(
        `./test/test_expected_outputs/${fileName}.lua`,
        "utf-8"
      );
      await import("../src/index.js");

      await window.parseTwineToLua(story, `output`);
      const result = document.getElementById(`output`).innerHTML;
      fs.writeFileSync(`./test/test_outputs/${fileName}.lua`, result);
      // fs.writeFileSync(`./test/test_expected_outputs/${fileName}.lua`, result);

      expect(expected).to.equal(result);
    });
  };

  genericTestFunction("basic");
  genericTestFunction("optional");
  genericTestFunction("quest");
  genericTestFunction("redirect");
});
