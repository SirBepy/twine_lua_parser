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
          field = "something",
          type = "props",
          value = 1
        },
        {
          field = "highlight",
          type = "checks",
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
      responses = {
        {
          condition = {
            field = "highlight2",
            type = "props",
            comparator = "lt",
            value = 4
          },
          link = "example_option_b",
          text = "Hey!"
        }
      },
      lines = {
        {
          text = "I will say this every time, but the next line will only be said if",
          name = "Player"
        },
        {
          text = "@CharA: First optional thing",
          condition = {
            field = "highlight",
            type = "props",
            comparator = "eq",
            value = true
          }
        },
        {
          text = "@CharA: Second optional thing",
          condition = {
            field = "example_start",
            type = "quest",
            comparator = "gt",
            value = 5
          }
        },
        {
          text = "@CharA: Third optional thing",
          condition = {
            field = "example_start",
            subField = "collect_apples",
            type = "quest",
            comparator = "gt",
            value = 5
          }
        }
      }
    },
    example_option_b = {
      lines = {
        {
          text = "This is the end",
          name = "Player"
        }
      }
    }
  },
  name = "Shroomshire Restoration",
  start_node_name = "example_start"
}