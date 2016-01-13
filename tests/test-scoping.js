/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var assert = require('assert');
var parser = require('../lexer');

var code = '\
var m = {a: { b : { z: function(h) { } } } };';

var bl = parser.parse("basic.js", code);

var new_code = parser.blockToCode(bl);

assert.deepEqual(code, new_code, "NOT MATCHING");
