/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var assert = require('assert');
var parser = require('../lexer');

var code = '                      \n\
var str = "Hello", q = 1;         \n\
                                  \n\
var Test = function Test(a, b){   \n\
  a++;                            \n\
  b++;                            \n\
  return a+b;                     \n\
}                                 \n\
                                  \n\
for(var z=1, y=2; z<3; z++, p++); \n\
';

var expected = {
  str: {},
  q: {},
  Test: { function_name: true },
  a: { argument_name: true },
  b: { argument_name: true },
  z: {},
  y: {} };

var bl = parser.parse("basic.js", code);

assert.deepEqual(expected, bl.variables, "NOT MATCHING");
