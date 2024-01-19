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

const twine_lua_parser = {};

twine_lua_parser.extractResponsesFromText = (dict) => {
  const text = dict.text
  const responses = text.match(/\[\[.+?\]\]/g);
  if (!responses) return null;
  // remove all [[]]
  dict.text = dict.text.replace(/\[\[.*?\]\]/g, '');

  return responses.map((text) => {
    const safeLink = text.replace(/^\[+|\]+$/g, "");
    const [response, link] = safeLink.split("|");
    return {
      isDone: response.startsWith('---'),
      response: response.replace(/^---\s*/, ''),
      link: link ?? response,
    };
  });
};

twine_lua_parser.extractPropsFromText = (dict) => {
  const props = {};
  const setRegexPattern = /\$([\w\d]+)\s*=\s*("[^"]+"|\d+)/g;

  dict.text = dict.text.replace(
    setRegexPattern,
    (match, variableName, variableValue) => {
      props[variableName] = variableValue;
      return ""; // Replace the match with an empty string
    }
  );

  // Remove any extra whitespace resulting from removal of matches
  dict.text = dict.text.trim();

  // Return props if at least one match was found, otherwise return null
  return Object.keys(props).length > 0 ? props : null;
};

twine_lua_parser.convertPassage = (passage) => {
  const dict = { text: passage.innerHTML };

  const responses = twine_lua_parser.extractResponsesFromText(dict);
  if (responses) {
    dict.responses = responses;
  }

  const props = twine_lua_parser.extractPropsFromText(dict);
  if (props) {
    dict.props = props;
  }

  ["name", "pid", "tags"].forEach((attr) => {
    const value = passage.attributes[attr].value;
    if (value) {
      dict[attr] = value;
    }
  });

  if (dict.tags) dict.tags = dict.tags.split(" ");
  
  // remove all trailing \n
  dict.text = dict.text.replace(/\s+$/g, '')

  return dict;
};

twine_lua_parser.convertStory = (story) => {
  const passages = story.getElementsByTagName("tw-passagedata");
  const convertedPassages = Array.prototype.slice
    .call(passages)
    .map(twine_lua_parser.convertPassage);

  const dict = { passages: convertedPassages };

  ["name", "startnode"].forEach((attr) => {
    const value = story.attributes[attr].value;
    if (value) {
      dict[attr] = value;
    }
  });

  // Add PIDs to responses
  const pidsByName = {};

  dict.passages.forEach((passage) => {
    pidsByName[passage.name] = passage.pid;
  });

  dict.passages.forEach((passage) => {
    if (!passage.responses) return;
    passage.responses.forEach((link) => {
      link.pid = pidsByName[link.link];
    });
  });

  return JSON.parse(JSON.stringify(dict));
};

twine_lua_parser.init = () => {
  const storyData = document.getElementsByTagName("tw-storydata")[0];
  const response = convertToLuaScript(twine_lua_parser.convertStory(storyData));
  document.getElementById("output").innerHTML = response;
};

if (typeof window !== "undefined") window.twine_lua_parser = twine_lua_parser;

export { twine_lua_parser };
