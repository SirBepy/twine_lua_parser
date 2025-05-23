import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const js = fs.readFileSync("./dist/bundle.js", "utf-8");
let html = fs.readFileSync("src/storyFormat.html", "utf-8");
html = html.replace("{ { SCRIPT } }", js);

const outputJSON = {
  name: "Twine to Lua parser",
  version: pkg.version,
  author: pkg.author,
  description: pkg.description,
  proofing: false,
  source: html,
};

if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

const outputString = "window.storyFormat(" + JSON.stringify(outputJSON, null, 2) + ");";
fs.writeFile("dist/format.js", outputString, (err) => {
  if (err) {
    console.log("Error building story format:", err);
  } else {
    console.log("Successfully built story format to dist/format.js");
  }
});
