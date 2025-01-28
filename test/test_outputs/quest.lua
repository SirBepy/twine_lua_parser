return {
  passages = {
    quest_start = {
      quest = {
        title = "Dueling Chefs: Part 1",
        description = "Help Chef A repair his kitchen and make lunch for his wife.",
        turnInNPC = "ChefA",
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
            text = "Objective that gets completed by incrementing this abstract number only for this objective",
            type = "progress",
            goal = 3
          },
          rocks2 = {
            text = "Objective that gets completed by incrementing this specific prop number",
            type = "progress",
            observe = "inventory.rocks",
            goal = 3
          },
          purchases = {
            text = "Objective that gets completed by manipulating items within the list that are props",
            type = "list"
          },
          askCheffie = {
            text = "Objective that gets completed by talking to a specific NPC",
            type = "talk",
            goal = "CheffieA"
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
          text = "This is a test",
          name = "ChefA"
        },
        {
          text = "Okay",
          name = "Player"
        },
        {
          text = "Find a [Bench Blueprint]",
          name = "ChefA"
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
          text = "You found the plans! Thanks, @Player.",
          name = "ChefA"
        },
        {
          text = "I can still show up that @ChefB…",
          name = "ChefA"
        }
      }
    },
    default = {
      quest = {
        title = "Dueling Chefs: Part 2",
        description = "Description",
        turnInNPC = "ChefA",
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