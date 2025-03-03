import { Parser } from "xml2js";

const WHITELISTED_OBJECTIVE_TYPES = ["progress", "check", "talk", "list"];

const REGEX_CONDITION =
  /\?\((?:(\w+)\.)?(\w+)(?:\.(\w+))?\s*(==|<|>)?\s*["']?([^"'\s]+)?["']?\)/;
const REGEX_PROPS =
  /\$(?:(\w+)\.)?(\w+)(?:\.(\w+))?\s*=\s*("[^"]+"|'[^']+'|\b\w+\b|\d+)/;
const REGEX_EMOTION = /\{\{.+?\}\}/g;
const REGEX_NAME = /@(@|\w+):/;

// TODO: Detect if quests in conditions even exist
// TODO: Check each passage has atleast one line without a condition
// TODO: allow multiple conditions like: ?($quest.Dueling_Chefs_Part1_FindKitchenBlueprints.bench == false && quest.Dueling_Chefs_Part1_FindKitchenBlueprints.screws) Oh also

const parseLink = (text) =>
  text && (text?._ ?? text).trim().replace(/^!*\[\[|\]\]!*$/g, "");

const parseQuestData = (lines, npcName) => {
  const questOpeningIndex = lines.findIndex((line) => line.includes("<quest>"));
  if (questOpeningIndex < 0) return;
  const questClosingIndex = lines.findIndex((line) =>
    line.includes("</quest>")
  );
  if (!questClosingIndex < 0)
    return alert("You have an opening but no closing quest tag");

  const questLines = lines.slice(questOpeningIndex, questClosingIndex + 1);
  const questHTML = questLines.join("\n");

  lines.splice(questOpeningIndex, questClosingIndex - questOpeningIndex + 1);

  return parseXml(questHTML, npcName);
};

