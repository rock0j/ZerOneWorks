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
var gobalSearch = require('./lib/gobalSearch.js');

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
    //console.log("****************接受消息***************");
    //console.log(new Date().getTime());
    var name2 = req.body;
    format.getMessage(req, function (err, result) {

        var message = format.formatMessage(result);
        console.log(message);
        //res.reply('ZerOneWorks');
        //console.log(name2);
        //res.send(name2);
        var toUserName = message.ToUserName;
        var fromUserName = message.FromUserName;
        //message.testadd = 'hello add';
        //content = '收到来自openid： ' +  fromUserName + ' 的消息: ' + message.Content;
        //var content  ;

        //不读取数据库的情况
//        var content =
//        [
//            {
//                title: "张三和李四的婚礼喜帖",
//                description: "张三和李四将于2014年5月6日举行婚礼",
//                picurl: "http://zeroneworks.vicp.net:8080/news.jpg",
//                url: "http://zeroneworks.vicp.net:8080/xitie.html"
//            }
//        ];
//          //console.log(message);
//        var new1 = format.reply(content, toUserName,fromUserName );
//        res.writeHead(200,"Content-Type:text/xml;charset=UTF-8");
//        res.end(new1);

        //读取mongoDB数据内容
        if (message.MsgType == 'text' || message.MsgType == 'event' ) {
            //console.log("开始打印输出的content");
            content = gobalSearch(message,function(result) {
                //console.log("****************接收返回数据***************");
                //console.log(new Date().getTime());

                var new1 = format.reply(result, toUserName,fromUserName );
                //console.log("****************格式化XML***************");
                //console.log(new Date().getTime());
                //var new2 = '<xml><ToUserName><![CDATA[ouylWt5mKO36JrqXlGQdERM3YCQo]]></ToUserName><FromUserName><![CDATA[gh_791879cee39f]]></FromUserName><CreateTime>1404993089648</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[this is a test]]></Content></xml>'
                res.writeHead(200,"Content-Type:text/xml;charset=UTF-8");
                res.end(new1);
                //console.log("****************处理完成***************");
                //console.log(new Date().getTime());
            });
            //console.log("打印输出的content");
            //console.log(content);
        }

    });
});

app.listen(80);

console.log('Server running at http://192.168.3.2/');