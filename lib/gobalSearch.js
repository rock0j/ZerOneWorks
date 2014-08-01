/**
 * Created by rock0j on 2014/7/23.
 */

//引用mongoose
var mongoose = require('mongoose');
var funLib = require('./funLib.js');

mongoose.connect('mongodb://localhost/ZerOneWorks',{server : {poolSize : 5}}, function(error){
    if(error){
        console.log(error);
    }else{
        console.log('db connected!')
    }
});

// define Schema -- keyCmdSchema 反范式结构
var keyCmdSchema = new mongoose.Schema({
    nSMSID        :Number,  //对接的消息平台ID
    nPlatfromID   :Number,  //平台ID 0-999 保留给自己用
    sServiceID    :String,  //微信公众识别号或者其他的识别号
    sServiceNO    :String,  //微信或其他平台的识别token字段
    nAppID        :Number,  //接入应用标识 0-999 保留给自己用
    sAPPNO        :String,  //接入应用的token字段
    sKey          :String,  //消息指令关键字
    sParm         :String,  //消息指令参数
    nKeyType      :Number,  //消息指令类型 1首次访问 2菜单 3文字命令  4带参数文字命令 5动态文字命令 6带上下文的命令 7搜索
    sContentID    :String,  //对应的内容ID 无表示为动态命令
    fFunctionName :String,  //执行动态指令时对应的方法名称
    lCreateTime   :Number,  //创建时间
    nCreateUserID :Number,  //创建人
    lUpdateTime   :Number,  //修改时间
    nUpdateUserID :Number,  //修改人
    nStatus       :Number,  //指令状态
    sNotes        :String  //备注
});


// 定义内容数据
var contentSchema = new mongoose.Schema({
    "platfromID" : Number,
    "serviceID" : Number,
    "nAppID" : Number,
    "contentNO" : String,
    "contentType" : Number,
    "content" : Object,
    "CreateTime" : Number,
    "CreateUserID" : Number,
    "UpdateTime" : Number,
    "UpdateUserID" : Number,
    "Status" : Number,
    "Notes" : String
});

var findSomeoneSchema = new mongoose.Schema({
    "openID" : String,
    "someoneID" : String,
    "creatTime" : Number
});

//与mongoDB中的 collection关联
var keyCmd = mongoose.model('keycmds', keyCmdSchema);
var contents = mongoose.model('contents',contentSchema);
var findSomes = mongoose.model('funLib_findsomeones',findSomeoneSchema);

var gobalSearch = function (message,callback) {

    //设置搜索条件

    var conditions = {};
    //console.log(message);
    //设置查询结果的字段
    var fields = {"sKey": 1, "sParm": 1, "nKeyType": 1, sContentID: 1, "fFunctionName": 1};

    if (message.MsgType == 'text') {
        //开始处理text
        var keyAarray  = preProcess(message.Content);
        if (keyAarray.length > 1) {
            conditions = {"$or": [
                {"sKey": keyAarray[0], "sParm": keyAarray[1]},
                {"sKey": keyAarray[0], "fFunctionName": {"$ne": null}}
            ]};
        }
        else {
            conditions = {"sKey": keyAarray[0]};
        }
    } else if (message.MsgType == 'event') {
        //开始处理event
        if (message.Event == 'subscribe' )  {
            //用户关注事件
            conditions = {"sKey": "event_subscribe" };
            if (message.EventKey != null && message.EventKey != "" ) {
                //使用二维码的用户关注事件
                conditions = {"sKey": "event_subscribe", "sParm" : message.EventKey };
            }
        } else if (message.Event == 'unsubscribe' ) {
            //用户取消事件
            conditions = {"sKey": "event_unsubscribe" };
        } else if (message.Event == 'SCAN') {
            //扫描二维码事件
            conditions = {"sKey": "SCAN", "sParm" : message.EventKey };
        } else {
            conditions = {"sKey": message.Event };
            }
    } else {
        //开始处理其他
        conditions = {"sKey": message.Content};
    }

    //查询mongoDB数据库获取结果
    keyCmd.findOne(conditions, fields, function (error, result) {
        if (error) {
            console.log(error);
        } else {

            var command = result;
            //console.log(command);

            //定义发送者和接收者 因为异步执行时该参数可能错误了？要好好测试
            var toUser = message.ToUserName;
            var fromUser = message.FromUserName;

            //定义返回数据的初始值
            var MsgInfo;
            //判断是那种命令
            //console.log(command.nKeyType);
            if (command == null) {
                //未找到数据
                //console.log("找不到对应的数据");
                MsgInfo = "指令输入错误";
                return callback(MsgInfo);
            }else if (command.nKeyType == 3 || command.nKeyType == 4) {
                //文字命令
                if (command.sKey != undefined) {
                    MsgInfo = getContentByID(command.sContentID,function(result) {
                        return callback(result);
                    });
                    //MsgInfo = "只做一步数据库操作";
                    //console.log("****************开始返回数据***************");
                    //console.log(new Date().getTime());
                    //return callback(MsgInfo);
                }
            }else if (command.nKeyType == 5) {
                var inParm = "";
                if (command.sKey == 'SCAN' ||  command.sKey == 'event_subscribe' || command.sKey == 'event_CLICK') {
                    inParm = message.EventKey;
                    if (inParm.indexOf('_') > 0) {
                        inParm = inParm.substring(inParm.indexOf('_')+1,inParm.length);
                        //console.log(inParm);
                    }
                } else {
                    inParm = keyAarray[1];
                }

                MsgInfo = funLib(command.fFunctionName,command.sContentID,inParm,
                    toUser,fromUser,function(result) {
                    return callback(result);
                });
            }
        }
    });
    //return MsgInfo;
};

