/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var ASSERT = function(cond, message) {
  if (!cond)
    throw new Error(message);
};

var types = {
  "++" : "INCREMENT",
  "--" : "DECREASE",
  "+=" : "PLUS_EQUAL",
  "*=" : "MULTIPLY_EQUAL",
  "-=" : "MINUS_EQUAL",
  "/=" : "DIV_EQUAL",
  "^=" : "BT_EQUAL",
  "|=" : "MOD_EQUAL",
  "~" : "BIT_NOT",
  "~~" : "BIT_NOT_NOT",
  "~=" : "BIT_NOT_EQUAL",
  "WORD" : "WORD",
  " " : "SPACE",
  '"' : "STRING",
  "'" : "STRING",
  "//" : "COMMENT",
  "/*" : "COMMENT",
  "function" : "FUNCTION",
  "=>" : "ARROW_FUNCTION",
  "{" : "SCOPE",
  "}" : "SCOPE_END", // skip only
  ":" : "COLON",
  ";" : "SEMI_COLON",
  "+" : "PLUS",
  "%" : "PERCENTAGE",
  "%=" : "PERCENTAGE_EQUAL",
  "^" : "BT_SIGN",
  "/" : "DIV",
  "-" : "MINUS",
  "," : "COMMA",
  "*" : "MULTIPLY",
  "|" : "MOD",
  "||" : "OR",
  "&" : "AND_OPERATOR",
  "&&" : "AND",
  "<" : "LOWER_THAN",
  "<=" : "LOWER_THAN_EQUAL",
  ">" : "BIGGER_THAN",
  ">=" : "BIGGER_THAN_EQUAL",
  "." : "DOT",
  "!" : "NOT",
  "=" : "EQUALS",
  "==" : "IF_EQUALS",
  "===" : "IF_STRONG_EQUALS",
  "!=" : "IF_DIFFERENT",
  "!==" : "IF_STRONG_DIFFERENT",
  "(" : "PTS_OPEN",
  ")" : "PTS_CLOSE",
  "\n" : "NEW_LINE",
  "\r" : "R_LINE",
  "[" : "ARRAY_OPEN",
  "]" : "ARRAY_CLOSE",
  "if" : "JS_IF",
  "else" : "JS_ELSE",
  "for" : "JS_FOR",
  "while" : "JS_WHILE",
  "switch" : "JS_SWITCH",
  "do" : "JS_DO",
  "case" : "JS_CASE",
  "return" : "JS_RETURN",
  "break" : "JS_BREAK",
  "throw" : "JS_THROW",
  "try" : "JS_TRY",
  "catch" : "JS_CATCH",
  "typeof" : "JS_TYPEOF",
  "instanceof" : "JS_INSTANCEOF",
  "\t" : "TAB",
  "var" : "SET_VARIABLE_VAR",
  "let" : "SET_VARIABLE_LET",
  "const" : "SET_VARIABLE_CONST",
  "?" : "LINER_IF",
  "Date" : "JS_DATE",
  "this" : "JS_THIS",
  "Error" : "JS_ERROR",
  "TypeError" : "JS_ERROR",
  "SyntaxError" : "JS_ERROR",
  "RangeError" : "JS_ERROR",
  "ReferenceError" : "JS_ERROR",
  "EvalError" : "JS_ERROR",
  "URIError" : "JS_URI_ERROR",
  "setTimeout" : "JS_TIMER",
  "setInterval" : "JS_TIMER",
  "clearInterval" : "JS_TIMER",
  "Array" : "JS_ARRAY",
  "ArrayBuffer" : "JS_ARRAY_BUFFER",
  "Object" : "JS_OBJECT",
  "String" : "JS_STRING",
  "Number" : "JS_NUMBER",
  "Boolean" : "JS_BOOLEAN",
  "Math" : "JS_MATH",
  "new" : "JS_NEW",
  "arguments" : "JS_ARGUMENTS",
  "eval" : "JS_EVAL",
  "class" : "JS_CLASS",
  "default" : "JS_DEFAULT",
  "NaN" : "JS_NAN",
  "isNaN" : "JS_ISNAN",
  "parseFloat" : "JS_PARSE_FLOAT",
  "parseInt" : "JS_PARSE_INT",
  "null" : "JS_NULL",
  "undefined" : "JS_UNDEFINED",
  "true" : "JS_TRUE",
  "false" : "JS_FALSE",
  "continue" : "JS_CONTINUE",
  "finally" : "JS_FINALLY",
  "RegExp" : "JS_REGEXP",
  "delete" : "JS_DELETE",
  "JSON" : "JS_JSON",
  "isFinite" : "JS_IS_FINITE",
  "escape" : "JS_ESCAPE",
  "unescape" : "JS_UNESCAPE",
  "Infinity" : "JS_INFINITY",
  "decodeURI" : "JS_DECODE_URI",
  "decodeURIComponent" : "JS_DECODE_URI_COMPONENT",
  "encodeURI" : "JS_ENCODE_URI",
  "encodeURIComponent" : "JS_ENCODE_URI_COMPONENT",
  "debugger" : "JS_DEBUGGER",
  "export" : "export",
  "import" : "import",
  "in" : "JS_IN",
  "with" : "JS_WITH",
  "yield" : "JS_YIELD"
};

