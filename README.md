# twine_lua_parser

![Build Status](https://github.com/sirbepy/twine_lua_parser/workflows/Build/badge.svg)

A Twine 2 story format that exports data to a Lua format. Inspired by [Twison](https://github.com/lazerwalker/twison).
This story format transforms your Twine 2 story into a Lua data structure, enabling integration with Lua-based environments like game engines.

## Installation

From the Twine home screen:

1. Go to **Twine** ➔ **Story Formats** ➔ **Add**.
2. Paste the following URL:
   ```
   https://sirbepy.github.io/twine_lua_parser/dist/format.js
   ```
3. Select "Twine to Lua parser" as your story format in the story editor.

## Input Notation

### Dialogue Lines

- **Character Names**: Use `@Name:` at the beginning of a line to specify the speaker.

  ```
  @Bob: Hello there!
  @George: Hi, Bob!
  ```

- **Emotions**: Wrap emotions in `{{` and `}}` within the line.

  ```
  @Bob: I'm feeling great! {{happy}}
  ```

- **Conditions**: Use `?(type.field == value)` to display a line only if the condition is met.

  ```
  ?(checks.hasKey == true) @George: You found the key!
  ```

### Responses and Links

- **Clickable Responses**: Use standard Twine link notation.

  ```
  [[Yes|affirmative_response]]
  [[No|negative_response]]
  ```

- **Urgent Responses**: Wrap the link with exclamation marks to prioritize.

  ```
  ![[This is urgent|urgent_response]]!
  ```

- **End Links**: Prefix the link text with `---` to indicate what should be the next dialog that the user sees when he comes back.

  ```
  [[next_passage]]
  [[---Proceed|next_passage]]
  ```

### Props and Variables

- **Set Props**: Use `$type.field = value` to set properties.

  ```
  $highlight = "tutorial_1"
  $stats.health = 100
  ```

### Quests

- **Quest Tags**: Define a quest using `<quest>` tags within a passage.

  ```
  <quest>
    <title>Dueling Chefs: Part 1</title>
    <description>Help Chef A repair his kitchen and make lunch for his wife.</description>
    <turn-in-npc>ChefA</turn-in-npc>
    <link-on-return>[[Dueling_Chefs_Part1_Return]]</link-on-return>
    <link-on-complete>[[Dueling_Chefs_Part1_Complete]]</link-on-complete>
    <objectives>
      <objective id="bench" type="progress">Find the bench blueprint for Chef A.</objective>
      <objective id="rocks" type="check" goal="3">Find 3 Rocks.</objective>
    </objectives>
    <rewards>
      <item id="black_sword" amount="1" />
      <prop id="gold" amount="50" />
    </rewards>
  </quest>
  ```

- **Quest Fields**:

  - `<title>`: The name of the quest.
  - `<description>`: A brief description of the quest.
  - `<link-on-return>`: The passage to return to during quest progress.
  - `<link-on-complete>`: The passage to go to when the quest is completed.
  - `<objectives>`: A list of objectives. Each objective includes:
    - `id`: A unique identifier for the objective.
    - `type`: The type of the objective (`progress` or `check`).
    - `goal` (optional): The goal for the objective, e.g., a count.
  - `<rewards>`: A list of rewards. Each reward includes:
    - `<item>`: Items awarded, with `id` and `amount`.
    - `<prop>`: Props awarded, with `id` and `amount`.

- **Example Quest Input**:
  ```
  <quest>
    <title>Beginner Quest</title>
    <description>Complete your first task!</description>
    <link-on-complete>[[Next Task|next_task]]</link-on-complete>
    <objectives>
      <objective id="start" type="progress">Complete the first task.</objective>
    </objectives>
    <rewards>
      <item id="starter_sword" amount="1" />
    </rewards>
  </quest>
  ```

## Output Format

The parser converts your Twine story into a Lua table:

```
return {
    passages = {
        passage_name = {
            lines = {
                { text = "Hello there!", name = "Bob", emotion = "happy" },
                { text = "You found the key!", name = "George", condition = { field = "hasKey", type = "checks", comparator = "eq", value = true } },
                { text = "Be careful now.", name = "Bob" }
            },
            responses = {
                { text = "Yes", link = "affirmative_response" },
                { text = "No", link = "negative_response" }
            },
            props = {
                { type = "highlight", field = "tutorial_1", value = true },
                { type = "stats", field = "health", value = 100 }
            },
            tags = { "example", "tutorial" }
        }
    },
    name = "My Twine Story",
    start_node_name = "start_passage"
}
```

## Features

- **Multiple Speakers**: Assign different speakers to each line using `@Name:`.
- **Emotions**: Add emotions to lines with `{{emotion}}`.
- **Conditional Dialogue**: Display lines based on conditions using `?(type.field == value)`.
- **Dynamic Props**: Set properties within passages with `$type.field = value`.
- **Urgent Responses**: Highlight important responses by wrapping links with exclamation marks.
- **Non-Interactive Transitions**: Use `---` in links to create redirects without player input.

## Example

### Twine Input

```
@Bob: Welcome to the adventure! {{excited}}
$highlight = "intro"
?($stats.level > 1) @Bob: I see you're experienced.

[[Start Quest|quest_start]]
![[Visit Shop|shop]]!
[[---|next_passage]]
```

### Lua Output

```
return {
    passages = {
        start_passage = {
            lines = {
                { text = "Welcome to the adventure!", name = "Bob", emotion = "excited" },
                { text = "I see you're experienced.", name = "Bob", condition = { field = "level", type = "stats", comparator = "gt", value = 1 } }
            },
            responses = {
                { text = "Start Quest", link = "quest_start" },
                { text = "Visit Shop", link = "shop", isUrgent = true }
            },
            redirects = {
                { link = "next_passage", isEnd = true }
            },
            props = {
                { type = "highlight", field = "intro", value = true }
            }
        }
    },
    name = "Adventure Story",
    start_node_name = "start_passage"
}
```

## Development

To work on `twine_lua_parser`:

1. Clone the repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Notes

- Ensure that each passage in Twine follows the input notation for proper parsing.
- The parser handles conditions, emotions, and character names seamlessly to generate a structured Lua output.
