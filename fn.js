var commons = require('./commons');

commons.scopeTypes = {
  INNER_PROCEDURE : 1,

  SCOPE_EMPTY : 2,
  SCOPE_FUNCTION : 3,
  SCOPE_FOR : 4,
  SCOPE_WHILE : 5,
  SCOPE_DO: 6,
  SCOPE_IF: 7,
  SCOPE_ELSE: 8,

  ARRAY: 9,

  OBJECT_DEFINITION: 10,

  ARGS_FUNCTION_DEFINITION: 11,
  ARGS_FUNCTION_CALL: 12,
  ARGS_FOR: 13,
  ARGS_IF: 14,
  ARGS_WHILE: 15
};

var scopish = {
  "JS_FUNCTION": 1,
  "JS_WHILE": 1,
  "JS_IF": 1,
  "JS_ELSE": 1,
  "JS_DO": 1,
  "JS_FOR": 1
};

function setScopishType(bl, delimiter, type, pr_scope_type) {
  if (delimiter == "(") {
    if (type == "JS_FUNCTION") {
      bl.scopeType = commons.scopeTypes.ARGS_FUNCTION_DEFINITION;
    } else if (type == "JS_WHILE") {
      bl.scopeType = commons.scopeTypes.ARGS_WHILE;
    } else if (type == "JS_IF") {
      bl.scopeType = commons.scopeTypes.ARGS_IF;
    } else if (type == "JS_FOR") {
      bl.scopeType = commons.scopeTypes.ARGS_FOR;
    } else if (type == "JS_ELSE") {
      bl.scopeType = commons.scopeTypes.INNER_PROCEDURE;
    } else if (type == "JS_DO") {
      commons.activeError = new SyntaxError("Did you forget something here ? do -> `{` at "
       + commons.rowIndex + ":" + commons.columnIndex);
      return false;
    } else {
      bl.scopeType = commons.scopeTypes.INNER_PROCEDURE;
    }

    return true;
  }

  if (delimiter == "{") {
    if (type == "JS_FUNCTION" || pr_scope_type == commons.scopeTypes.ARGS_FUNCTION_DEFINITION) {
      bl.scopeType = commons.scopeTypes.SCOPE_FUNCTION;
    } else if (type == "JS_WHILE" || pr_scope_type == commons.scopeTypes.ARGS_WHILE) {
      bl.scopeType = commons.scopeTypes.SCOPE_WHILE;
    } else if (type == "JS_IF" || pr_scope_type == commons.scopeTypes.ARGS_IF) {
      bl.scopeType = commons.scopeTypes.SCOPE_IF;
    } else if (type == "JS_FOR" || pr_scope_type == commons.scopeTypes.ARGS_FOR) {
      bl.scopeType = commons.scopeTypes.SCOPE_FOR;
    } else if (type == "JS_ELSE") {
      bl.scopeType = commons.scopeTypes.SCOPE_ELSE;
    } else if (type == "JS_DO") {
      bl.scopeType = commons.scopeTypes.SCOPE_DO;
    } else {
      bl.scopeType = commons.scopeTypes.EMPTY;
    }

    return true;
  }
}

exports.scopeAnalysis = function scopeAnalysis(bl) {
  if (bl.delimiter == "[") {
    bl.scopeType = commons.scopeTypes.ARRAY;
    return;
  }

  var isPTS = bl.delimiter == "(";

  var pr = bl.getPreviousBlock();

  if (!pr) {
    if (isPTS)
      bl.scopeType = commons.scopeTypes.INNER_PROCEDURE;
    else
      bl.scopeType = commons.scopeTypes.SCOPE_EMPTY;
    return;
  }

  if (scopish.hasOwnProperty(pr.type) || pr.scopeType) {
    return setScopishType(bl, bl.delimiter, pr.type, pr.scopeType);
  }

  if (isPTS) {
    var npr = pr.getPreviousBlock();
    var npre = npr ? npr.type : "";
    if (npre == "JS_FUNCTION" && pr.type == "WORD") {
      bl.scopeType = commons.scopeTypes.ARGS_FUNCTION_DEFINITION;
    } else if (pr.type == "WORD" || pr.type.indexOf("JS_") === 0) {
      bl.scopeType = commons.scopeTypes.ARGS_FUNCTION_CALL;
    } else {
      bl.scopeType = commons.scopeTypes.INNER_PROCEDURE;
    }
  } else {
    bl.scopeType = commons.scopeTypes.SCOPE_EMPTY;
  }
};