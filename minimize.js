#!/usr/bin/env jx
/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var fs = require('fs');
var parser = require('./parser');

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
        if (!prev || parser.signs[prev.type] || prev.type == "SPACE" ||
          prev.type == "NEW_LINE") {
          continue;
        }

        var next = sub.getNextBlock(true);
        if (!next || parser.signs[next.type] || prev.type == "SPACE" ||
          next.type == "NEW_LINE") {
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

        if (minus || !keep_row_index) {  // skip adding new line. comment is on
          // the same line
          continue;
        }

        sub.length = null;  // we want delimiter to return
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
        sub.index = null;  // override original text from index
      } else {
        continue;
      }
    }

    arr.push(sub);
    if (sub.subs && sub.subs.length) {
      cleanInstruction(sub, instruction);
    }
  }

  for (var i = 0; i < arr.length; i++) {
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

var dict_special = "$";
var dict_letters =
  "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
var dl_count = dict_letters.length;
var dl_count_2 = dl_count * dl_count;
var letter_div = [
  dl_count,
  dl_count * dl_count,
  dl_count * dl_count_2,
  dl_count_2 * dl_count_2
];
var name_counter = 0, dict_min = {};

function setNodeGlobals() {
  name_counter = 0;
  dict_min = {
    "process" : "process",
    "global" : "global",
    "jxcore" : "jxcore",
    "require" : "require",
    "console" : "console",
    "exports" : "exports",
    "Buffer" : "Buffer",
    "module" : "module",
    "clearTimeout" : "clearTimeout",
    "setImmediate" : "setImmediate",
    "clearImmediate" : "clearImmediate",
    "EventEmitter" : "EventEmitter"
  };
  dict_min._hasOwnProperty = dict_min.hasOwnProperty;
}

function generateName() {
  var name = "";

  for (var i = 0; i < 4; i++) {
    if (name_counter < letter_div[i]) break;

    // mod on next limit
    var base = parseInt(name_counter / letter_div[i]) - 1;
    name += dict_letters.charAt(base % dl_count);
  }

  name += dict_letters.charAt(name_counter % dl_count);

  name_counter++;
  return dict_special + name;
}

function minimizeNames(blocks_) {
  if (!blocks_.subs || !blocks_.subs || !blocks_.subs.length) {
    return false;
  }

  var bl = blocks_.subs;

  var arr = [];
  for (var i = 0; i < bl.length; i++) {
    var sub = bl[i];
    if (sub.type == "WORD") {
      var updateName = (sub.isNewDefinition() || !sub.isProperty());
      updateName =
        updateName && sub.dataType != "number" && sub.dataType != "boolean";

      if (updateName) {
        var name = sub.getData();
        var explicit_naming = false;

        var pbl = sub.getPreviousBlock();

        // check explicit_naming
        // i.e.
        // name = function name() {
        //
        // since name wasn't minified
        // it was either < 2 or reserved
        // or it was a sub property of an object
        // we do not minimize sub prop. names
        if (pbl && pbl.type == "FUNCTION") {
          pbl = pbl.getPreviousBlock();
          if (pbl && pbl.delimiter == "=") {
            pbl = pbl.getPreviousBlock();
            if (pbl && pbl.type == "WORD" && pbl.getData() == name)
              explicit_naming = true;
          }
        }

        if (!explicit_naming) {
          if (name.length > 2) {
            var pre = dict_min._hasOwnProperty(name) ? dict_min[name] : 0;
            if (!pre) {
              pre = generateName();
              dict_min[name] = pre;
            }

            sub.updateName(pre);
          }
        }
      }
    }
    arr.push(sub);
    if (sub.subs && sub.subs.length) {
      minimizeNames(sub);
    }
  }
}

// remove extra space, comments etc. without changing the rowIndex
exports.minimize = function(filename, code, keep_row_index) {
  setNodeGlobals();

  var res = parser.parse(filename, code);

  cleanTabs(res, keep_row_index);
  cleanInstruction(res, "COMMENT", keep_row_index);

  if (!keep_row_index) {
    cleanInstruction(res, "NEW_LINE", keep_row_index);
  }

  cleanInstruction(res, "SPACE", keep_row_index);

  minimizeNames(res);

  return parser.blockToCode(res);
};

exports.getNameMap = function() { return dict_min; };

if (process.argv[1] == __filename) {
  var log = jxcore.utils.console.log;
  if (process.argv.length < 3) {

    log("usage:");
    log("minimize <input_file.js> <optional output.js>", "blue");

    console.log();
    process.exit();
  }

  if (process.argv[3])
    fs.writeFileSync(process.argv[3],
      exports.minimize(process.argv[2],
        fs.readFileSync(process.argv[2]), false));
  else
    console.log(exports.minimize(process.argv[2],
      fs.readFileSync(process.argv[2]), false));
}