# twine_lua_parser

![Build Status](https://github.com/sirbepy/twine_lua_parser/workflows/Build/badge.svg)

A Twine 2 story format that exports data to a Lua format. Inspired by [Twison](https://github.com/lazerwalker/twison).

## Installation

From the Twine home screen:

1. Go to **Twine** ➔ **Story Formats** ➔ **Add**.
2. Paste the following URL:
   ```
   https://sirbepy.github.io/twine_lua_parser/dist/format.js
   ```

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

- **Conditions**: Use `?($category.varName == value)` to display a line only if the condition is met.

   ```
   ?($checks.hasKey == true) @George: You found the key!
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

- **End Links**: Prefix the link text with `---` to indicate a non-interactive transition.

   ```
   [[---|next_passage]]
   [[---Proceed|next_passage]]
   ```

### Props and Variables

- **Set Props**: Use `$category.varName = value` to set properties.

   ```
   $highlight = "tutorial_1"
   $stats.health = 100
   ```

## Output Format

The parser converts your Twine story into a Lua table:

   ```
   return {
       passages = {
           passage_name = {
               lines = {
                   { text = "Hello there!", name = "Bob", emotion = "happy" },
                   { text = "You found the key!", name = "George", condition = { varName = "hasKey", category = "checks", comparator = "eq", value = true } },
                   { text = "Be careful now.", name = "Bob" }
               },
               responses = {
                   { text = "Yes", link = "affirmative_response" },
                   { text = "No", link = "negative_response" }
               },
               props = {
                   { category = "highlight", varName = "tutorial_1", value = true },
                   { category = "stats", varName = "health", value = 100 }
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
- **Conditional Dialogue**: Display lines based on conditions using `?($category.varName == value)`.
- **Dynamic Props**: Set properties within passages with `$category.varName = value`.
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
                   { text = "I see you're experienced.", name = "Bob", condition = { varName = "level", category = "stats", comparator = "gt", value = 1 } }
               },
               responses = {
                   { text = "Start Quest", link = "quest_start" },
                   { text = "Visit Shop", link = "shop", isUrgent = true }
               },
               redirects = {
                   { link = "next_passage", isEnd = true }
               },
               props = {
                   { category = "highlight", varName = "intro", value = true }
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

