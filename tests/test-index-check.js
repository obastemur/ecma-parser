/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var assert = require('assert');
var parser = require('../lexer');

var code = '\
var str = "Hello", q = 1;\n\
\n\
var name = "ecma"; // just a comment\n\
\n\
/* comment starts here\n\
\n\
ends*/\n\
\n\
var Test = function Test(a, b) {\n\
  a++;\n\
  b++;\n\
  return a+b;\n\
}\n\
\n\
for(var z=1, y=2; z<3; z++, p++);\
';

var bl = parser.parse("basic.js", code);
var last = bl.subs[bl.subs.length-1];

assert.deepEqual(last.rowIndex + ":" + last.columnIndex, "14:32", "NOT MATCHING");
