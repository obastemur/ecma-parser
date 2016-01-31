/*
 * The MIT License (MIT)
 * Copyright (c) 2015 Oguz Bastemur
 */

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var eopts = {
  encoding: 'utf8',
  timeout: 0,
  maxBuffer: 1e8,
  killSignal: 'SIGTERM'
};

var dirs = fs.readdirSync(__dirname);
var list = [];
for(var o in dirs) {
  var dir = path.join(__dirname, dirs[o]);

  if (path.extname(dir) == ".js" && dirs[o] != "run.js") {
    list.push(dir);
  }
}

function test() {
  if (!list.length) {
    done();
    return;
  }

  var file = list.pop();

  console.log("Testing ", path.basename(file));
  exec("jx " + file, eopts, function(err, stdout, stderr) {
    if (!err) {
      console.log("OK");
      process.nextTick(test);
    } else {
      console.error("Test Failed!", file);
      console.error("Error: ", stderr, "\n" + stdout);
    }
  });
}

function done() {
  console.log("Tests are finished! successfully");
}

test();