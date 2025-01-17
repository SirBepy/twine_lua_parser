return {
  passages = {
    Dueling_Chefs_Part1_FindKitchenBlueprints = {
      quest = {
        title = "Dueling Chefs: Part 1",
        description = "Help Chef A repair his kitchen and make lunch for his wife.",
        links = {
          onReturn = "Dueling_Chefs_Part1_Return",
          onComplete = "Dueling_Chefs_Part1_Complete"
        },
        objectives = {
          {
            text = "Find the bench blueprint for Chef A.",
            id = "bench",
            type = "progress"
          },
          {
            text = "Find 3 Rocks.",
            id = "rocks",
            type = "check",
            goal = 3
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
      redirects = {
        {
          link = "Dueling_Chefs_Part1_Return",
          isEnd = true
        }
      },
      lines = {
        {
          text = "This is an absolute disaster!",
          name = "ChefA"
        },
        {
          text = "What's wrong?",
          name = "Player"
        },
        {
          text = "My table is broken",
          name = "ChefA"
        },
        {
          text = "Maybe I can help?",
          name = "Player"
        },
        {
          text = "Better than just standing around!",
          name = "ChefA"
        },
        {
          text = "We'll need plans for a [Bench] and [3 Rocks]"
        },
        {
          text = "I'll get to it!",
          name = "Player"
        },
        {
          text = "An absolute disaster…",
          name = "ChefA"
        }
      }
    },
    Dueling_Chefs_Part1_Return = {
      lines = {
        {
          text = "Hey!",
          name = "Player"
        }
      }
    },
    Dueling_Chefs_Part1_Complete = {
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
    Default = {
      lines = {
        {
          text = "Now Ill always say this"
        }
      }
    }
  },
  name = "Shroomshire Restoration",
  start_node_name = "Dueling_Chefs_Part1_FindKitchenBlueprints"
}