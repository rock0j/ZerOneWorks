/**
 * Created by rock0j on 2014/7/10.
 */
var xml2js = require('xml2js');
var ejs = require('ejs');
var BufferHelper = require('bufferhelper');

/*!
 * 从微信的提交中提取XML文件
 */
exports.getMessage = function (stream, callback) {
    var buf = new BufferHelper();
    buf.load(stream, function (err, buf) {
        if (err) {
            return callback(err);
        }
        var xml = buf.toString('utf-8');
        xml2js.parseString(xml, {trim: true}, callback);
    });
};

/*!
 * 检查对象是否为空，对xml2js的workaround
 */
var isEmpty = function (thing) {
    return typeof thing === "object" && (thing != null) && Object.keys(thing).length === 0;
};

/*!
 * 将xml2js解析出来的对象转换成直接可访问的对象
 */
exports.formatMessage = function (result) {
    var message = {};
    for (var key in result.xml) {
        var val = result.xml[key][0];
        message[key] = (isEmpty(val) ? '' : val).trim();
    }
    return message;
};

/*!
 * 响应模版
 */
var tpl = ['<xml>',
    '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
    '<CreateTime><%=createTime%></CreateTime>',
    '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
    '<% if (msgType === "news") { %>',
    '<ArticleCount><%=content.length%></ArticleCount>',
    '<Articles>',
    '<% content.forEach(function(item){ %>',
    '<item>',
    '<Title><![CDATA[<%-item.title%>]]></Title>',
    '<Description><![CDATA[<%-item.description%>]]></Description>',
    '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic %>]]></PicUrl>',
    '<Url><![CDATA[<%-item.url%>]]></Url>',
    '</item>',
    '<% }); %>',
    '</Articles>',
    '<% } else if (msgType === "music") { %>',
    '<Music>',
    '<Title><![CDATA[<%-content.title%>]]></Title>',
    '<Description><![CDATA[<%-content.description%>]]></Description>',
    '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>',
    '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>',
    '</Music>',
    '<% } else if (msgType === "voice") { %>',
    '<Voice>',
    '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Voice>',
    '<% } else if (msgType === "image") { %>',
    '<Image>',
    '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Image>',
    '<% } else if (msgType === "video") { %>',
    '<Video>',
    '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '<ThumbMediaId><![CDATA[<%-content.thumbMediaId%>]]></ThumbMediaId>',
    '</Video>',
    '<% } else if (msgType === "transfer_customer_service") { %>',
    // nothing
    '<% } else { %>',
    '<Content><![CDATA[<%-content%>]]></Content>',
    '<% } %>',
    '</xml>'].join('');

/*!
 * 编译过后的模版
 */
var compiled = ejs.compile(tpl);

/*!
 * 将内容回复给微信的封装方法
 */
exports.reply = function (content, fromUsername, toUsername) {
    var info = {};
    var type = 'text';
    info.content = content || '';
//    if (Array.isArray(content)) {
//        type = 'news';
//    } else if (typeof content === 'object') {
//        if (content.hasOwnProperty('type')) {
//            type = content.type;
//            info.content = content.content;
//        } else {
//            type = 'music';
//        }
//    }music
    info.msgType = type;
    info.createTime = new Date().getTime();
    info.toUsername = toUsername;
    info.fromUsername = fromUsername;

    //console.log(info);
    return compiled(info);
};