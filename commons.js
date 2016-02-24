/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var ASSERT = function(cond, message) {
  if (!cond)
    throw new Error(message);
};


var scopeTypes = exports.scopeTypes = {
  INNER_PROCEDURE           :   1,

  SCOPE_EMPTY               :   2,
  SCOPE_FUNCTION            :   3,
  SCOPE_FOR                 :   4,
  SCOPE_WHILE               :   5,
  SCOPE_DO                  :   6,
  SCOPE_IF                  :   7,
  SCOPE_ELSE                :   8,

  ARRAY                     :   9,

  OBJECT_DEFINITION         :  10,

  ARGS_FUNCTION_DEFINITION  :  11,
  ARGS_FUNCTION_CALL        :  12,
  ARGS_FOR                  :  13,
  ARGS_IF                   :  14,
  ARGS_WHILE                :  15,

  GLOBAL_SCOPE              :  99
};

var BIT_NAME = exports.BIT_NAME = {
  ROOT                : 999,
  INCREASE            :   1,
  DECREASE            :   2,
  PLUS_EQUAL          :   3,
  MULTIPLY_EQUAL      :   4,
  MINUS_EQUAL         :   5,
  DIV_EQUAL           :   6,
  BT_EQUAL            :   7,
  MOD_EQUAL           :   8,
  BIT_NOT             :   9,
  BIT_NOT_NOT         :  10,
  BIT_NOT_EQUAL       :  11,
  WORD                :  12,
  STRING              :  13,
  COMMENT             :  14,
  JS_FUNCTION         :  15,
  ARROW_FUNCTION      :  16,
  SCOPE               :  17,
  SCOPE_END           :  18,
  COLON               :  19,
  SEMI_COLON          :  20,
  PLUS                :  21,
  PERCENTAGE          :  22,
  PERCENTAGE_EQUAL    :  23,
  BT_SIGN             :  24,
  DIV                 :  25,
  MINUS               :  26,
  COMMA               :  27,
  MULTIPLY            :  28,
  MOD                 :  29,
  OR                  :  30,
  AND_OPERATOR        :  31,
  AND                 :  32,
  LOWER_THAN          :  33,
  LOWER_THAN_EQUAL    :  34,
  BIGGER_THAN         :  35,
  BIGGER_THAN_EQUAL   :  36,
  DOT                 :  37,
  EQUALS              :  38,
  IF_EQUALS           :  39,
  IF_STRONG_EQUALS    :  40,
  IF_DIFFERENT        :  41,
  IF_STRONG_DIFFERENT :  42,
  PTS_OPEN            :  43,
  PTS_CLOSE           :  44,
  ARRAY_OPEN          :  45,
  ARRAY_CLOSE         :  46,
  JS_IF               :  47,
  JS_ELSE             :  48,
  JS_FOR              :  49,
  JS_WHILE            :  50,
  JS_SWITCH           :  51,
  JS_DO               :  52,
  JS_CASE             :  53,
  JS_RETURN           :  54,
  JS_BREAK            :  55,
  JS_THROW            :  56,
  JS_TRY              :  57,
  JS_CATCH            :  58,
  JS_TYPEOF           :  59,
  JS_INSTANCEOF       :  60,
  JS_VARIABLE_VAR     :  61,
  JS_VARIABLE_LET     :  62,
  JS_VARIABLE_CONST   :  63,
  LINER_IF            :  64,
  JS_DATE             :  65,
  JS_THIS             :  66,
  JS_ERROR            :  67,
  JS_TIMER            :  68,
  JS_ARRAY            :  69,
  JS_ARRAY_BUFFER     :  70,
  JS_OBJECT           :  71,
  JS_STRING           :  72,
  JS_NUMBER           :  73,
  JS_BOOLEAN          :  74,
  JS_MATH             :  75,
  JS_NEW              :  76,
  JS_ARGUMENTS        :  77,
  JS_EVAL             :  78,
  JS_CLASS            :  79,
  JS_DEFAULT          :  80,
  JS_NAN              :  81,
  JS_ISNAN            :  82,
  JS_PARSE_FLOAT      :  83,
  JS_PARSE_INT        :  84,
  JS_NULL             :  85,
  JS_UNDEFINED        :  86,
  JS_TRUE             :  87,
  JS_FALSE            :  88,
  JS_CONTINUE         :  89,
  JS_FINALLY          :  90,
  JS_REGEXP           :  91,
  JS_DELETE           :  92,
  JS_JSON             :  93,
  JS_IS_FINITE        :  94,
  JS_ESCAPE           :  95,
  JS_UNESCAPE         :  96,
  JS_INFINITY         :  97,
  JS_DECODE_URI       :  98,
  JS_DECODE_URI_CMP   :  99,
  JS_ENCODE_URI       : 100,
  JS_ENCODE_URI_CMP   : 101,
  JS_DEBUGGER         : 102,
  JS_EXPORT           : 103,
  JS_IMPORT           : 104,
  JS_IN               : 105,
  JS_WITH             : 106,
  JS_YIELD            : 107,
  CR_LINE             : 108,
  SPACE               : 109,
  TAB                 : 110,
  NEW_LINE            : 111,
  V_TAB               : 112,
  FORM_FEED           : 113,
  BOM                 : 114,
  LINE_SEPARATOR      : 115,
  PG_SEPARATOR        : 116,
  NOT                 : 117,
  REGEXP_OPERATOR     : 118,
  UNKOWN              : 119
};

