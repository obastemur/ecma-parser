/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var assert = require('assert');
var parser = require('../lexer');

var code = '\
var str = "Hello", q = 1;         \n\
                                  \n\
var Test = function Test(a, b) {  \n\
  a++;                            \n\
  b++;                            \n\
  return a+b;                     \n\
}                                 \n\
                                  \n\
for(var z=1, y=2; z<3; z++, p++);\
';

var bl = parser.parse("basic.js", code);

var new_code = parser.blockToCode(bl);

assert.deepEqual(code, new_code, "NOT MATCHING");
