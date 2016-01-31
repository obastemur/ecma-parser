/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var commons = require('./commons');
var types = commons.types;
var Block = commons.block;
var inspectScope = require('./fn').scopeAnalysis;
var inspectVariables = require('./fn').variableAnalysis;
var root;  // root block

var createBlock = function(delimiter) {
  var bl = new Block();
  var tp = types[delimiter];
  if (tp) {
    for(var o in tp) {
      bl[o] = tp[o];
    }
  }

  bl.startIndex = commons.activeIndex;
  bl.delimiter = delimiter;
  bl.columnIndex = commons.columnIndex;
  bl.rowIndex = commons.rowIndex;
  bl.length = 0;

  return bl;
};

var captureString = function captureString(delimiter) {
  var len = commons.code.length;
  var bl = createBlock(delimiter);
  bl.parent = commons.activeBlock;
  bl.parentIndex = commons.activeBlock.subs.length;
  commons.activeBlock.subs.push(bl);

  var open = false;
  commons.activeIndex++;
  while (commons.activeIndex < len) {
    var ch = commons.code.charAt(commons.activeIndex);

    commons.columnIndex++;

    if (ch == delimiter && !open) {
      bl.endIndex = commons.activeIndex;
      return;
    }

    if (ch == "\\") {
      open = !open;
    } else if (open) {
      open = false;
    }

    commons.activeIndex++;
  }

  commons.activeError =
      new SyntaxError("[captureString] Open ended String detected at " +
                      bl.rowIndex + ":" + bl.columnIndex);
};

var captureComment = function captureComment(delimiter) {
  var len = commons.code.length;
  var bl = createBlock(delimiter);
  bl.parent = commons.activeBlock;
  bl.parentIndex = commons.activeBlock.subs.length;
  commons.activeBlock.subs.push(bl);

  commons.activeIndex += 2;
  commons.columnIndex++;

  while (commons.activeIndex < len) {
    var ch = commons.code.charAt(commons.activeIndex);
    var nc = commons.activeIndex + 1 < len
                 ? commons.code.charAt(commons.activeIndex + 1)
                 : null;

    var ch_new_line = types.hasOwnProperty(ch) && types[ch].NEW_LINE;

    if (ch_new_line) {
      commons.columnIndex = 0;
      commons.rowIndex++;
    } else {
      commons.columnIndex++;
    }

    if (delimiter == "//" && ch_new_line) {
      bl.endIndex = commons.activeIndex;
      return;
    }

    if (delimiter == "/*" && ch == "*" && nc == "/") {
      commons.activeIndex++;
      commons.columnIndex++;
      bl.endIndex = commons.activeIndex;
      return;
    }

    commons.activeIndex++;
  }

  if (delimiter == "/*") {
    commons.activeError =
        new SyntaxError("[captureComment] Open ended Comment detected at " +
                        bl.rowIndex + ":" + bl.columnIndex);
  }
};

var checkWordType = function checkWordType(bl) {
  var str =
      commons.code.substr(bl.startIndex, (bl.endIndex - bl.startIndex) + 1);

  if (types.hasOwnProperty(str)) {
    var tp = types[str];
    if (tp) {
      for(var o in tp) {
        bl[o] = tp[o];
      }
    }
  } else {
    bl.name = commons.BIT_NAME.WORD;

    var parsed = parseFloat(str);
    var number = false;
    if (parsed != 0 && !isNaN(parsed)) {
      number = true;
    }

    if (!number)
      if (parsed === 0 && str.replace(/[0]+/g, "").trim().length === 0)
        number = true;

    if (number) bl.type = commons.BIT_TYPE.NUMBER;
  }

  if (!bl.type) {
    bl.type = commons.BIT_TYPE.WORD;
  }

  bl.delimiter = str;
};

var captureWord = function captureWord(delimiter) {
  var len = commons.code.length;
  var bl = createBlock(delimiter);
  bl.parent = commons.activeBlock;
  bl.parentIndex = commons.activeBlock.subs.length;
  commons.activeBlock.subs.push(bl);

  commons.activeIndex++;
  while (commons.activeIndex < len) {
    var ch = commons.code.charAt(commons.activeIndex);

    if (!(/^[a-z0-9]+$/i.test(ch))) {
      bl.endIndex = commons.activeIndex - 1;
      commons.activeIndex--;
      checkWordType(bl);
      return;
    }

    if (ch == "\n") {
      commons.columnIndex = 0;
      commons.rowIndex++;
    } else {
      commons.columnIndex++;
    }

    commons.activeIndex++;
  }

  bl.endIndex = commons.activeIndex - 1;
  checkWordType(bl);
};

