window.storyFormat({
  "name": "twine_lua_parser",
  "version": "0.0.1",
  "author": "SirBepy",
  "description": "Export your Twine 2 story as a lua file (RobloxStudio)",
  "proofing": false,
  "source": "<html>\r\n  <head>\r\n    <title>{{STORY_NAME}}</title>\r\n    <script type=\"text/javascript\">\r\n      const twine_lua_parser={};twine_lua_parser.extractLinksFromText=function(t){var n=t.match(/\\[\\[.+?\\]\\]/g);return n?n.map(function(t){var n=t.match(/\\[\\[(.*?)\\-\\&gt;(.*?)\\]\\]/);return n?{name:n[1],link:n[2]}:(t=t.substring(2,t.length-2),{name:t,link:t})}):null},twine_lua_parser.extractPropsFromText=function(t){var n,r={},e=!1;const a=/\\{\\{((\\s|\\S)+?)\\}\\}((\\s|\\S)+?)\\{\\{\\/\\1\\}\\}/gm;for(;null!==(n=a.exec(t));){const s=n[1],i=n[3].replace(/(\\r\\n|\\n|\\r)/gm,\"\"),o=this.extractPropsFromText(i);r[s]=null!==o?o:i,e=!0}return e?r:null},twine_lua_parser.convertPassage=function(t){var n={text:t.innerHTML},r=twine_lua_parser.extractLinksFromText(n.text);r&&(n.links=r);const e=twine_lua_parser.extractPropsFromText(n.text);if(e&&(n.props=e),[\"name\",\"pid\",\"position\",\"tags\"].forEach(function(r){var e=t.attributes[r].value;e&&(n[r]=e)}),n.position){var a=n.position.split(\",\");n.position={x:a[0],y:a[1]}}return n.tags&&(n.tags=n.tags.split(\" \")),n},twine_lua_parser.convertStory=function(t){var n=t.getElementsByTagName(\"tw-passagedata\"),r=Array.prototype.slice.call(n).map(twine_lua_parser.convertPassage),e={passages:r};[\"name\",\"startnode\",\"creator\",\"creator-version\",\"ifid\"].forEach(function(n){var r=t.attributes[n].value;r&&(e[n]=r)});var a={};return e.passages.forEach(function(t){a[t.name]=t.pid}),e.passages.forEach(function(t){t.links&&t.links.forEach(function(t){t.pid=a[t.link],t.pid||(t.broken=!0)})}),e},twine_lua_parser.init=function(){const t=document.getElementsByTagName(\"tw-storydata\")[0],n=JSON.stringify(twine_lua_parser.convertStory(t),null,2);document.getElementById(\"output\").innerHTML=n},window.twine_lua_parser=twine_lua_parser;\r\n    </script>\r\n  </head>\r\n  <body>\r\n    <pre id=\"output\"></pre>\r\n    <div id=\"storyData\" style=\"display: none;\">\r\n      {{STORY_DATA}}\r\n    </div>\r\n    <script>\r\n      twine_lua_parser.init();\r\n    </script>\r\n  </body>\r\n</html>\r\n"
});