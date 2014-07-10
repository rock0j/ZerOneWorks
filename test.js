/**
 * Created by rock0j on 2014/7/10.
 */
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World')
});

app.listen(3000);