function Scope(delimiter) {
  this.scoping = {
    "{" : 0,
    "[" : 0,
    "(" : 0
  };

  this.scoping[delimiter] = 1;

  this.block = createBlock(delimiter);
  this.block.scope = this;

  this.block.parent = commons.activeBlock;
  this.block.parentIndex = commons.activeBlock.subs.length;
  commons.activeBlock.subs.push(this.block);

  commons.activeBlock = this.block;
}

Scope.check = function check(char) {
  var close_scope = {
    "}" : "{",
    "]" : "[",
    ")" : "("
  };

  var open_scope = {
    "[" : 1,
    "{" : 1,
    "(" : 1
  };

  var scope = commons.activeBlock.scope;

  if (open_scope.hasOwnProperty(char)) {
    return new Scope(char);
  }

  if (!scope) {
    if (close_scope.hasOwnProperty(char)) {
      commons.activeError = new SyntaxError(
          "Closing scope '" + char + "' without opening it at " +
          commons.rowIndex + ":" + commons.columnIndex);
    }

    return;
  }

  if (close_scope.hasOwnProperty(char)) {
    scope.scoping[close_scope[char]]--;
    if (close_scope[char] == scope.block.delimiter)
      if (scope.scoping[close_scope[char]] == 0) {
        // close scope
        scope.block.endIndex = commons.activeIndex;
        inspectScope(commons.activeBlock);
        commons.activeBlock = scope.block.parent;
      }

    return true;
  }
};

var newBlock = function(char, tp) {
  var bl = createBlock(char);
  bl.endIndex = commons.activeIndex;
  bl.parent = commons.activeBlock;
  bl.parentIndex = commons.activeBlock.subs.length;
  commons.activeBlock.subs.push(bl);
};

var isSign = function(char) {
  if (!types.hasOwnProperty(char) || types[char].type != commons.BIT_TYPE.OPERATOR) return false;

  return true;
};

var captureSigns = function captureSigns(pre_char, char) {
  if (!isSign(char)) return false;

  var bl;
  if (isSign(pre_char) &&
      isSign(pre_char + char)) {
    bl = commons.activeBlock.subs[commons.activeBlock.subs.length - 1];

    if (!types.hasOwnProperty(bl.delimiter + char)) {
      commons.activeError = new SyntaxError(
          "[captureSigns] `" + char + "` is following `" + bl.delimiter +
          "` at " + commons.rowIndex + ":" + commons.columnIndex);
      return false;
    }

    bl.endIndex = commons.activeIndex;
    bl.delimiter += char;
    bl.type = types[bl.delimiter].type;
    bl.name = types[bl.delimiter].name;
  } else {
    newBlock(char, types[char]);
  }

  return true;
};

var captureRegExp = function captureRegExp(prev_char) {
  var pbl;
  if (commons.activeBlock.subs.length)
    pbl = commons.activeBlock.subs[commons.activeBlock.subs.length - 1];

  var is_reg = false;

  if (pbl &&
      (types[pbl.delimiter].type == commons.BIT_TYPE.NO_OP || pbl.type == commons.BIT_TYPE.COMMENT))
    pbl = pbl.getPreviousBlock();

  if (!pbl || pbl.type == commons.BIT_TYPE.OPERATOR) {
    is_reg = true;
  }

  if (!is_reg && pbl && (
      pbl.type == commons.BIT_TYPE.OPERATOR || pbl.name == commons.BIT_NAME.JS_ELSE ||
      pbl.name == commons.BIT_NAME.JS_RETURN)) {
    is_reg = true;
  }

  if (is_reg) {
    var len = commons.code.length;
    var n = commons.activeIndex + 1;
    var open = false;

    while (n < len) {
      var ch = commons.code.charAt(n);

      if (!open) {
        if (ch == "/") break;

        if (ch == "\n") return false;
      }

      if (ch == "\\") {
        open = !open;
      } else if (open) {
        open = false;
      }
      n++;

      if (n - commons.activeIndex > 4096) {
        return false;
      }
    }
    open = false;

    var pts_watch = {
      check : function(x) {
        if (pts_watch[x]) pts_watch[x]--;
      },
      "[" : 0,
      "(" : 0,
      "0]" : function() { return pts_watch.check("["); },
      "0)" : function() { return pts_watch.check("("); },
      inScope : function() {
        return pts_watch["["] != 0 ||
               pts_watch["("] != 0;
      }
    };

    var bl = Block();
    bl.delimiter = "/";
    bl.type = commons.types.REGEXP;
    bl.name = commons.BIT_NAME.REGEXP_OPERATOR;

    bl.columnIndex = commons.columnIndex;
    bl.rowIndex = commons.rowIndex;
    bl.startIndex = commons.activeIndex;
    bl.endIndex = commons.activeIndex;
    bl.parent = commons.activeBlock;
    bl.parentIndex = commons.activeBlock.subs.length;
    commons.activeBlock.subs.push(bl);

    commons.activeIndex++;
    while (commons.activeIndex < len) {
      var ch = commons.code.charAt(commons.activeIndex);

      if (!open) {
        var ch_new_line = types.hasOwnProperty(ch) && types[ch].NEW_LINE;
        if (ch_new_line) {
          commons.columnIndex = 0;
          commons.rowIndex++;
          break;
        } else {
          commons.columnIndex++;
        }

        // sub scope check
        // check if we are inside a [], {} or ()
        if (pts_watch.hasOwnProperty(ch)) {
          pts_watch[ch]++;
          commons.activeIndex++;
          continue;
        }

        if (pts_watch.hasOwnProperty("0" + ch)) {
          pts_watch["0" + ch]();
          commons.activeIndex++;
          continue;
        }

        // loop until the instruction exits the scope
        if (pts_watch.inScope()) {
          if (ch == "\\") {
            open = !open;
          } else if (open) {
            open = false;
          }
          commons.activeIndex++;
          continue;
        }
        // sub scope check ends here

        if (!open && ch == "/") {
          if (commons.activeIndex + 1 < len) {
            ch = commons.code.charAt(commons.activeIndex + 1);
            if (/[a-z]/i.test(ch)) {
              commons.activeIndex++;
            }
            bl.endIndex = commons.activeIndex;
            return true;
          }
        }
      } else {
        commons.columnIndex++;
      }

      if (ch == "\\") {
        open = !open;
      } else if (open) {
        open = false;
      }
      commons.activeIndex++;
    }

    commons.activeError =
        new SyntaxError("[captureRegExp] Open ended regular expression at " +
                        bl.rowIndex + ":" + bl.columnIndex);
    return true;
  }

  return false;
};

