/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var assert = require('assert');
var parser = require('../lexer');
var fs = require('fs');

var code = fs.readFileSync('./js_files/jquery-2.1.4.js') + "";
var bl = parser.parse("basic.js", code);

var new_code = parser.blockToCode(bl);

var ln = new_code.length > code.length ? code.length : new_code.length;

for(var o=0; o<ln; o++) {
  if (new_code.charAt(o) != code.charAt(o)) {
    console.error("NOT MATCHING!")
    console.log("1 >", new_code.substr(o-10, 100));
    console.log("2 >", code.substr(o-10, 100));
    process.exit(1)
  }
}