return {
  passages = {
    example_start = {
      responses = {
        {
          link = "example_option_a",
          text = "Option A"
        },
        {
          link = "example_option_b",
          text = "Option B"
        }
      },
      lines = {
        {
          text = "I'm one guy",
          name = "CharA"
        },
        {
          text = "I'm another guy",
          name = "Player"
        }
      }
    },
    example_option_a = {
      lines = {
        {
          text = "I'm saying one thing and the dialogue is ending here",
          name = "Player"
        }
      }
    },
    example_option_b = {
      redirects = {
        {
          link = "example_end",
          isEnd = true
        }
      },
      lines = {
        {
          text = "I'm saying smth and then the dialogue continues",
          name = "Player"
        }
      }
    },
    example_end = {
      lines = {
        {
          text = "This is the end",
          name = "CharA"
        }
      }
    }
  },
  name = "Shroomshire Restoration",
  start_node_name = "example_start"
}