var signs = {
  "++" : "INCREMENT",
  "--" : "DECREASE",
  "+=" : "PLUS_EQUAL",
  "*=" : "MULTIPLY_EQUAL",
  "-=" : "MINUS_EQUAL",
  "/=" : "DIV_EQUAL",
  "|=" : "MOD_EQUAL",
  "{" : "SCOPE",
  "}" : "SCOPE_END", // skip only
  ":" : "COLON",
  ";" : "SEMI_COLON",
  "+" : "PLUS",
  "%" : "PERCENTAGE",
  "%=" : "PERCENTAGE_EQUAL",
  "/" : "DIV",
  "-" : "MINUS",
  "," : "COMMA",
  "*" : "MULTIPLY",
  "|" : "MOD",
  "||" : "OR",
  "&" : "AND_OPERATOR",
  "&&" : "AND",
  "<" : "LOWER_THAN",
  "<=" : "LOWER_THAN_EQUAL",
  ">" : "BIGGER_THAN",
  ">=" : "BIGGER_THAN_EQUAL",
  "=>" : "ARROW_FUNCTION",
  "." : "DOT",
  "!" : "NOT",
  "=" : "EQUALS",
  "==" : "IF_EQUALS",
  "===" : "IF_STRONG_EQUALS",
  "!=" : "IF_DIFFERENT",
  "!==" : "IF_STRONG_DIFFERENT",
  "(" : "PTS_OPEN",
  ")" : "PTS_CLOSE",
  "[" : "ARRAY_OPEN",
  "]" : "ARRAY_CLOSE",
  "?" : "LINER_IF",
  "^" : "BT_SIGN",
  "^=" : "BT_EQUAL"
};

var reverse_signs = {};

for (var o in types) {
  if (!signs.hasOwnProperty(o)) {
    continue;
  }
  reverse_signs[signs[o]] = o;
}

exports.signs = reverse_signs;

exports.prexp = {
  "COMMA" : ",",
  "MOD" : "|",
  "NOT" : "!",
  "OR" : "||",
  "AND" : "&&",
  "SEMI_COLON" : ";",
  "EQUALS" : "=",
  "PTS_OPEN" : "(",
  "COLON" : ":",
  "PLUS_EQUAL" : "+=",
  "MULTIPLY_EQUAL" : "*=",
  "MINUS_EQUAL" : "-=",
  "DIV_EQUAL" : "/=",
  "MOD_EQUAL" : "|=",
  "ARRAY_OPEN" : "[",
  "IF_EQUALS" : "==",
  "IF_STRONG_EQUALS" : "===",
  "IF_DIFFERENT" : "!=",
  "IF_STRONG_DIFFERENT" : "!==",
  "LOWER_THAN" : "<",
  "LOWER_THAN_EQUAL" : "<=",
  "BIGGER_THAN" : ">",
  "BIGGER_THAN_EQUAL" : ">=",
  "RETURN" : "return",
  "LINER_IF" : "?",
  "ELSE" : "else",
  "PLUS" : "+",
  "MINUS" : "-",
  "MULTIPLY" : "*",
  "PERCENTAGE" : "%"
};

exports.headlessScopes = {
  "IF" : "if",
  "FOR" : "for",
  "WHILE" : "while"
};

exports.noCode = {
  "R_LINE" : "\r",
  "SPACE" : " ",
  "TAB" : "\t",
  "NEW_LINE" : "\n",
  "COMMENT" : "//"
};

exports.types = types;

var list = {};

for (var o in types) {
  if (!types.hasOwnProperty(o)) {
    continue;
  }
  list[types[o]] = o;
}

exports.list = list;

exports.code = "";
exports.activeWord = "";
exports.activeBlock = null;
exports.columnIndex = 1;
exports.rowIndex = 1;

