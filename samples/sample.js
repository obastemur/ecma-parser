var parser = require('../parser');

var js_code = "\
var x = 1;\n\
var y = 2;\n\
{\n\
  console.log(x + y);\n\
}";

var bl = parser.parse("test.js", js_code);
parser.printBlocks(bl);