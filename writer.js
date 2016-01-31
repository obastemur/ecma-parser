/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var commons = require('./commons');

var scope_string = {};

for(var o in commons.scopeTypes) {
  scope_string[commons.scopeTypes[o]] = o;
}

var bit_names = {};

for(var o in commons.BIT_NAME) {
  bit_names[commons.BIT_NAME[o]] = o;
}

var colors = ['green', 'yellow'];
var printBlocks = function (bl, depth) {
  if (!depth) {
    depth = "";
  }

  var type_ = bit_names[bl.name];
  var scopeType = scope_string[bl.scopeType];
  bl = bl.subs;

  console.log(depth + "--->", type_, "(" + scopeType + ")");
  for (var i = 0; i < bl.length; i++) {
    var clr = colors[i % 2];
    type_ = bit_names[bl[i].name];

    var ext = bl[i].isWordish() ? bl[i].delimiter : type_ == commons.BIT_TYPE.NUMBER ? bl[i].delimiter : "";
    jxcore.utils.console.log(depth + type_, bl[i].rowIndex + ":" + bl[i].columnIndex, ext, clr);

    if (bl[i].subs && bl[i].subs.length) {
      printBlocks(bl[i], depth + "    ");
      console.log(depth + "<---", type_);
    }
  }
};

exports.printBlocks = printBlocks;

var arr = [];
function write(filename, block) {
  if (block.name == commons.BIT_NAME.ROOT)
    return write(filename, block.subs);

  var close_scope = {
    "{" : "}",
    "[" : "]",
    "(" : ")"
  };

  for (var i = 0, ln = block.length; i < ln; i++) {
    if (block[i].subs.length || block[i].scope) {
      arr.push(block[i].delimiter);

      if (block[i].subs.length)
        write(filename, block[i].subs);

      arr.push(close_scope[block[i].delimiter]);
    } else {
      arr.push(block[i].getData());
    }
  }
}

exports.blockToCode = function (block, filename) {
  arr = [];
  if (block.name == commons.BIT_NAME.ROOT)
    write(filename, block.subs);
  else
    write(filename, block);

  return arr.join('');
};