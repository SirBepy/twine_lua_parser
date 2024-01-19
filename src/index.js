const parseValueAsLuaObject = (value) => {
  const valueType = typeof value;
  if (value === null) return null;
  if (Array.isArray(value)) {
    const elements = value.map(parseValueAsLuaObject).join(", ");
    return `{${elements}}`;
  }

  switch (valueType) {
    case "number":
    case "boolean":
      return value.toString();
    case "string":
      return JSON.stringify(value)
        .replace(/\\n\s+/g, "\\n")
        .replace(/\s+\\n/g, "\\n");
    case "object": {
      const properties = Object.entries(value)
        .map(([key, val]) => `${key} = ${parseValueAsLuaObject(val)}`)
        .join(", ");
      return `{${properties}}`;
    }
    default:
      throw new Error(`Unsupported data type: ${valueType}`);
  }
};

const convertToLuaScript = (data) => {
  return `return ${parseValueAsLuaObject(data)}`;
};

const parseResponse = (text) => {
  const safeLink = text.replace(/^\[+|\]+$/g, "");
  const [response, link] = safeLink.split("|");
  const toReturn = {
    response: response.replace(/^---\s*/, ""),
    link: link ?? response,
  };
  if (response.startsWith("---")) {
    toReturn.isEnd = true;
  }
  return toReturn;
};

const extractResponsesFromText = (dict) => {
  const text = dict.text;
  const responses = text.match(/\[\[.+?\]\]/g);
  if (!responses) return null;

  dict.text = dict.text.replace(/\[\[.*?\]\]/g, ""); // remove all [[]]

  return responses.map(parseResponse);
};

const extractPropsFromText = (dict) => {
  const props = {};
  const setRegexPattern = /\$([\w\d]+)\s*=\s*("[^"]+"|\d+)/g;

  dict.text = dict.text.replace(
    setRegexPattern,
    (match, variableName, variableValue) => {
      props[variableName] = JSON.parse(variableValue);
      return ""; // Replace the match with an empty string
    }
  );

  dict.text = dict.text.trim();

  return Object.keys(props).length > 0 ? props : null;
};

const convertPassage = (passage) => {
  const dict = { text: passage.innerHTML };

  const responses = extractResponsesFromText(dict);
  if (responses) dict.responses = responses;

  const props = extractPropsFromText(dict);
  if (props) dict.props = props;

  ["name", "tags", "pid"].forEach((attr) => {
    const value = passage.attributes[attr].value;
    if (value) dict[attr] = value;
  });

  if (dict.tags) dict.tags = dict.tags.split(" ");
  dict.text = dict.text.replace(/\s+$/g, ""); // remove all trailing \n

  return dict;
};

const convertStory = (story) => {
  const passages = story.getElementsByTagName("tw-passagedata");
  const convertedPassages = Array.prototype.slice
    .call(passages)
    .map(convertPassage);

  const dict = {
    passages: {},
    name: story.attributes.name.value,
    start_node_name: convertedPassages.find(passage => passage.pid == story.attributes.startnode.value).name
  };

  convertedPassages.forEach((row) => {
    dict.passages[row.name] = { ...row, name: undefined, pid: undefined };
  });

  return JSON.parse(JSON.stringify(dict));
};

const parseTwineToLua = () => {
  const storyData = document.getElementsByTagName("tw-storydata")[0];
  const response = convertToLuaScript(convertStory(storyData));
  document.getElementById("output").innerHTML = response;
};

window.parseTwineToLua = parseTwineToLua;
