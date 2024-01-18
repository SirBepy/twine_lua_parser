window.storyFormat({
  "name": "twine_lua_parser",
  "version": "0.0.3",
  "author": "SirBepy",
  "description": "Export your Twine 2 story as a lua file (RobloxStudio)",
  "proofing": false,
  "source": "<html>\r\n  <head>\r\n    <title>{{STORY_NAME}}</title>\r\n    <script type=\"text/javascript\">\r\n      undefined\r\n    </script>\r\n  </head>\r\n  <body>\r\n    <pre id=\"output\"></pre>\r\n    <div id=\"storyData\" style=\"display: none;\">\r\n      {{STORY_DATA}}\r\n    </div>\r\n    <script>\r\n      twine_lua_parser.init();\r\n    </script>\r\n  </body>\r\n</html>\r\n"
});