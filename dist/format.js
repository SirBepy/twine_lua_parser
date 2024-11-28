window.storyFormat({
  "name": "Twine to Lua parser",
  "version": "0.0.22",
  "author": "SirBepy",
  "description": "Export your Twine 2 story as a lua file (RobloxStudio)",
  "proofing": false,
  "source": "<html>\r\n\r\n<head>\r\n  <title>{{STORY_NAME}}</title>\r\n  <script type=\"text/javascript\">\r\n    var{keys:a}=Object,{isArray:b}=Array,c=/\\?\\((?:(\\w+)\\.)?(\\w+)\\s*(==|<|>)\\s*[\"']?([^\"'\\s]+)[\"']?\\)/,d=/\\$(?:(\\w+)\\.)?(\\w+)\\s*=\\s*(\"[^\"]+\"|'[^']+'|\\b\\w+\\b|\\d+)/,e=/\\{\\{.+?\\}\\}/g,f=/^@(\\w+):/,g=_=>_.replaceAll('&lt;','<').replaceAll('&gt;','>'),h=B=>{const C=typeof B;if(B==null)return null;if(b(B)){const _a=B.map(h).join(', ');return`{${_a}}`}switch(C) {case 'number':case 'boolean':return`${B}`;case 'string':return JSON.stringify(B);case 'object':{const D=Object.entries(B).map(([_A,_b])=>`${_A} = ${h(_b)}`).join(', ');return`{${D}}`}default:throw Error(`Unsupported data type: ${C}`)}},A=E=>`return ${h(E)}`,j=aA=>{const _B=aA.match(c);if(!_B)return;let[,_c,_d,_e,F]=_B;switch(_e) {case '==':_e='eq';break;case '>':_e='gt';break;case '<':_e='lt';break}try {F=JSON.parse(F)} catch {}return{varName:_d,category:_c??'checks',comparator:_e,value:F}},k=({unparsedText:aB,emotion:aC})=>{const _C=aB.replace(/^!*\\[\\[|\\]\\]!*$/g,''),_D=_C.split('|'),_E={},_f=j(_D[0]);_D.length==1&&(_E.link=_D[0]);_f&&(_E.condition=_f);if(_D.length==2){_E.link=_D[1];!_f&&(_E.text=_D[0])}else _D.length==3&&(_E.link=_D[2],_E.text=_D[1]);_E.text?.startsWith('---')&&(_E.isEnd=!0,_E.text=_E.text.replace(/^---/,''),!_E.text&&delete _E.text);aB.startsWith('!')&&aB.endsWith('!')&&(_E.isUrgent=!0);aC&&(_E.emotion=aC);return _E},l=aD=>{const aE=[];for(let i=aD.length-1;i>=0;i--){const aF=aD[i],aG=aF.match(/!*\\[\\[.+?\\]\\]!*/g),aH=aF.match(e);if(aG){const aI={unparsedText:aG[0]};aH&&(aI.emotion=aH[0].replace(/^\\{\\{|\\}\\}$/g,''));aE.unshift(aI);aD.splice(i,1)}}if(!aE.length)return;return aE.map(k).sort(aJ=>aJ.isUrgent?1:0)},m=aK=>{const aL=[];for(let i=aK.length-1;i>=0;i--){const aM=aK[i],aN=aM.match(d);if(aN){const[,aO,aP,aQ]=aN,aR={varName:aP,category:aO??'checks'};try {aR.value=JSON.parse(aQ)} catch {aR.value=aQ}aL.push(aR);aK.splice(i,1)}}return a(aL).length>0?aL:null},n=aS=>aS.map(aT=>g(aT).trim()).filter(aU=>!!aU),o=aV=>{const aW={text:aV.replace(c,'').replace(e,'').replace(f,'').trim()},aX=j(aV),aY=aV.match(e),aZ=aV.match(f);aX&&(aW.condition=aX);aY&&(aW.emotion=aY[0].replace(/^\\{\\{|\\}\\}$/g,''));aZ&&(aW.name=aZ[1]);return aW},p=bA=>{const bB=n(bA.innerHTML.split('\\n')),bC={},bD=l(bB),bE=m(bB);bD&&(bC.responses=bD.filter(bF=>!!bF.text),bC.redirects=bD.filter(bG=>!bG.text),!bC.responses.length&&delete bC.responses,!bC.redirects.length&&delete bC.redirects);bE&&(bC.props=bE);for(const bH of ['name','tags','pid']){const bI=bA.attributes[bH].value;bI&&(bC[bH]=bI)}bC.tags&&(bC.tags=bC.tags.split(' '));bC.lines=n(bB).map(o);return bC},q=bJ=>{const bK=Array.prototype.slice.call(bJ.getElementsByTagName('tw-passagedata')).map(p),bL={passages:{},name:bJ.attributes.name.value,start_node_name:bK.find(bM=>bM.pid==bJ.attributes.startnode.value).name};for(const bN of bK)bL.passages[bN.name]={...bN,name:void 0, pid:void 0};return JSON.parse(JSON.stringify(bL))};window.parseTwineToLua=()=>document.getElementById('output').innerHTML=A(q(document.getElementsByTagName('tw-storydata')[0]));\r\n  </script>\r\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\r\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\r\n  <link href=\"https://fonts.googleapis.com/css2?family=Parkinsans:wght@300..800&display=swap\" rel=\"stylesheet\">\r\n  <style>\r\n    body,\r\n    html {\r\n      background-color: #365486;\r\n    }\r\n\r\n    * {\r\n      font-family: \"Parkinsans\", sans-serif;\r\n      color: #7FC7D9;\r\n      box-sizing: border-box;\r\n      margin: 0;\r\n      padding: 0;\r\n    }\r\n\r\n    main {\r\n      display: flex;\r\n      justify-content: center;\r\n      align-items: center;\r\n      margin: auto;\r\n      gap: 4em;\r\n      height: 100%;\r\n      max-width: 1000px;\r\n    }\r\n\r\n    .halfOfScreen {\r\n      flex: 1;\r\n      gap: 1em;\r\n      display: flex;\r\n      flex-direction: column;\r\n      justify-content: center;\r\n      align-items: center;\r\n    }\r\n\r\n    #storyData {\r\n      display: none;\r\n    }\r\n\r\n    #output {\r\n      overflow-y: auto;\r\n      text-wrap: wrap;\r\n      padding: 1em;\r\n      background-color: #00000040;\r\n      border-radius: 10px;\r\n      width: 100%;\r\n      color: #7fc7d98f;\r\n    }\r\n\r\n    #unrecognizedNames {\r\n      margin-top: 1em;\r\n      padding: 1em 2em;\r\n      border-radius: 10px;\r\n      color: white;\r\n      width: 100%;\r\n      background-color: #00000040;\r\n    }\r\n\r\n    #unrecognizedNames button {\r\n      margin-top: 0.5em;\r\n    }\r\n\r\n    button {\r\n      width: 180px;\r\n      height: 40px;\r\n      border-radius: 10px;\r\n      font-size: 1em;\r\n      background-color: #7FC7D9;\r\n      color: white;\r\n      border: #DCF2F1 1px solid;\r\n      transition: 0.2s;\r\n      cursor: pointer;\r\n    }\r\n\r\n    button:hover {\r\n      opacity: 0.5;\r\n    }\r\n\r\n    button:active {\r\n      opacity: 0.2;\r\n    }\r\n\r\n    button:disabled {\r\n      opacity: 1;\r\n    }\r\n  </style>\r\n</head>\r\n\r\n<body>\r\n  <main>\r\n    <div class=\"halfOfScreen\">\r\n      <pre id=\"output\"></pre>\r\n      <button onclick=\"copyText()\">Copy output</button>\r\n    </div>\r\n    <div class=\"halfOfScreen\">\r\n      <h3>Unrecognized Names:</h3>\r\n      <ul id=\"unrecognizedNames\">\r\n      </ul>\r\n    </div>\r\n  </main>\r\n\r\n  <div id=\"storyData\">\r\n    {{STORY_DATA}}\r\n  </div>\r\n\r\n  <script>\r\n    const recognizedNames = JSON.parse(localStorage.getItem(\"recognizedNames\") || \"[]\");\r\n    const nameRegex = /@(\\w+)/g;\r\n\r\n    function displayUnrecognizedNames(names) {\r\n      const unrecognizedDiv = document.getElementById(\"unrecognizedNames\");\r\n      unrecognizedDiv.innerHTML = \"\";\r\n\r\n      names.forEach(name => {\r\n        const nameDiv = document.createElement(\"li\");\r\n        nameDiv.textContent = name;\r\n\r\n        const addButton = document.createElement(\"button\");\r\n        addButton.textContent = \"Add to Names\";\r\n        addButton.onclick = () => addToRecognizedNames(name);\r\n\r\n        nameDiv.appendChild(addButton);\r\n        unrecognizedDiv.appendChild(nameDiv);\r\n      });\r\n    }\r\n\r\n    function addToRecognizedNames(name) {\r\n      recognizedNames.push(name);\r\n      localStorage.setItem(\"recognizedNames\", JSON.stringify(recognizedNames));\r\n      findUnrecognizedNames();\r\n    }\r\n\r\n    function findUnrecognizedNames() {\r\n      const text = document.getElementById(\"output\").innerText\r\n      const unrecognized = {};\r\n      [...text.matchAll(nameRegex)].forEach(match => {\r\n        if (recognizedNames.includes(match[1])) return\r\n        unrecognized[match[1]] = true\r\n      });\r\n\r\n      displayUnrecognizedNames(Object.keys(unrecognized));\r\n    }\r\n\r\n    function copyText() {\r\n      const textToCopy = document.getElementById(\"output\").innerText;\r\n      const textarea = document.createElement(\"textarea\");\r\n      textarea.value = textToCopy;\r\n\r\n      document.body.appendChild(textarea);\r\n      textarea.select();\r\n      document.execCommand('copy');\r\n      document.body.removeChild(textarea);\r\n\r\n      const button = document.querySelector('button');\r\n      button.textContent = 'Copied to clipboard';\r\n      button.disabled = true\r\n\r\n      setTimeout(() => {\r\n        button.textContent = 'Copy output';\r\n        button.disabled = false\r\n      }, 1500);\r\n    }\r\n\r\n    parseTwineToLua();\r\n    findUnrecognizedNames(document.getElementById(\"output\").innerText);\r\n  </script>\r\n</body>\r\n\r\n</html>"
});