function block() {
  if (!(this instanceof block))
    return new block();
  this.columnIndex = exports.columnIndex;
  this.rowIndex = exports.rowIndex;
  this.parentIndex = null;
  this.type = null;
  this.delimiter = null;
  this.variables = {};

  this.index = null;
  this.length = null;

  this.subs = [];
  this.parent = null;

  var _this = this;
  this.getData = function() {
    if (_this.index == null || _this.length == null)
      return list[this.type];

    if (_this.newName)
      return _this.newName;

    return exports.code.substr(_this.index - 1, _this.length);
  };

  this.findType = function() {
    if (_this._dataTypeFound)
      return _this.dataType;

    var str = _this.getData();
    _this._dataTypeFound = true;

    if (str) {
      str = str.trim();
    } else {
      _this.dataType = 'undefined';
      return _this.dataType;
    }

    if (str == 'null') {
      _this.dataType = 'null';
    } else if (str == 'true' || str == 'false')
      _this.dataType = 'boolean';
    else if (!isNaN(parseInt(str)) || !isNaN(parseFloat(str))) {
      _this.dataType = "number";
    } else {
      var prev = _this.getPreviousBlock();

      if (prev && (prev.type.indexOf("SET_VARIABLE_") === 0 ||
        prev.type == "FUNCTION")) {
        if (_this.parent) {
          _this.parent.variables[str] = prev.type == "FUNCTION" ? {function_name: true} : {};
        }
        _this.dataType = "new_variable";
        return _this.dataType;
      } else if (prev) {
        // check param1 in -> function ?? (param1
        if (prev.type == "PTS_OPEN") {
          var ptmp = prev.getPreviousBlock();
          if (ptmp && ptmp.type == "WORD")
            ptmp = ptmp.getPreviousBlock();

          if (ptmp && ptmp.type == "FUNCTION") {
            if (_this.parent) {
              _this.parent.variables[str] = {
                argument_name : true
              };
            }
            _this.dataType = "new_variable";
            return _this.dataType;
          }
        } else if (prev.type == "COMMA") {
          var ptmp = prev.getPreviousBlock();
          var pass = ptmp && ptmp.isNewDefinition();

          if (!pass) {
            // check y in -> var x = 3, y..
            while (ptmp) {
              ptmp = ptmp.getPreviousBlock();
              if (!ptmp)
                break;

              if (ptmp.type.indexOf("SET_VARIABLE_") === 0) {
                pass = true;
                break;
              }

              // do we need to check this ?
              // TODO remove this?
              if (ptmp.type == "FUNCTION") {
                is_arg = true;
                pass = true;
                break;
              }

              // prevent q being caught at -> for(;;i++, q++)
              if (ptmp.delimiter == ";")
                break;
            }
          }
          if (ptmp && pass) {
            var is_arg = false;
            // check if it's function argument or new variable
            while (ptmp) {
              ptmp = ptmp.getPreviousBlock();
              if (!ptmp)
                break;

              // any of the below shouldn't happen!
              ASSERT(
                !(ptmp.delimiter == ":" || ptmp.delimiter == "}" ||
                ptmp.delimiter == ";"),
                "TYPE_CHECK: at this point delimiter shouldn't be :, }, or ;");

              if (ptmp.type == "JS_FOR")
                break;
              if (ptmp.type == "EQUALS")
                break;
              if (ptmp.type == "FUNCTION") {
                is_arg = true;
                break;
              }
            }

            if (_this.parent) {
              _this.parent.variables[str] = is_arg ? {argument_name: true} : {};
            }
            _this.dataType = "new_variable";
            return _this.dataType;
          }
        }
      }
      _this.dataType = "unknown";
    }

    return _this.dataType;
  };

  this.isNewDefinition = function() {
    return _this.dataType == "new_variable";
  };

  this.isProperty = function() {
    if (_this.type != "WORD")
      return false;

    var bl = _this.getPreviousBlock();

    if (bl) {
      if (bl.delimiter == ".")
        return true;
      if (bl.delimiter == ":")
        return false;
      if (signs.hasOwnProperty(bl.delimiter) && bl.delimiter != ",")
        return false;
      if (bl.delimiter == ",") {
        var nbl = _this.getNextBlock();
        return (nbl && nbl.delimiter == ":");
      }
    }

    if (_this.parent) {
      var type = _this.parent.findType();

      if (type == "object")
        return true;

      var nbl = _this.getNextBlock();
      if (nbl && nbl.delimiter == ":")
        return true;
    }

    return false;
  };

  this.updateName = function(name) { _this.newName = name; };

  // returns none space etc previous item
  // --> returns undefined if
  // a - no item
  this.getPreviousBlock = function(dont_skip) {
    if (!_this.parent || _this.parentIndex === null || _this.parentIndex === 0)
      return;

    var bl = _this.parent.subs;
    for (var i = _this.parentIndex - 1; i >= 0; i--) {
      if (!dont_skip && exports.noCode[bl[i].type])
        continue;
      return bl[i];
    }
  };

  // returns none space etc next item
  // --> returns undefined if
  // a - no item
  this.getNextBlock = function(dont_skip) {
    var ln = _this.parent.subs.length - 1;
    if (!_this.parent || _this.parentIndex === null ||
      _this.parentIndex + 1 > ln)
      return;

    var bl = _this.parent.subs;
    for (var i = _this.parentIndex + 1; i <= ln; i++) {
      if (!dont_skip && exports.noCode[bl[i].type])
        continue;
      return bl[i];
    }
  }
}

exports.block = block;