var BIT_TYPE = exports.BIT_TYPE = {
  OPERATOR            :   1,
  WORD                :   2,
  STRING              :   3,
  COMMENT             :   4,
  NO_OP               :   5,
  SCOPE               :   6,
  JS_WORD             :   7,
  NUMBER              :   8,
  REGEXP              :   9,
  BOOLEAN             :  10,
  UNKNOWN             :  11
};

var types = {
  "++"                 : { name: BIT_NAME.INCREASE,            delimiter: "++",                 type: BIT_TYPE.OPERATOR },
  "--"                 : { name: BIT_NAME.DECREASE,            delimiter: "--",                 type: BIT_TYPE.OPERATOR },
  "+="                 : { name: BIT_NAME.PLUS_EQUAL,          delimiter: "+=",                 type: BIT_TYPE.OPERATOR },
  "*="                 : { name: BIT_NAME.MULTIPLY_EQUAL,      delimiter: "*=",                 type: BIT_TYPE.OPERATOR },
  "-="                 : { name: BIT_NAME.MINUS_EQUAL,         delimiter: "-=",                 type: BIT_TYPE.OPERATOR },
  "/="                 : { name: BIT_NAME.DIV_EQUAL,           delimiter: "/=",                 type: BIT_TYPE.OPERATOR },
  "^="                 : { name: BIT_NAME.BT_EQUAL,            delimiter: "^=",                 type: BIT_TYPE.OPERATOR },
  "|="                 : { name: BIT_NAME.MOD_EQUAL,           delimiter: "|=",                 type: BIT_TYPE.OPERATOR },
  "~"                  : { name: BIT_NAME.BIT_NOT,             delimiter: "~",                  type: BIT_TYPE.OPERATOR },
  "~~"                 : { name: BIT_NAME.BIT_NOT_NOT,         delimiter: "~~",                 type: BIT_TYPE.OPERATOR },
  "~="                 : { name: BIT_NAME.BIT_NOT_EQUAL,       delimiter: "~=",                 type: BIT_TYPE.OPERATOR },
  "+"                  : { name: BIT_NAME.PLUS,                delimiter: "+",                  type: BIT_TYPE.OPERATOR },
  "%"                  : { name: BIT_NAME.PERCENTAGE,          delimiter: "%",                  type: BIT_TYPE.OPERATOR },
  "%="                 : { name: BIT_NAME.PERCENTAGE_EQUAL,    delimiter: "%=",                 type: BIT_TYPE.OPERATOR },
  "^"                  : { name: BIT_NAME.BT_SIGN,             delimiter: "^",                  type: BIT_TYPE.OPERATOR },
  "/"                  : { name: BIT_NAME.DIV,                 delimiter: "/",                  type: BIT_TYPE.OPERATOR },
  "-"                  : { name: BIT_NAME.MINUS,               delimiter: "-",                  type: BIT_TYPE.OPERATOR },
  "*"                  : { name: BIT_NAME.MULTIPLY,            delimiter: "*",                  type: BIT_TYPE.OPERATOR },
  "|"                  : { name: BIT_NAME.MOD,                 delimiter: "|",                  type: BIT_TYPE.OPERATOR },
  "||"                 : { name: BIT_NAME.OR,                  delimiter: "||",                 type: BIT_TYPE.OPERATOR },
  "&"                  : { name: BIT_NAME.AND_OPERATOR,        delimiter: "&",                  type: BIT_TYPE.OPERATOR },
  "&&"                 : { name: BIT_NAME.AND,                 delimiter: "&&",                 type: BIT_TYPE.OPERATOR },
  "<"                  : { name: BIT_NAME.LOWER_THAN,          delimiter: "<",                  type: BIT_TYPE.OPERATOR },
  "<="                 : { name: BIT_NAME.LOWER_THAN_EQUAL,    delimiter: "<=",                 type: BIT_TYPE.OPERATOR },
  ">"                  : { name: BIT_NAME.BIGGER_THAN,         delimiter: ">",                  type: BIT_TYPE.OPERATOR },
  ">="                 : { name: BIT_NAME.BIGGER_THAN_EQUAL,   delimiter: ">=",                 type: BIT_TYPE.OPERATOR },
  "!"                  : { name: BIT_NAME.NOT,                 delimiter: "!",                  type: BIT_TYPE.OPERATOR },
  "="                  : { name: BIT_NAME.EQUALS,              delimiter: "=",                  type: BIT_TYPE.OPERATOR },
  "=="                 : { name: BIT_NAME.IF_EQUALS,           delimiter: "==",                 type: BIT_TYPE.OPERATOR },
  "==="                : { name: BIT_NAME.IF_STRONG_EQUALS,    delimiter: "===",                type: BIT_TYPE.OPERATOR },
  "!="                 : { name: BIT_NAME.IF_DIFFERENT,        delimiter: "!=",                 type: BIT_TYPE.OPERATOR },
  "!=="                : { name: BIT_NAME.IF_STRONG_DIFFERENT, delimiter: "!==",                type: BIT_TYPE.OPERATOR },
  "?"                  : { name: BIT_NAME.LINER_IF,            delimiter: "?",                  type: BIT_TYPE.OPERATOR },

  "."                  : { name: BIT_NAME.DOT,                 delimiter: ".",                  type: BIT_TYPE.OPERATOR },
  ":"                  : { name: BIT_NAME.COLON,               delimiter: ":",                  type: BIT_TYPE.OPERATOR },
  ";"                  : { name: BIT_NAME.SEMI_COLON,          delimiter: ";",                  type: BIT_TYPE.OPERATOR },
  ","                  : { name: BIT_NAME.COMMA,               delimiter: ",",                  type: BIT_TYPE.OPERATOR },
  "=>"                 : { name: BIT_NAME.ARROW_FUNCTION,      delimiter: "=>",                 type: BIT_TYPE.OPERATOR },

  "WORD"               : { name: BIT_NAME.WORD,                delimiter: "WORD",               type: BIT_TYPE.WORD },
  "\""                 : { name: BIT_NAME.STRING,              delimiter: "\"",                 type: BIT_TYPE.STRING },
  "'"                  : { name: BIT_NAME.STRING,              delimiter: "'",                  type: BIT_TYPE.STRING },

  "//"                 : { name: BIT_NAME.COMMENT,             delimiter: "//",                 type: BIT_TYPE.COMMENT },
  "/*"                 : { name: BIT_NAME.COMMENT,             delimiter: "/*",                 type: BIT_TYPE.COMMENT },

  "{"                  : { name: BIT_NAME.SCOPE,               delimiter: "{",                  type: BIT_TYPE.SCOPE },
  "}"                  : { name: BIT_NAME.SCOPE_END,           delimiter: "}",                  type: BIT_TYPE.SCOPE },
  "("                  : { name: BIT_NAME.PTS_OPEN,            delimiter: "(",                  type: BIT_TYPE.SCOPE },
  ")"                  : { name: BIT_NAME.PTS_CLOSE,           delimiter: ")",                  type: BIT_TYPE.SCOPE },
  "["                  : { name: BIT_NAME.ARRAY_OPEN,          delimiter: "[",                  type: BIT_TYPE.SCOPE },
  "]"                  : { name: BIT_NAME.ARRAY_CLOSE,         delimiter: "]",                  type: BIT_TYPE.SCOPE },

  "function"           : { name: BIT_NAME.JS_FUNCTION,         delimiter: "function",           type: BIT_TYPE.JS_WORD, scopish: true },
  "if"                 : { name: BIT_NAME.JS_IF,               delimiter: "if",                 type: BIT_TYPE.JS_WORD, scopish: true },
  "else"               : { name: BIT_NAME.JS_ELSE,             delimiter: "else",               type: BIT_TYPE.JS_WORD, scopish: true },
  "for"                : { name: BIT_NAME.JS_FOR,              delimiter: "for",                type: BIT_TYPE.JS_WORD, scopish: true },
  "while"              : { name: BIT_NAME.JS_WHILE,            delimiter: "while",              type: BIT_TYPE.JS_WORD, scopish: true },
  "switch"             : { name: BIT_NAME.JS_SWITCH,           delimiter: "switch",             type: BIT_TYPE.JS_WORD, scopish: true },
  "do"                 : { name: BIT_NAME.JS_DO,               delimiter: "do",                 type: BIT_TYPE.JS_WORD, scopish: true },
  "case"               : { name: BIT_NAME.JS_CASE,             delimiter: "case",               type: BIT_TYPE.JS_WORD, scopish: true },
  "return"             : { name: BIT_NAME.JS_RETURN,           delimiter: "return",             type: BIT_TYPE.JS_WORD },
  "break"              : { name: BIT_NAME.JS_BREAK,            delimiter: "break",              type: BIT_TYPE.JS_WORD },
  "throw"              : { name: BIT_NAME.JS_THROW,            delimiter: "throw",              type: BIT_TYPE.JS_WORD },
  "try"                : { name: BIT_NAME.JS_TRY,              delimiter: "try",                type: BIT_TYPE.JS_WORD },
  "catch"              : { name: BIT_NAME.JS_CATCH,            delimiter: "catch",              type: BIT_TYPE.JS_WORD },
  "typeof"             : { name: BIT_NAME.JS_TYPEOF,           delimiter: "typeof",             type: BIT_TYPE.JS_WORD },
  "instanceof"         : { name: BIT_NAME.JS_INSTANCEOF,       delimiter: "instanceof",         type: BIT_TYPE.JS_WORD },
  "var"                : { name: BIT_NAME.JS_VARIABLE_VAR,     delimiter: "var",                type: BIT_TYPE.JS_WORD, SET_VARIABLE : true },
  "let"                : { name: BIT_NAME.JS_VARIABLE_LET,     delimiter: "let",                type: BIT_TYPE.JS_WORD, SET_VARIABLE : true },
  "const"              : { name: BIT_NAME.JS_VARIABLE_CONST,   delimiter: "const",              type: BIT_TYPE.JS_WORD, SET_VARIABLE : true },
  "Date"               : { name: BIT_NAME.JS_DATE,             delimiter: "Date",               type: BIT_TYPE.JS_WORD },
  "this"               : { name: BIT_NAME.JS_THIS,             delimiter: "this",               type: BIT_TYPE.JS_WORD },
  "Error"              : { name: BIT_NAME.JS_ERROR,            delimiter: "Error",              type: BIT_TYPE.JS_WORD },
  "TypeError"          : { name: BIT_NAME.JS_ERROR,            delimiter: "TypeError",          type: BIT_TYPE.JS_WORD },
  "SyntaxError"        : { name: BIT_NAME.JS_ERROR,            delimiter: "SyntaxError",        type: BIT_TYPE.JS_WORD },
  "RangeError"         : { name: BIT_NAME.JS_ERROR,            delimiter: "RangeError",         type: BIT_TYPE.JS_WORD },
  "ReferenceError"     : { name: BIT_NAME.JS_ERROR,            delimiter: "ReferenceError",     type: BIT_TYPE.JS_WORD },
  "EvalError"          : { name: BIT_NAME.JS_ERROR,            delimiter: "EvalError",          type: BIT_TYPE.JS_WORD },
  "URIError"           : { name: BIT_NAME.JS_ERROR,            delimiter: "URIError",           type: BIT_TYPE.JS_WORD },
  "setTimeout"         : { name: BIT_NAME.JS_TIMER,            delimiter: "setTimeout",         type: BIT_TYPE.JS_WORD },
  "setInterval"        : { name: BIT_NAME.JS_TIMER,            delimiter: "setInterval",        type: BIT_TYPE.JS_WORD },
  "clearInterval"      : { name: BIT_NAME.JS_TIMER,            delimiter: "clearInterval",      type: BIT_TYPE.JS_WORD },
  "Array"              : { name: BIT_NAME.JS_ARRAY,            delimiter: "Array",              type: BIT_TYPE.JS_WORD },
  "ArrayBuffer"        : { name: BIT_NAME.JS_ARRAY_BUFFER,     delimiter: "ArrayBuffer",        type: BIT_TYPE.JS_WORD },
  "Object"             : { name: BIT_NAME.JS_OBJECT,           delimiter: "Object",             type: BIT_TYPE.JS_WORD },
  "String"             : { name: BIT_NAME.JS_STRING,           delimiter: "String",             type: BIT_TYPE.JS_WORD },
  "Number"             : { name: BIT_NAME.JS_NUMBER,           delimiter: "Number",             type: BIT_TYPE.JS_WORD },
  "Boolean"            : { name: BIT_NAME.JS_BOOLEAN,          delimiter: "Boolean",            type: BIT_TYPE.JS_WORD },
  "Math"               : { name: BIT_NAME.JS_MATH,             delimiter: "Math",               type: BIT_TYPE.JS_WORD },
  "new"                : { name: BIT_NAME.JS_NEW,              delimiter: "new",                type: BIT_TYPE.JS_WORD },
  "arguments"          : { name: BIT_NAME.JS_ARGUMENTS,        delimiter: "arguments",          type: BIT_TYPE.JS_WORD },
  "eval"               : { name: BIT_NAME.JS_EVAL,             delimiter: "eval",               type: BIT_TYPE.JS_WORD },
  "class"              : { name: BIT_NAME.JS_CLASS,            delimiter: "class",              type: BIT_TYPE.JS_WORD },
  "default"            : { name: BIT_NAME.JS_DEFAULT,          delimiter: "default",            type: BIT_TYPE.JS_WORD },
  "NaN"                : { name: BIT_NAME.JS_NAN,              delimiter: "NaN",                type: BIT_TYPE.JS_WORD },
  "isNaN"              : { name: BIT_NAME.JS_ISNAN,            delimiter: "isNaN",              type: BIT_TYPE.JS_WORD },
  "parseFloat"         : { name: BIT_NAME.JS_PARSE_FLOAT,      delimiter: "parseFloat",         type: BIT_TYPE.JS_WORD },
  "parseInt"           : { name: BIT_NAME.JS_PARSE_INT,        delimiter: "parseInt",           type: BIT_TYPE.JS_WORD },
  "null"               : { name: BIT_NAME.JS_NULL,             delimiter: "null",               type: BIT_TYPE.JS_WORD },
  "undefined"          : { name: BIT_NAME.JS_UNDEFINED,        delimiter: "undefined",          type: BIT_TYPE.JS_WORD },
  "true"               : { name: BIT_NAME.JS_TRUE,             delimiter: "true",               type: BIT_TYPE.JS_WORD },
  "false"              : { name: BIT_NAME.JS_FALSE,            delimiter: "false",              type: BIT_TYPE.JS_WORD },
  "continue"           : { name: BIT_NAME.JS_CONTINUE,         delimiter: "continue",           type: BIT_TYPE.JS_WORD },
  "finally"            : { name: BIT_NAME.JS_FINALLY,          delimiter: "finally",            type: BIT_TYPE.JS_WORD },
  "RegExp"             : { name: BIT_NAME.JS_REGEXP,           delimiter: "RegExp",             type: BIT_TYPE.JS_WORD },
  "delete"             : { name: BIT_NAME.JS_DELETE,           delimiter: "delete",             type: BIT_TYPE.JS_WORD },
  "JSON"               : { name: BIT_NAME.JS_JSON,             delimiter: "JSON",               type: BIT_TYPE.JS_WORD },
  "isFinite"           : { name: BIT_NAME.JS_IS_FINITE,        delimiter: "isFinite",           type: BIT_TYPE.JS_WORD },
  "escape"             : { name: BIT_NAME.JS_ESCAPE,           delimiter: "escape",             type: BIT_TYPE.JS_WORD },
  "unescape"           : { name: BIT_NAME.JS_UNESCAPE,         delimiter: "unescape",           type: BIT_TYPE.JS_WORD },
  "Infinity"           : { name: BIT_NAME.JS_INFINITY,         delimiter: "Infinity",           type: BIT_TYPE.JS_WORD },
  "decodeURI"          : { name: BIT_NAME.JS_DECODE_URI,       delimiter: "decodeURI",          type: BIT_TYPE.JS_WORD },
  "decodeURIComponent" : { name: BIT_NAME.JS_DECODE_URI_CMP,   delimiter: "decodeURIComponent", type: BIT_TYPE.JS_WORD },
  "encodeURI"          : { name: BIT_NAME.JS_ENCODE_URI,       delimiter: "encodeURI",          type: BIT_TYPE.JS_WORD },
  "encodeURIComponent" : { name: BIT_NAME.JS_ENCODE_URI_CMP,   delimiter: "encodeURIComponent", type: BIT_TYPE.JS_WORD },
  "debugger"           : { name: BIT_NAME.JS_DEBUGGER,         delimiter: "debugger",           type: BIT_TYPE.JS_WORD },
  "export"             : { name: BIT_NAME.JS_EXPORT,           delimiter: "export",             type: BIT_TYPE.JS_WORD },
  "import"             : { name: BIT_NAME.JS_IMPORT,           delimiter: "import",             type: BIT_TYPE.JS_WORD },
  "in"                 : { name: BIT_NAME.JS_IN,               delimiter: "in",                 type: BIT_TYPE.JS_WORD },
  "with"               : { name: BIT_NAME.JS_WITH,             delimiter: "with",               type: BIT_TYPE.JS_WORD },
  "yield"              : { name: BIT_NAME.JS_YIELD,            delimiter: "yield",              type: BIT_TYPE.JS_WORD },

  "\u000D"             : { name: BIT_NAME.CR_LINE,             delimiter: "\u000D",             type: BIT_TYPE.NO_OP },
  "\u0020"             : { name: BIT_NAME.SPACE,               delimiter: "\u0020",             type: BIT_TYPE.NO_OP },
  "\u0009"             : { name: BIT_NAME.TAB,                 delimiter: "\u0009",             type: BIT_TYPE.NO_OP },
  "\u000A"             : { name: BIT_NAME.NEW_LINE,            delimiter: "\u000A",             type: BIT_TYPE.NO_OP, NEW_LINE: true  },
  "\u000B"             : { name: BIT_NAME.V_TAB,               delimiter: "\u000B",             type: BIT_TYPE.NO_OP, NEW_LINE: true  },
  "\u000C"             : { name: BIT_NAME.FORM_FEED,           delimiter: "\u000C",             type: BIT_TYPE.NO_OP },
  "\uFEFF"             : { name: BIT_NAME.BOM,                 delimiter: "\uFEFF",             type: BIT_TYPE.NO_OP },
  "\u2028"             : { name: BIT_NAME.LINE_SEPARATOR,      delimiter: "\u2028",             type: BIT_TYPE.NO_OP },
  "\u2029"             : { name: BIT_NAME.PG_SEPARATOR,        delimiter: "\u2029",             type: BIT_TYPE.NO_OP }
};

