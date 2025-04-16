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
          conditions = {
            {
              {
                field = "simple",
                type = "props",
                comparator = "lt",
                value = 4
              }
            }
          },
          link = "example_option_b",
          text = "Hey!"
        },
        {
          conditions = {
            {
              {
                field = "a",
                type = "complex",
                comparator = "gt",
                value = 1
              }
            },
            {
              {
                field = "b",
                type = "complex",
                comparator = "eq",
                value = 1
              },
              {
                field = "c",
                type = "complex",
                comparator = "eq",
                value = "true"
              }
            }
          },
          link = "example_option_b",
          text = "Complex Response!"
        }
      },
      redirects = {
        {
          conditions = {
            {
              {
                field = "urgent_example",
                type = "props",
                comparator = "eq",
                value = "true"
              }
            }
          },
          link = "example_option_b",
          isUrgent = true
        }
      },
      lines = {
        {
          text = "I will say this every time, but the next line will only be said if",
          name = "Player"
        },
        {
          text = "First optional thing",
          conditions = {
            {
              {
                field = "highlight",
                type = "props",
                comparator = "eq",
                value = "true"
              }
            }
          },
          name = "CharA"
        },
        {
          text = "Non props and bigger than testing",
          conditions = {
            {
              {
                field = "example",
                type = "non_props",
                comparator = "gt",
                value = 5
              }
            }
          },
          name = "CharA"
        },
        {
          text = "Third optional thing",
          conditions = {
            {
              {
                field = "deeply",
                subField = "nested",
                type = "quest",
                comparator = "lt",
                value = 5
              }
            }
          },
          name = "CharA"
        },
        {
          text = "This was a complex if statement",
          conditions = {
            {
              {
                field = "a",
                type = "complex",
                comparator = "gt",
                value = 1
              }
            },
            {
              {
                field = "b",
                type = "complex",
                comparator = "lt",
                value = 2
              },
              {
                field = "c",
                type = "complex",
                comparator = "eq",
                value = "true"
              }
            }
          },
          name = "CharA"
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