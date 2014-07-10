/**
 * Created by rock0j on 2014/7/8.
 */
//var http = require('http');
//var url = require('url');
//querystring = require("querystring");

var express = require('express');
var app = express();

app.get('/abc',function (req, res) {
    var echostr = req.query.echostr;
    console.log(req.query.echostr);
    res.send(echostr);
});

app.listen(80);

//http.createServer(function (req, res) {
//    // 获取 URL 路径并在控制台上打印
//    var pathname = url.parse(req.url).pathname;
//    var queryname = url.parse(req.url).query;
//    var queryname2 = req.query.
//    var testname = querystring.parse(queryname)['echostr'];
//    console.log('Request for ' + pathname + ' received.');
//    console.log('Request for ' + testname + ' received.');
//
//    res.writeHead(200, {'Content-Type': 'text/plain'});
//    res.end(testname);
//}).listen(80, '10.0.0.115');

console.log('Server running at http://10.0.0.115/');