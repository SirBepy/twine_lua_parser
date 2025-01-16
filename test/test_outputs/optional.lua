return {
  passages = {
    example_start = {
      redirects = {
        {
          link = "example_option_a",
          isEnd = true
        }
      },
      props = {
        {
          varName = "highlight",
          category = "checks",
          value = true
        }
      },
      lines = {
        {
          text = "A variable called highlight has been set to true",
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
          text = "I will say this every time, but the next line will only be said if",
          name = "Player"
        },
        {
          text = "?($props.highlight == true) @CharA: The highlight prop was true, so im telling u highlight"
        }
      }
    }
  },
  name = "Shroomshire Restoration",
  start_node_name = "example_start"
}