/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var colors = ['green', 'yellow'];
var printBlocks = function (bl, depth) {
  if (!depth) {
    depth = "";
  }

  var type_ = bl.type;
  bl = bl.subs;

  console.log(depth + "--->", type_);
  for (var i = 0; i < bl.length; i++) {
    var clr = colors[i % 2];
    type_ = bl[i].type;

    var ext = bl[i].isWordish() ? bl[i].delimiter : type_ == "NUMBER" ? bl[i].delimiter : "";
    jxcore.utils.console.log(depth + type_, bl[i].rowIndex + ":" + bl[i].columnIndex, ext, clr);

    if (bl[i].subs && bl[i].subs.length) {
      printBlocks(bl[i], depth + "    ");
      console.log(depth + "<---", type_);
    } else if (bl[i].scope) {
      console.log(depth + "    --->", type_);
      console.log(depth + "    <---", type_);
    }
  }
};

exports.printBlocks = printBlocks;

var arr = [];
function write(filename, block) {
  if (block.type == "ROOT")
    return write(filename, block.subs);

  for (var i = 0, ln = block.length; i < ln; i++) {
    if (block[i].subs.length || block[i].scope) {
      arr.push(block[i].delimiter);

      if (block[i].subs.length)
        write(filename, block[i].subs);

      var close_scope = {
        "{" : "}",
        "[" : "]",
        "(" : ")"
      };
      arr.push(close_scope[block[i].delimiter]);
    } else {
      arr.push(block[i].getData());
    }
  }
}

exports.blockToCode = function (block, filename) {
  arr = [];
  if (block.type == "ROOT")
    write(filename, block.subs);
  else
    write(filename, block);

  return arr.join('');
};