### Ecmascript Parser

Ecmascript instruction parser (Lexical, Syntactical) . Tested on popular Javascript files (i.e. JQuery)

### How it works

- Download [JXcore](https://jxcore.com/downloads)
- type `jx install ecma-parser` or `npm install ecma-parser`

#### Sample Code:
```
var parser = require('ecma-parser');

var js_code = "\
var x = 1;\n\
var y = 2;\n\
{\n\
  console.log(x + y);\n\
}";

var bl = parser.parse("test.js", js_code);
parser.printBlocks(bl);
```

#### Output:
```
---> ROOT
JS_VARIABLE_VAR 0:0 var
SPACE 0:3
WORD 0:4 x
SPACE 0:5
EQUALS 0:6
SPACE 0:7
NUMBER 0:8 1
SEMI_COLON 0:9
NEW_LINE 0:10
JS_VARIABLE_VAR 1:0 var
SPACE 1:3
WORD 1:4 y
SPACE 1:5
EQUALS 1:6
SPACE 1:7
NUMBER 1:8 2
SEMI_COLON 1:9
NEW_LINE 1:10
SCOPE 2:0
    ---> SCOPE
    NEW_LINE 2:1
    SPACE 3:0
    WORD 3:2 console
    DOT 3:9
    WORD 3:10 log
    PTS_OPEN 3:13
        ---> PTS_OPEN
        WORD 3:14 x
        SPACE 3:15
        PLUS 3:16
        SPACE 3:17
        WORD 3:18 y
    <--- PTS_OPEN
    SEMI_COLON 3:20
    NEW_LINE 3:21
<--- SCOPE
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
`.subs` : Array of the items from a scope -> {}, [], ()
`.type` : Instruction type  
`.startIndex` : Instruction start index [on the file]
`.endIndex` : Instruction end index [on the file]
`.delimiter` : Instruction identifier
`.rowIndex` : Row index of the instruction  
`.columnIndex` : Column index of the instruction  
`.getData()` : Get the string data from the instruction (name of the variable for WORDs)  
`.isNewDefinition()` : Is this block represents a new named definition?  
`.isProperty()` : Is this block represents an Object property ?  
`.updateName(name)` : Update the variable name (only for the current instance)  
`.getPreviousBlock(noskip)` : Returns previous instruction block (None space, comment, new line or semi colon)   
`.getNextBlock(noskip)` : Returns previous instruction block (None space, comment, new line or semi colon)  

* set noskip = true to get next or previous block regardless from it's type

### Samples

Visit samples folder. i.e Use `parse_folder.js` under samples folder. (*nix only)

```
jx samples/parse_folder.js jquery.1.1.min.x.js
```

### License
The MIT License (MIT)

Copyright (c) 2015 Oguz Bastemur

### Contribution
This particular project is intended to parse EcmaScript 6 compliant Javascript code. 
Feel free to contribute under the MIT and intention of this project.
