var assert = require('assert');
var parser = require('../parser');

var code = '                      \
var str = "Hello", q = 1;         \
                                  \
var Test = function Test(a, b){   \
  a++;                            \
  b++;                            \
  return a+b;                     \
}                                 \
                                  \
for(var z=1, y=2; z<3; z++, p++); \
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