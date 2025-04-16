return {
  passages = {
    example_start = {
      props = {
        {
          field = "negPlusEquals",
          type = "props",
          operator = "add",
          value = -4
        },
        {
          field = "posPlusEquals",
          type = "props",
          operator = "add",
          value = 3
        },
        {
          field = "negIncrementor",
          type = "props",
          operator = "add",
          value = -1
        },
        {
          field = "posIncrementor",
          type = "props",
          operator = "add",
          value = 1
        },
        {
          field = "isGood",
          type = "props",
          operator = "set",
          value = true
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
    }
  },
  name = "Shroomshire Restoration",
  start_node_name = "example_start"
}