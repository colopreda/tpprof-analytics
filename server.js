var express = require('express');
var app = express();
var history = require('connect-history-api-fallback');

app.use(history({
// verbose: true
}));

app.use(express.static(__dirname + '/dist'));

var port = process.env.PORT || 5000;
app.listen(port);

console.log('Server started at: ' + port);