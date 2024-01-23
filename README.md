# twine_lua_parser

![Build Status](https://github.com/sirbepy/twine_lua_parser/workflows/Build/badge.svg)

twine_lua_parser story format for [Twine 2](http://twinery.org/2) that exports the data to a lua format.

It is heavily inspired by [Twison](https://github.com/lazerwalker/twison)

## Installation

From the Twine home screen, go into Twine -> Story Formats -> Add
Then paste the following
`https://sirbepy.github.io/twine_lua_parser/dist/format.js`.

## Input

To set props just do
```
$foo = bar
```

To link, use the standard approach.
```
[[link_id]] // This will lead you to the passage with that link_id
[[Hey!|link_id]] // This will respond by saying "Hey!", but still lead you to the passage with link_id
```
Extra:
I like to link what the next conversation will be. This means that although I'm pointing to another passage, I dont want to run it now, but I like having the arrow in Twine pointing to where the user will continue off of. You can accomplish that by adding "---" to the start of your link like this.
```
[[---|link_id]]
[[---Hey!|link_id]]
```
As you can see, you can still provide a response, but its optional. Maybe you want to point to the next conversation without having your character say anything.


## Output

```lua
return {
    passages = {
        tutorial_100 = {
            text = 'HALT!\n...\nOkay, I think youre good to go.\nWhy are you here?',
            responses = {
                {text = "I'm not sure", link = 'tutorial_101'},
                {text = 'Why should I answer you?', link = 'tutorial_102'}
            },
            props = {tutorial = 1}
        },
        Greeting = {text = 'Hey\nWhat do you want?'},
        tutorial_200 = {
            text = 'Your staff just got some magic in it\nTry using it to fix this pillar over here.',
            responses = {{text = '', link = 'tutorial_300', isEnd = true}},
            props = {highlight = 'tutorial_2'}
        },
        tutorial_101 = {
            text = 'Not sure eh?\nOkay...',
            responses = {{text = 'Do you need any help?', link = 'tutorial_110'}}
        },
        tutorial_102 = {
            text = "This castle is important to me, I'm not just going to let some nobody enter without explaining themselves",
            responses = {{text = 'Do you need any help?', link = 'tutorial_110'}}
        },
        tutorial_110 = {
            text = '?\nWell, actually, yeah\nI can see your staff, so youre a wizzard...\nDo you mind cleaning this place up a little bit?',
            responses = {
                {text = 'Sure, but actually... how do i do that?', link = 'tutorial_150'},
                {text = 'Who am I talking to?', link = 'tutorial_120'}
            }
        },
        tutorial_150 = {
            text = 'Hmm, okay...\nFor now just go onto the fountain',
            responses = {{text = 'Okay', link = 'tutorial_200', isEnd = true}},
            props = {highlight = 'tutorial_1'}
        },
        tutorial_300 = {
            text = 'That was pretty good',
            responses = {{text = 'How did I do that?', link = 'tutorial_310'}}
        },
        tutorial_310 = {
            text = 'Well\nYour staff collected our EP (Ectoplasm)\nYou can use the staff to do various spells',
            responses = {{text = 'Okay, thanks! Bye', link = 'tutorial_320'}}
        },
        tutorial_120 = {
            text = 'That doesnt matter right now',
            responses = {
                {text = 'How can I trust you if I dont know who you are?', link = 'tutorial_130'},
                {text = 'How do I "clean up"?', link = 'tutorial_150'}
            }
        },
        tutorial_130 = {
            text = "Ugh\nI'm a ghost\nI used to live here\nWell...\nI used to protect this area...\nI'm the main butler around here",
            responses = {{text = 'Okay, sorry. How do I "clean up" as you said?', link = 'tutorial_150'}}
        },
        tutorial_320 = {text = 'Bye'}
    },
    name = 'HT - Butler',
    start_node_name = 'tutorial_100'
}

```

## Development

If you want to hack on twine_lua_parser itself:

1. Clone this repo
2. Install the dependencies with `npm install`
3. Run `npm start`