var next = function next(pre_char, char, next_char) {
  if (types.hasOwnProperty(char) && types[char].type == commons.BIT_TYPE.NO_OP) {
    var pbl;

    if (commons.activeBlock.subs.length)
      pbl = commons.activeBlock.subs[commons.activeBlock.subs.length - 1];

    if (pbl && pbl.name == types[char].name) {
      pbl.endIndex++;
    } else {
      newBlock(char, types[char]);
    }
    return;
  }

  if (char == "'" || char == "\"") {
    return captureString(char);
  }

  if (char == "/" && (next_char == "*" || next_char == "/")) {
    return captureComment(char + next_char);
  }

  if (/^[$~_a-z0-9]+$/i.test(char)) {
    return captureWord(char);
  }

  if (char == '/') {
    if (captureRegExp(pre_char)) return;
  }

  if (Scope.check(char)) return;

  if (captureSigns(pre_char, char)) return;

  newBlock(char, {type: commons.BIT_TYPE.UNKOWN, name: commons.BIT_NAME.UNKOWN});

  commons.activeError = new SyntaxError("Unknown char `"+char+"` ("
    + char.charCodeAt(0) + ") at " + commons.rowIndex + ":" + commons.columnIndex);
};

exports.parse = function(filename, code) {
  // make sure not using Buffer
  commons.code = code + "";

  commons.rowIndex = 0;
  commons.columnIndex = 0;
  commons.activeIndex = 0;
  commons.activeError = null;

  root = new Block();
  root.rowIndex = 0;
  root.columnIndex = 0;
  root.name = commons.BIT_NAME.ROOT;
  root.type = commons.BIT_TYPE.SCOPE;
  root.scopeType = commons.scopeTypes.GLOBAL_SCOPE;
  commons.rootBlock = root;
  commons.activeBlock = root;

  for (length = commons.code.length; commons.activeIndex < length;
       commons.activeIndex++) {
    var pc = commons.activeIndex == 0
                 ? null
                 : commons.code.charAt(commons.activeIndex - 1);
    var nc = commons.activeIndex < length - 1
                 ? commons.code.charAt(commons.activeIndex + 1)
                 : null;
    var ch = commons.code.charAt(commons.activeIndex);

    next(pc, ch, nc);

    if (ch == "\n") {
      commons.columnIndex = 0;
      commons.rowIndex++;
    } else {
      commons.columnIndex++;
    }

    if (commons.activeError) {
      if (exports.errorAsWarning) {
        console.error(commons.activeError);
        commons.activeError = null;
      } else {
        throw commons.activeError;
      }
    }
  }

  inspectVariables(root);
  return root;
};

var writer = require('./writer');
exports.blockToCode = writer.blockToCode;
exports.printBlocks = writer.printBlocks;

exports.types = commons.types;
exports.signs = commons.signs;

exports.errorAsWarning = false;