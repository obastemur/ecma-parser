var commons = require('./commons');

function setScopishType(bl, delimiter, name, pr_scope_type) {
  if (delimiter == "(") {
    if (name == commons.BIT_NAME.JS_FUNCTION) {
      bl.scopeType = commons.scopeTypes.ARGS_FUNCTION_DEFINITION;
    } else if (name == commons.BIT_NAME.JS_WHILE) {
      bl.scopeType = commons.scopeTypes.ARGS_WHILE;
    } else if (name == commons.BIT_NAME.JS_IF) {
      bl.scopeType = commons.scopeTypes.ARGS_IF;
    } else if (name == commons.BIT_NAME.JS_FOR) {
      bl.scopeType = commons.scopeTypes.ARGS_FOR;
    } else if (name == commons.BIT_NAME.JS_ELSE) {
      bl.scopeType = commons.scopeTypes.INNER_PROCEDURE;
    } else if (name == commons.BIT_NAME.JS_DO) {
      commons.activeError = new SyntaxError("Did you forget something here ? do -> `{` at "
       + commons.rowIndex + ":" + commons.columnIndex);
      return false;
    } else {
      bl.scopeType = commons.scopeTypes.INNER_PROCEDURE;
    }

    return true;
  }

  if (delimiter == "{") {
    if (name == commons.BIT_NAME.JS_FUNCTION || pr_scope_type == commons.scopeTypes.ARGS_FUNCTION_DEFINITION) {
      bl.scopeType = commons.scopeTypes.SCOPE_FUNCTION;
    } else if (name == commons.BIT_NAME.JS_WHILE || pr_scope_type == commons.scopeTypes.ARGS_WHILE) {
      bl.scopeType = commons.scopeTypes.SCOPE_WHILE;
    } else if (name == commons.BIT_NAME.JS_IF || pr_scope_type == commons.scopeTypes.ARGS_IF) {
      bl.scopeType = commons.scopeTypes.SCOPE_IF;
    } else if (name == commons.BIT_NAME.JS_FOR || pr_scope_type == commons.scopeTypes.ARGS_FOR) {
      bl.scopeType = commons.scopeTypes.SCOPE_FOR;
    } else if (name == commons.BIT_NAME.JS_ELSE) {
      bl.scopeType = commons.scopeTypes.SCOPE_ELSE;
    } else if (name == commons.BIT_NAME.JS_DO) {
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

  if (pr.scopish || pr.scopeType) {
    return setScopishType(bl, bl.delimiter, pr.name, pr.scopeType);
  }

  if (isPTS) {
    var npr = pr.getPreviousBlock();
    var npre = npr ? npr.name : "";
    if (npre == commons.BIT_NAME.JS_FUNCTION && pr.name == commons.BIT_NAME.WORD) {
      bl.scopeType = commons.scopeTypes.ARGS_FUNCTION_DEFINITION;
    } else if (pr.name == commons.BIT_NAME.WORD || pr.type == commons.BIT_TYPE.JS_WORD) {
      bl.scopeType = commons.scopeTypes.ARGS_FUNCTION_CALL;
    } else {
      bl.scopeType = commons.scopeTypes.INNER_PROCEDURE;
    }
  } else {
    bl.scopeType = commons.scopeTypes.SCOPE_EMPTY;
  }
};

function evalVariable(bl, prev) {
  if (prev && prev.SET_VARIABLE) {
    bl.isVariable = true;
    bl.parent.addVariable(bl);

    return;
  }

}

exports.variableAnalysis = function variableAnalysis(bl) {
  for(var i= 0, lni = bl.subs.length; i < lni; i++) {
    var sub = bl.subs[i];
    var prev = sub.getPreviousBlock();

    if (sub.SET_VARIABLE) {
      continue;
    }

    if (sub.name == commons.BIT_NAME.WORD) {
      if (prev && prev.SET_VARIABLE) {
        evalVariable(sub, prev);
        continue;
      }


    }

    if (sub.subs && sub.subs.length)
      variableAnalysis(sub);
  }
};