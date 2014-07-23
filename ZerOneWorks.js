/**
 * Created by rock0j on 2014/7/8.
 */
//var http = require('http');
//var url = require('url');
//querystring = require("querystring");

var express = require('express');
var bodyParser = require('body-parser');
//var wechat = require('./node_modules/wechat/lib/wechat.js');
var format = require('./lib/format.js');
//var xml2js = require('xml2js');
//var BufferHelper = require('bufferhelper');

var app = express();

app.use(bodyParser());

app.get('/abc',function (req, res) {
    var echostr = req.query.echostr;
    console.log(req.query.echostr);
    res.send(echostr);
});

app.post('/abc',function(req, res) {
    var name2 = req.body;
    format.getMessage(req, function (err, result) {

        var message = format.formatMessage(result);
        //console.log(message);
        //res.reply('ZerOneWorks');
        //console.log(name2);
        //res.send(name2);
        toUserName = message.ToUserName;
        fromUserName = message.FromUserName;
        //content = '收到来自openid： ' +  fromUserName + ' 的消息: ' + message.Content;
        var content =
        [
                {
                    title: "张三和李四的婚礼喜帖",
                    description: "张三和李四将于2014年5月6日举行婚礼",
                    picurl: "http://zeroneworks.vicp.net:8080/news.jpg",
                    url: "http://zeroneworks.vicp.net:8080/xitie.html"
                }
            ]
        ;

        var new1 = format.reply(content, toUserName,fromUserName );
        //var new2 = '<xml><ToUserName><![CDATA[ouylWt5mKO36JrqXlGQdERM3YCQo]]></ToUserName><FromUserName><![CDATA[gh_791879cee39f]]></FromUserName><CreateTime>1404993089648</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[this is a test]]></Content></xml>'
        res.writeHead(200,"Content-Type:text/xml;charset=UTF-8");
        res.end(new1);
    });
});

app.listen(80);

console.log('Server running at http://192.168.3.2/');