exports.types = types;

exports.code = "";
exports.activeWord = "";
exports.activeBlock = null;
exports.columnIndex = 1;
exports.rowIndex = 1;

function block() {
  if (!(this instanceof block)) return new block();
  this.columnIndex = exports.columnIndex;
  this.rowIndex = exports.rowIndex;
  this.parentIndex = null;
  this.type = null;
  this.name = null;
  this.delimiter = null;
  this.variables = {};
  this.hasVariables = false;
  this.isVariable = false;

  this.index = null;
  this.length = null;

  this.subs = [];
  this.parent = null;

  var _this = this;
  this.getData = function(force_read) {
    if (_this.textValue && !force_read) return _this.textValue;
    _this.textValue = exports.code.substr(_this.startIndex, (_this.endIndex - _this.startIndex) + 1);

    return _this.textValue;
  };

  this.changeValue = function(value) {
    _this.textValue = value;
  };

  this.addVariable = function(bl) {
    _this.hasVariables = true;
    var name = bl.getData();
    if (!_this.variables.hasOwnProperty(name)) {
      _this.variables[name] = bl;
    } else {
      // variable duplicates!
      if (Array.isArray(_this.variables[name]))
        _this.variables[name].push(bl);
      else {
        _this.variables[name] = [ _this.variables[name] ];
        _this.addVariable(bl);
      }
    }
  };

  this.findType = function() {

  };

  this.isWordish = function() {
    return (_this.type == BIT_TYPE.WORD || _this.type == BIT_TYPE.JS_WORD);
  };

  this.isNewDefinition = function() {
    return _this.findType() == "new_variable";
  };

  this.isProperty = function() {
    if (_this.type != BIT_TYPE.WORD) return false;

    var bl = _this.getPreviousBlock();

    if (bl) {
      if (bl.delimiter == ".") return true;
      if (bl.delimiter == ":") return false;
      if (signs.hasOwnProperty(bl.delimiter) && bl.delimiter != ",")
        return false;
      if (bl.delimiter == ",") {
        var nbl = _this.getNextBlock();
        return (nbl && nbl.delimiter == ":");
      }
    }

    if (_this.parent) {
      var type = _this.parent.findType();

      if (type == "object") return true;

      var nbl = _this.getNextBlock();
      if (nbl && nbl.delimiter == ":") return true;
    }

    return false;
  };

  // returns none space etc previous item
  // --> returns undefined if
  // a - no item
  this.getPreviousBlock = function(dont_skip) {
    if (!_this.parent || _this.parentIndex === null || _this.parentIndex === 0)
      return;

    var bl = _this.parent.subs;
    for (var i = _this.parentIndex - 1; i >= 0; i--) {
      if (!dont_skip && bl[i].type == BIT_TYPE.NO_OP) continue;
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
      if (!dont_skip && bl[i].type == BIT_TYPE.NO_OP) continue;
      return bl[i];
    }
  }
}

exports.block = block;