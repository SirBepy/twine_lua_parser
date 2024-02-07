return {
    passages = {
        tutorial_100 = {
            responses = {
                {link = 'youre_stupid', text = 'Youre stupid!'},
                {link = 'tutorial_101', text = "I'm not sure"},
                {link = 'tutorial_102', text = 'Why should I answer you?'}
            },
            props = {{varName = 'tutorial', category = 'checks', value = 1}},
            lines = {
                {text = 'HALT! ', emotion = 'angry'},
                {
                    text = ' Oh, you are 5 years old?',
                    condition = {varName = 'age', category = 'checks', comparator = 'eq', value = 5}
                },
                {text = '...'},
                {text = 'Okay, I think youre good to go, but why are you here?', emotion = 'sad'}
            }
        },
        Greeting = {lines = {{text = 'Hey'}, {text = 'What do you want?'}}},
        tutorial_200 = {
            redirects = {{link = 'tutorial_300', isEnd = true}},
            props = {{varName = 'highlight', category = 'checks', value = 'tutorial_2'}},
            lines = {
                {text = 'Your staff just got some magic in it'},
                {text = 'Try using it to fix this pillar over here.'}
            }
        },
        tutorial_101 = {
            responses = {{link = 'tutorial_110', text = 'Do you need any help?'}},
            lines = {{text = 'Not sure eh?'}, {text = 'Okay...'}}
        },
        tutorial_102 = {
            responses = {{link = 'tutorial_110', text = 'Do you need any help?'}},
            lines = {
                {
                    text = "This castle is important to me, I'm not just going to let some nobody enter without explaining themselves"
                }
            }
        },
        tutorial_110 = {
            responses = {
                {link = 'tutorial_150', text = 'Sure, but actually... how do i do that?'},
                {link = 'tutorial_120', text = 'Who am I talking to?'}
            },
            props = {{varName = 'staff', category = 'inventory', value = true}},
            lines = {
                {text = '?'},
                {text = 'Well, actually, yeah'},
                {text = 'I can see your staff, so youre a wizzard...'},
                {text = 'Do you mind cleaning this place up a little bit?'}
            }
        },
        tutorial_150 = {
            responses = {{link = 'tutorial_200', text = 'Okay', isEnd = true}},
            props = {{varName = 'highlight', category = 'checks', value = 'fountain'}},
            lines = {{text = 'Hmm, okay...'}, {text = 'For now just go onto the fountain'}}
        },
        tutorial_300 = {
            responses = {{link = 'tutorial_310', text = 'How did I do that?'}},
            lines = {{text = 'That was pretty good'}}
        },
        tutorial_310 = {
            responses = {{link = 'tutorial_320', text = 'Okay, thanks! Bye'}},
            lines = {
                {text = 'Well'},
                {text = 'Your staff collected our EP (Ectoplasm)'},
                {text = 'You can use the staff to do various spells'}
            }
        },
        tutorial_120 = {
            responses = {
                {link = 'tutorial_130', text = 'How can I trust you if I dont know who you are?'},
                {link = 'tutorial_150', text = 'How do I "clean up"?'}
            },
            props = {{varName = 'shakeCamera', category = 'checks', value = 'true'}},
            lines = {{text = 'That doesnt matter right now'}}
        },
        tutorial_130 = {
            responses = {{link = 'tutorial_150', text = 'Okay, sorry. How do I "clean up" as you said?'}},
            props = {{varName = 'shakeCamera', category = 'checks', value = 'false'}},
            lines = {
                {text = 'Ugh'},
                {text = "I'm a ghost"},
                {text = 'I used to live here'},
                {text = 'Well...'},
                {text = 'I used to protect this area...'},
                {text = "I'm the main butler around here"}
            }
        },
        tutorial_320 = {lines = {{text = 'Bye'}}},
        youre_stupid = {
            responses = {
                {
                    condition = {varName = 'age', category = 'checks', comparator = 'lt', value = 50},
                    link = 'optional_response',
                    text = 'An optional response'
                },
                {link = 'default_response', text = 'Oh, sorry about that'}
            },
            redirects = {
                {
                    condition = {varName = 'hat', category = 'checks', comparator = 'eq', value = 'urgent'},
                    link = 'urgent_redirect',
                    isUrgent = true
                },
                {
                    condition = {varName = 'hat', category = 'checks', comparator = 'eq', value = 'redirect'},
                    link = 'redirect_after_text'
                },
                {
                    condition = {varName = 'age', category = 'checks', comparator = 'gt', value = 50},
                    link = 'redirect_after_text_number'
                }
            },
            lines = {
                {text = 'First line'},
                {
                    text = 'You have a staff in your inventory',
                    condition = {varName = 'staff', category = 'inventory', comparator = 'eq', value = true}
                },
                {text = 'Second line'}
            }
        },
        redirect_after_text = {lines = {{text = 'First redirect line (After text)'}, {text = 'Second redirect line'}}},
        redirect_after_text_number = {
            lines = {{text = 'First redirect line (After tex with number)'}, {text = 'Second redirect line'}}
        },
        urgent_redirect = {lines = {{text = 'First redirect line (urgent!)'}, {text = 'Second redirect line'}}},
        optional_response = {lines = {{text = 'Optional Response'}}},
        default_response = {lines = {{text = 'This is the default response'}}},
        quick_test = {
            responses = {
                {link = 'sad_response', text = 'Youre ugly', emotion = 'Sad'},
                {link = 'angry_response', text = 'I stole your wallet', emotion = 'Angry'},
                {link = 'happy_response', text = 'You look cute', emotion = 'Happy'},
                {link = 'shocked_response', text = 'Boo', emotion = 'Shocked'}
            },
            lines = {{text = 'Hi!'}, {text = 'Who are you?'}}
        },
        angry_response = {responses = {{link = 'bye', text = 'Bye'}}, lines = {{text = 'NO! ', emotion = 'Angry'}}},
        sad_response = {
            responses = {{link = 'bye', text = 'Bye'}},
            lines = {{text = 'Thats very mean of you ', emotion = 'Sad'}}
        },
        happy_response = {
            responses = {{link = 'bye', text = 'Bye'}},
            lines = {{text = 'Aww, thank you! ', emotion = 'Happy'}, {text = 'Thats very kind of you!'}}
        },
        shocked_response = {responses = {{link = 'bye', text = 'Bye'}}, lines = {{text = 'WAA ', emotion = 'Shocked'}}},
        bye = {lines = {{text = 'Bye ', emotion = 'Default'}}}
    },
    name = 'Maxwell',
    start_node_name = 'quick_test'
}
