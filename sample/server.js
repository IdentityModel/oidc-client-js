var port = 5000;
var url = "http://localhost:" + port;

var express = require('express');
var app = express();

var static = express.static('public');
app.use(static);

var oidc = require('./oidc.js');
oidc(url, app);

console.log("listening on " + url);
app.listen(port);