const sanitizeXMLText = (xmlString) => {
  return xmlString.replace(/&(?![a-zA-Z]+;|#\d+;|#x[0-9a-fA-F]+;)/g, "&amp;");
};

const checkObjectivesAreOkay = (toReturn) => {
  for (const key in toReturn.objectives) {
    const { dependsOn } = toReturn.objectives[key];
    if (!dependsOn) continue;
    if (!toReturn.objectives[dependsOn])
      window.renderError(
        `Objective ${key} has dependency "${dependsOn}" that does not exist`
      );
  }
};

const parseXml = async (xmlString, npcName) => {
  const parser = new Parser();
  const { quest } = await parser.parseStringPromise(sanitizeXMLText(xmlString));

  const safeGet = (param, canIgnore) => {
    const result = quest[param]?.[0];
    if (!result) {
      if (canIgnore) return;

      window.renderError("Missing important quest parameter: " + param);
    }

    if (typeof result == "string") {
      return sanitizeText(result);
    }

    return result;
  };

  const checkProp = (obj, valueKey, parentName, parentId) => {
    if (obj[valueKey]) return;
    window.renderError?.(`Missing ${valueKey} on ${parentName}: ${parentId}`);
  };

  const objectives = safeGet("objectives");
  const rewards = safeGet("rewards");

  const toReturn = {
    title: safeGet("title"),
    questGiver: npcName,
    links: {
      onReturn: parseLink(safeGet("link-on-return")),
      onComplete: parseLink(safeGet("link-on-complete", true)),
    },

    objectives: objectives.objective.reduce((acc, obj) => {
      const objective = {
        text: sanitizeText(obj._?.trim()),
        type: obj.$.type,
        observe: obj.$.observe,
        keyword: obj.$.keyword,
        dependsOn: obj.$.depends_on,
      };

      if (objective.type === "progress") {
        const goal = parseInt(obj.$.goal);
        objective.goal = goal;

        checkProp(objective, "goal", "objective", obj.$.id);
      } else if (objective.type === "list") {
        objective.items = obj["list-item"].reduce((acc, itemId) => {
          console.log(acc, itemId);
          return [...acc, itemId?.trim()];
        }, []);
      } else if (objective.type === "talk") {
        objective.npc = obj.$.npc;
        objective.passageId = parseLink(obj.$.passageid);

        checkProp(objective, "npc", "objective", obj.$.id);
        checkProp(objective, "passageId", "objective", obj.$.id);
      }

      checkProp(objective, "text", "objective", obj.$.id);
      checkProp(objective, "type", "objective", obj.$.id);
      acc[obj.$.id] = objective;
      return acc;
    }, {}),
    rewards: {},
  };

  checkObjectivesAreOkay(toReturn);

  if (objectives.$?.ordered) {
    toReturn.areObjectivesOrdered = true;
  }

  if (rewards.item) {
    toReturn.rewards.items = rewards.item.reduce((acc, item) => {
      acc[item.$.id] = parseInt(item.$.amount ?? 1);
      return acc;
    }, {});
  }

  if (rewards.prop) {
    toReturn.rewards.props = rewards.prop.reduce((acc, prop) => {
      acc[prop.$.id] = parseInt(prop.$.amount ?? 1);
      return acc;
    }, {});
  }

  let objectivesArr = Object.values(toReturn.objectives);
  if (objectivesArr.length == 0) {
    window.renderError("Need atleast one objective");
  }

  if (
    objectivesArr.find((obj) => !WHITELISTED_OBJECTIVE_TYPES.includes(obj.type))
  ) {
    window.renderError(
      "Objective has to be one of the following types: " +
        WHITELISTED_OBJECTIVE_TYPES
    );
  }

  return toReturn;
};

const sanitizeText = (text) => {
  if (!text) return text;

  // Decode from Windows-1252 to UTF-8
  const decoder = new TextDecoder("windows-1252");
  const encoder = new TextEncoder();

  let decodedText = decoder.decode(encoder.encode(text));

  return decodedText
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "...")

    .replace(/â€¦/g, "...")
    .replace(/â€™|â€˜/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/â€“/g, "-")
    .replace(/â€”/g, "--")
    .replace(/…/g, "...");
};

const formatLuaObject = (value, indent = 0) => {
  const indentString = "  ".repeat(indent);

  if (Array.isArray(value)) {
    const elements = value.map((item) => formatLuaObject(item, indent + 1));
    return `{\n${indentString}  ${elements.join(
      `,\n${indentString}  `
    )}\n${indentString}}`;
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value).map(
      ([key, val]) =>
        `${indentString}  ${key} = ${formatLuaObject(val, indent + 1)}`
    );
    return `{\n${entries.join(",\n")}\n${indentString}}`;
  }

  if (typeof value === "string") {
    return JSON.stringify(value); // Properly format strings with quotes
  }

  return value.toString(); // For numbers and booleans
};

const convertToLuaScript = (data) => {
  const formattedLua = formatLuaObject(data);
  return `return ${formattedLua}`;
};

const getCondition = (text) => {
  const match = text.match(REGEX_CONDITION);
  if (!match) return;
  let [_, type, field, subField, comparator, value] = match;

  switch (comparator) {
    case "==":
      comparator = "eq";
      break;
    case ">":
      comparator = "gt";
      // value = parseFloat(value);
      break;
    case "<":
      comparator = "lt";
      // value = parseFloat(value);
      break;
    case undefined:
      comparator = "eq";
      value = "true";
      break;
    default:
      window.renderError(
        `Found unsupported comparator ${comparator} in ${text}`
      );
      break;
  }
  try {
    value = JSON.parse(value);
  } catch (error) {}
  return {
    field,
    subField,
    type: type ?? "checks",
    comparator,
    value,
  };
};

const parseResponse = ({ unparsedText, emotion }) => {
  const safeLink = parseLink(unparsedText);
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
    if (!toReturn.text) delete toReturn.text;
  }
  if (unparsedText.startsWith("!") && unparsedText.endsWith("!")) {
    toReturn.isUrgent = true;
  }
  if (emotion) toReturn.emotion = emotion.toLowerCase();

  return toReturn;
};

