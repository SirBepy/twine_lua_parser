const twine_lua_parser = {};

twine_lua_parser.extractLinksFromText = function (text) {
  const links = text.match(/\[\[.+?\]\]/g);
  if (!links) return null;

  return links.map(function (link) {
    const differentName = link.match(/\[\[(.*?)\-\&gt;(.*?)\]\]/);
    if (differentName) {
      // [[name->link]]
      return {
        name: differentName[1],
        link: differentName[2],
      };
    } else {
      // [[link]]
      link = link.substring(2, link.length - 2);
      return {
        name: link,
        link: link,
      };
    }
  });
};

twine_lua_parser.extractPropsFromText = function (dict) {
  const props = {};
  const setRegexPattern = /\(set:\s*\$(\w+)\s*to\s*"([^"]+)"\)/g;

  dict.text = dict.text.replace(setRegexPattern, function (match, variableName, variableValue) {
    props[variableName] = variableValue;
    return ''; // Replace the match with an empty string
  });

  // Remove any extra whitespace resulting from removal of matches
  dict.text = dict.text.trim();

  // Return props if at least one match was found, otherwise return null
  return Object.keys(props).length > 0 ? props : null;
};



twine_lua_parser.convertPassage = function (passage) {
  const dict = { text: passage.innerHTML };

  const links = twine_lua_parser.extractLinksFromText(dict.text);
  if (links) {
    dict.links = links;
  }

  const props = twine_lua_parser.extractPropsFromText(dict);
  if (props) {
    dict.props = props;
  }

  ["name", "pid", "tags"].forEach(function (attr) {
    const value = passage.attributes[attr].value;
    if (value) {
      dict[attr] = value;
    }
  });

  if (dict.tags) dict.tags = dict.tags.split(" ");

  return dict;
};

twine_lua_parser.convertStory = function (story) {
  const passages = story.getElementsByTagName("tw-passagedata");
  const convertedPassages = Array.prototype.slice
    .call(passages)
    .map(twine_lua_parser.convertPassage);

  const dict = { passages: convertedPassages };

  ["name", "startnode"].forEach(
    function (attr) {
      const value = story.attributes[attr].value;
      if (value) {
        dict[attr] = value;
      }
    }
  );

  // Add PIDs to links
  const pidsByName = {};

  dict.passages.forEach(function (passage) {
    pidsByName[passage.name] = passage.pid;
  });

  dict.passages.forEach(function (passage) {
    if (!passage.links) return;
    passage.links.forEach(function (link) {
      link.pid = pidsByName[link.link];
    });
  });

  return dict;
};

twine_lua_parser.init = function () {
  const storyData = document.getElementsByTagName("tw-storydata")[0];
  const json = JSON.stringify(
    twine_lua_parser.convertStory(storyData),
    null,
    2
  );
  document.getElementById("output").innerHTML = json;
};

window.twine_lua_parser = twine_lua_parser;