/**
    按照mongoDB的objectId来查询内容数据
 * @param {String} id 查询对象的objectId
 * @param {function} callback 回调函数 返回对应的内容数据
 *
 */
var getContentByID = function (id,callback) {

    contents.findById(id, "content", function(error, result){
        if(error){
            console.log(error);
        }else{

            //console.log(result.content);
            return callback(result.content);
        }
    });
    //console.log("看看这里有没有执行")
};

exports.getContentByIDs = function (id,callback) {

    contents.findById(id, "content", function(error, result){
        if(error){
            console.log(error);
        }else{

            //console.log(result.content);
            return callback(result.content);
        }
    });
    //console.log("看看这里有没有执行")
};

/*
    安装openid来查询获取的寻宝钥匙，如果没有找到就新增
 */
exports.getSomeoneByID = function (openId,id,callback) {
    var someoneConditions = {"openID": openId, "someoneID" : id};
    findSomes.findOne(someoneConditions,function (error, result) {
        if (error) {
            console.log(error);
        } else {
            if (result == null) {
                var creattime = new Date().getTime();
                var newDoc = {
                    "openID" : openId ,
                    "someoneID" : id ,
                    "creatTime" : creattime
                };
                var newSomeone = new findSomes(newDoc);
                newSomeone.save(function(error){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('new saved ok!');
                        return callback("new");
                    }
                });

            } else {
                return callback("old");
            }

        }
    });
};

/*
    查找总共有已经获得了多少个钥匙
 */
exports.countSomeone = function(openId,callback) {
    var countConditions = {"openID": openId };
    findSomes.find(countConditions,function (error, result) {
        if (error) {
            console.log(error);
        } else {
            if (result == null) {
                return callback(0);
            } else {
                return callback(result.length);
            }

        }
    });
};


//var testmessage = {"Content" : "11"};

//var info = getContent(testmessage);

//console.log(info);

/**
    将输入的指令进行预处理，将指令和参数（或者函数传递参数）
 * @param {String} key 输入接收到的指令
 */
var preProcess = function (key) {

    key = key.trim();
    var keyArray =new Array();
    if (key.indexOf(' ') > 0 ) {
        keyArray[0] = key.substr(0,key.indexOf(' '));
        var tmpArray = key.substring(key.indexOf(' ')+1,key.length).split(' ');
        keyArray[1] = tmpArray.join('||');
        return keyArray;
    } else if (key.indexOf(',') > 0) {

    } else if (key.indexOf('，') > 0) {

    } else {
        keyArray[0] = key;
        return keyArray;
    }
};

module.exports = gobalSearch;