return {
  passages = {
    quest_start = {
      quest = {
        title = "Dueling Chefs: Part 1 &amp; not 2",
        questGiver = "Mayor",
        links = {
          onReturn = "Dueling_Chefs_Part1_Return",
          onComplete = "Dueling_Chefs_Part1_Complete"
        },
        objectives = {
          bench = {
            text = "Objective that gets completed by manipulating this objective itself",
            type = "check"
          },
          specific_item = {
            text = "Objective gets completed if this prop returns truthy",
            type = "check",
            observe = "tycoon_progress.48a98fn2-419n-41hz-vn82-9815n89zcv92"
          },
          rocks = {
            text = "Objective that gets completed by incrementing this abstract number only for this objective rocks 3",
            type = "progress",
            keyword = "rocks",
            goal = 3
          },
          rocks2 = {
            text = "Objective that gets completed by incrementing this specific prop number",
            type = "progress",
            observe = "inventory.rocks",
            dependsOn = "rocks",
            goal = 3
          },
          purchases = {
            text = "Objective that gets completed by manipulating items within the list that are props",
            type = "list",
            items = {
              "tycoon_progress.0baed953-25f2-4a26-afc4-024b10797e99",
              "tycoon_progress.845189fe-f2aa-9fc8-4ncz-084818s8f8a8",
              "tycoon_progress.14fhz8am-v341-4123-n4gz-4h89189vna92"
            }
          },
          askCheffie = {
            text = "Objective that gets completed by talking to a specific NPC",
            type = "talk",
            npc = "CheffieA",
            passageId = "quest_return"
          }
        },
        rewards = {
          items = {
            black_sword = 1
          },
          props = {
            gold = 50
          }
        },
        areObjectivesOrdered = true
      },
      redirects = {
        {
          link = "Dueling_Chefs_Part1_Return",
          isEnd = true
        }
      },
      lines = {
        {
          text = "This is a &amp; test",
          name = "Mayor"
        },
        {
          text = "Okay",
          name = "Player"
        },
        {
          text = "Find a 3 rocks",
          name = "Mayor"
        }
      }
    },
    quest_return = {
      lines = {
        {
          text = "Hey!",
          name = "Player"
        }
      }
    },
    quest_complete = {
      redirects = {
        {
          link = "Default",
          isEnd = true
        }
      },
      lines = {
        {
          text = "You found the plans! Thanks, @P.",
          name = "Mayor"
        },
        {
          text = "And in record time!",
          name = "OtherGuy"
        },
        {
          text = "I can still show up that @ChefB...",
          name = "Mayor"
        }
      }
    },
    default = {
      quest = {
        title = "Dueling Chefs: Part 2",
        questGiver = "Mayor",
        links = {
          onReturn = "Dueling_Chefs_Part1_Return",
          onComplete = "Dueling_Chefs_Part1_Complete"
        },
        objectives = {
          bench = {
            text = "Objective that gets completed by manipulating this objective itself",
            type = "check"
          }
        },
        rewards = {
          items = {
            black_sword = 1
          },
          props = {
            gold = 50
          }
        }
      },
      lines = {
        {
          text = "Now Ill always say this"
        }
      }
    }
  },
  name = "Shroomshire Restoration",
  start_node_name = "quest_start"
}