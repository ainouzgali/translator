'use strict'
var express = require('express'),
    morgan = require('morgan'),
    app = module.exports = express();

// Simplest logging of requests in console.
app.use(morgan('tiny'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Serve static content
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/data'));

app.listen(3000, function () {
  console.log('Translation Server started at http://localhost:3000/');
})


