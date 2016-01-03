var parser = require('ecma-parser');

function cleanInstruction(blocks_, instruction, keep_row_index) {
  if (!blocks_.subs || !blocks_.subs || !blocks_.subs.length) {
    return false;
  }

  var bl = blocks_.subs;

  var arr = [];
  for (var i = 0; i < bl.length; i++) {
    var sub = bl[i];
    if (sub.type == instruction) {
      if (instruction == "SPACE") {
        var prev = sub.getPreviousBlock(true);
        if (!prev || parser.signs[prev.type]
          || prev.type == "SPACE"
          || prev.type == "NEW_LINE") {
          continue;
        }

        var next = sub.getNextBlock(true);
        if (!next || parser.signs[next.type]
          || prev.type == "SPACE"
          || next.type == "NEW_LINE") {
          continue;
        }

        sub.length = 1;
      } else if (instruction == "COMMENT") {
        var prev = sub.getPreviousBlock(true);
        var minus = prev && (prev.rowIndex == sub.rowIndex);

        if (!minus) {
          var next = sub.getNextBlock(true);
          minus = next && (next.rowIndex == sub.rowIndex);
        }

        if (sub.delimiter == "/*") {
          var data = sub.getData();
          sub.repeats = data.split('\n').length - (minus ? 1 : 0);
        }

        if (minus || !keep_row_index) { // skip adding new line. comment is on the same line
          continue;
        }

        sub.length = null; // we want delimiter to return
        sub.type = "NEW_LINE";
        sub.delimiter = "\n";
      } else if (instruction == "NEW_LINE") {
        var prev = sub.getPreviousBlock(true);
        if (!prev || parser.signs[prev.type] || prev.type == "SPACE") {
          continue;
        }
        var next = sub.getNextBlock(true);
        if (!next || parser.signs[next.type] || next.type == "SPACE") {
          continue;
        }

        sub.type = "SPACE";
        sub.delimiter = " ";
        sub.length = 1;
        sub.index = null; // override original text from index
      }
      else {
        continue;
      }
    }

    arr.push(sub);
    if (sub.subs && sub.subs.length) {
      cleanInstruction(sub, instruction);
    }
  }

  for(var i=0;i<arr.length;i++) {
    arr[i].parentIndex = i;
  }

  blocks_.subs = arr;
}

function cleanTabs(blocks_) {
  if (!blocks_.subs || !blocks_.subs || !blocks_.subs.length) {
    return false;
  }

  var bl = blocks_.subs;

  var arr = [];
  for (var i = 0; i < bl.length; i++) {
    var sub = bl[i];
    if (sub.type == "TAB") {
      sub.delimiter = ' ';
      sub.type = "SPACE";
      sub.length = 1;
    }
    arr.push(sub);
    if (sub.subs && sub.subs.length) {
      cleanTabs(sub);
    }
  }

  blocks_.subs = arr;
}

// remove extra space, comments etc. without changing the rowIndex
exports.minimize = function(filename, code, keep_row_index) {
  var res = parser.parse(filename, code);

  cleanTabs(res, keep_row_index);
  cleanInstruction(res, "SPACE", keep_row_index);
  cleanInstruction(res, "COMMENT", keep_row_index);

  if (!keep_row_index) {
    cleanInstruction(res, "NEW_LINE", keep_row_index);
    cleanInstruction(res, "SPACE", keep_row_index);
  }

  return parser.blockToCode(res);
};