/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

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

// TODO: implement the rest
var expected = [
  "str",
 // "q",
  "Test",
 // "a",
 // "b",
  "z",
 // "y"
];

var root = parser.parse("basic.js", code);

var lst = {};

function xx(bl) {
  if (bl.hasVariables) {
    var ss = bl.variables;

    for (var o in ss) {
      lst[o] = 1;
    }
  }

  if (bl.subs) {
    for(var o in bl.subs) {
      xx(bl.subs[o])
    }
  }
}

xx(root);

for(var o in expected) {
  var v = expected[o];
  if (!lst.hasOwnProperty(v)) {
    console.error("Variable doesn't exist", o);
    process.exit(1);
  }
}