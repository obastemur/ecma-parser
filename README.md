### Ecmascript Parser

Ecmascript, Javascript instruction parser. Tested on popular Javascript modules (i.e. JQuery)

### How it works

- Download [JXcore](https://jxcore.com/downloads)
- type `jx install ecma-parser`
- You can also use `npm` directly to install

#### Sample Code:
```
var parser = require('ecma-parser');

var js_code = "\
  var x = 1;\
  var y = 2;\
  console.log(x + y);\
";

var bl = parser.parse("test.js", js_code);
parser.printBlocks(bl);
```

#### Output:
```
---> ROOT { x: {}, y: {} }
SPACE (1:1)
SET_VARIABLE 1:3
SPACE (1:6)
WORD: x (new_variable) (1:7)
SPACE (1:8)
EQUALS (1:9)
SPACE (1:10)
WORD: 1 (number) (1:11)
SEMI_COLON (1:12)
SPACE (1:13)
SET_VARIABLE 1:15
SPACE (1:18)
WORD: y (new_variable) (1:19)
SPACE (1:20)
EQUALS (1:21)
SPACE (1:22)
WORD: 2 (number) (1:23)
SEMI_COLON (1:24)
SPACE (1:25)
WORD: console (1:27)
DOT (1:34)
WORD: log (1:35)
PTS_OPEN (1:38)
WORD: x (1:39)
SPACE (1:40)
PLUS (1:41)
SPACE (1:42)
WORD: y (1:43)
PTS_CLOSE (1:44)
SEMI_COLON (1:45)
```

### API

#### .parse (string filename, string source_code)
Parse Javascript code and return instruction blocks

#### .printBlocks (blocks)
Print instruction blocks on console

#### .blockToCode (blocks, [optional] filename)
Return source code for the instruction block

#### Blocks
`.variables` : Scope variables  
`.subs` : Array of sub instructions or blocks  
`.type` : Instruction type  
`.index` : Instruction start index  
`.length` : Length of instruction
`.repeats` : If `true`, delimiter should repeat on output `.length` times
`.delimiter` : Instruction identifier  
`.dataType` : Data type of the instruction block  
`.rowIndex` : Row index of the instruction  
`.columnIndex` : Column index of the instruction  
`.getData()` : Get the string data from the instruction  
`.getPreviousBlock(noskip)` : Returns previous instruction block (None space, comment, new line or semi colon)  
`.getNextBlock(noskip)` : Returns previous instruction block (None space, comment, new line or semi colon)  

* set noskip = true to get next or previous block regardless from it's type

### Testing

Use `parse_folder.js` under samples folder. (*nix only)

i.e.
```
jx samples/parse_folder.js jquery.1.1.min.x.js
```

### License
The MIT License (MIT)

Copyright (c) 2015 Oguz Bastemur

### Contribution
This particular project is intended to parse EcmaScript 6 compliant Javascript code. Feel free to contribute 
under the MIT and intention of this project.