const extractResponsesFromText = (texts) => {
  const responses = [];

  for (let i = texts.length - 1; i >= 0; i--) {
    const currentString = texts[i];
    const responseMatches = currentString.match(/!*\[\[.+?\]\]!*/g);
    const emotionMatches = currentString.match(REGEX_EMOTION);

    if (responseMatches) {
      const newResponse = { unparsedText: responseMatches[0] };
      if (emotionMatches) {
        newResponse.emotion = emotionMatches[0].replace(/^\{\{|\}\}$/g, "");
      }
      responses.unshift(newResponse);
      texts.splice(i, 1);
    }
  }

  if (responses.length == 0) return;

  return responses
    .map(parseResponse)
    .sort((response) => (response.isUrgent ? 1 : 0));
};

const extractPropsFromText = (texts) => {
  const props = [];

  for (let i = texts.length - 1; i >= 0; i--) {
    const currentString = texts[i];
    const match = currentString.match(REGEX_PROPS);

    if (match) {
      const [_, type, field, subField, value] = match;
      const prop = { field, type: type ?? "checks" };
      try {
        prop.value = JSON.parse(value);
      } catch (error) {
        prop.value = value;
      }

      props.push(prop);
      texts.splice(i, 1);
    }
  }

  return Object.keys(props).length > 0 ? props : null;
};

const cleanLinesArray = (texts) => {
  return texts
    .map((text) => sanitizeText(text).trim())
    .filter((text) => !!text);
};

const parseLine = (line, npcName) => {
  const toReturnLine = {
    text: line
      .replace(REGEX_CONDITION, "")
      .replace(REGEX_EMOTION, "")
      .replace(REGEX_NAME, "")
      .trim(),
  };
  const condition = getCondition(line);
  const emotion = line.match(REGEX_EMOTION);
  const nameMatch = line.match(REGEX_NAME);

  if (condition) toReturnLine.condition = condition;
  if (emotion) toReturnLine.emotion = emotion[0].replace(/^\{\{|\}\}$/g, "");
  if (nameMatch) {
    if (nameMatch[1] == "P") {
      toReturnLine.name = "Player";
    } else if (nameMatch[1] == "@") {
      toReturnLine.name = npcName;
    } else {
      toReturnLine.name = nameMatch[1];
    }
  }

  return toReturnLine;
};

const convertPassage = async (passage) => {
  const lines = cleanLinesArray(passage.innerHTML.split("\n"));
  const dict = {};

  const name = passage.attributes.name?.value;
  if (name) dict.name = name;
  const pid = passage.attributes.pid?.value;
  if (pid) dict.pid = pid;
  const npcName = passage.attributes.tags?.value;

  const quest = await parseQuestData(lines, npcName);
  if (quest) dict.quest = quest;

  const responses = extractResponsesFromText(lines);
  if (responses) {
    dict.responses = responses.filter((response) => !!response.text);
    dict.redirects = responses.filter((response) => !response.text);
    if (!dict.responses.length) delete dict.responses;
    if (!dict.redirects.length) delete dict.redirects;
  }

  const props = extractPropsFromText(lines);
  if (props) dict.props = props;

  // if (dict.tags) dict.tags = dict.tags.split(" ");
  dict.lines = cleanLinesArray(lines).map((text) => parseLine(text, npcName));
  if (dict.lines.find((item) => item.text == "---")) {
    dict.grouppedLines = dict.lines.reduce((acc, item) => {
      console.log("=>", item);
      if (item.text === "---") {
        acc.push([]);
      } else {
        if (acc.length === 0) acc.push([]);
        acc[acc.length - 1].push(item);
      }
      return acc;
    }, []);
    delete dict.lines;
  }

  return dict;
};

const convertStory = async (story) => {
  if (!window?.renderError) {
    window.renderError = (message) => {
      throw new Error(message);
    };
  }

  const passages = story.getElementsByTagName("tw-passagedata");
  const convertedPassages = await Promise.all(
    Array.prototype.slice.call(passages).map(convertPassage)
  );

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

const parseTwineToLua = async () => {
  const storyData = document.getElementsByTagName("tw-storydata")[0];
  const response = convertToLuaScript(await convertStory(storyData));
  const alreadyHasContent = document.getElementById("output").innerHTML;

  if (!alreadyHasContent)
    document.getElementById("output").innerHTML = response;
};

window.parseTwineToLua = parseTwineToLua;
