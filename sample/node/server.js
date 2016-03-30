var express = require('express');
var app = express();

var static = express.static('public');
app.use(static);


var port = 37046;
console.log("listening on http://localhost:" + port);
app.listen(port);

