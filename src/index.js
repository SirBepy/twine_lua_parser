const REGEX_CONDITION = /\?\((\w+)\s*(==|<|>)\s*["']?([^"'\s]+)["']?\)/;
const REGEX_PROPS = /\$([\w\d]+)\s*=\s*("[^"]+"|\d+)/;

const decodeHtmlEntities = (text) => {
  return text.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
};

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
      return JSON.stringify(value);
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

const getCondition = (text) => {
  const match = text.match(REGEX_CONDITION);
  if (!match) return;
  let [_, varName, comparator, value] = match;
  switch (comparator) {
    case "==":
      comparator = "eq";
      break;
    case ">":
      comparator = "gt";
      value = parseFloat(value);
      break;
    case "<":
      comparator = "lt";
      value = parseFloat(value);
      break;
  }
  return { varName, comparator, value };
};

const parseResponse = (unparsedText) => {
  const safeLink = unparsedText.replace(/^!*\[\[|\]\]!*$/g, "");
  const splitLink = safeLink.split("|");
  const toReturn = {};
  if (splitLink.length == 1) toReturn.link = splitLink[0];

  const condition = getCondition(splitLink[0]);
  if (condition) toReturn.condition = condition;

  if (splitLink.length == 2) {
    toReturn.link = splitLink[1];
    if (!condition) {
      toReturn.text = splitLink[0];
    }
  } else if (splitLink.length == 3) {
    toReturn.link = splitLink[2];
    toReturn.text = splitLink[1];
  }

  if (toReturn.text?.startsWith("---")) {
    toReturn.isEnd = true;
    toReturn.text = toReturn.text.replace(/^---/, "");
    if (!toReturn.text) delete toReturn.text
  }
  if (unparsedText.startsWith("!") && unparsedText.endsWith("!")) {
    toReturn.isUrgent = true;
  }

  return toReturn;
};

const extractResponsesFromText = (texts) => {
  const responses = [];

  for (let i = texts.length - 1; i >= 0; i--) {
    const currentString = texts[i];
    const matches = currentString.match(/!*\[\[.+?\]\]!*/g);

    if (matches) {
      responses.push(matches[0]);
      texts.splice(i, 1);
    }
  }

  if (responses.length == 0) return;

  return responses.map(parseResponse);
};

const extractPropsFromText = (texts) => {
  const props = {};

  for (let i = texts.length - 1; i >= 0; i--) {
    const currentString = texts[i];
    const match = currentString.match(REGEX_PROPS);

    if (match) {
      const [_, varName, value] = match;
      props[varName] = JSON.parse(value);
      texts.splice(i, 1);
    }
  }

  return Object.keys(props).length > 0 ? props : null;
};

const cleanLinesArray = (texts) => {
  return texts
    .map((text) => decodeHtmlEntities(text).trim())
    .filter((text) => !!text);
};

const parseLines = (line) => {
  const condition = getCondition(line);
  if (!condition) return { text: line };
  return { text: line.replace(REGEX_CONDITION, ''), condition };
};

const convertPassage = (passage) => {
  const lines = cleanLinesArray(passage.innerHTML.split("\n"));
  const dict = {};

  const responses = extractResponsesFromText(lines);
  if (responses) {
    dict.responses = responses.filter(response => !!response.text);
    dict.redirects = responses.filter(response => !response.text);
    if(!dict.responses.length) delete dict.responses
    if(!dict.redirects.length) delete dict.redirects
  }

  const props = extractPropsFromText(lines);
  if (props) dict.props = props;

  ["name", "tags", "pid"].forEach((attr) => {
    const value = passage.attributes[attr].value;
    if (value) dict[attr] = value;
  });

  if (dict.tags) dict.tags = dict.tags.split(" ");
  dict.lines = cleanLinesArray(lines).map(parseLines);

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
    start_node_name: convertedPassages.find(
      (passage) => passage.pid == story.attributes.startnode.value
    ).name,
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
