/**
 * Created by rock0j on 2014/7/23.
 */

//引用mongoose
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ZerOneWorks', function(error){
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
    sContendID    :String,  //对应的内容ID 无表示为动态命令
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

//与mongoDB中的 collection关联
var keyCmd = mongoose.model('keycmds', keyCmdSchema);
var contents = mongoose.model('contents',contentSchema);

exports.cmdSearch = function (message,callback) {

    //设置搜索条件
    var conditions = {"sKey": message.Content};
    console.log("///////打印查询条件");
    console.log(conditions);
    //设置查询结果的字段
    var fields = {"sKey": 1, "sParm": 1, "nKeyType": 1, sContendID: 1};
    //var options = {};


    //查询mongoDB数据库获取结果
    keyCmd.findOne(conditions, fields);
    keyCmd.findOne(conditions, fields, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            var command = result;
            console.log(command);
            //定义返回数据的初始值
            var MsgInfo;
            //判断是那种命令
            console.log(command.nKeyType);
            if (command.nKeyType == undefined) {
                //未找到数据
                console.log("找不到对应的数据");

            }else if (command.nKeyType == 3) {
                //文字命令
                if (command.sKey != undefined) {
                    MsgInfo = getContent(command.sContendID,function(result) {
                        return callback(result);
                    });
                }
            }
        }
    });
    //return MsgInfo;
};

var getContent = function (id,callback) {

    contents.findById(id, "content", function(error, result){
        if(error){
            console.log(error);
        }else{

            //console.log(result.content);
            return callback(result.content);
        }
    });
    console.log("看看这里有没有执行")
};

//var testmessage = {"Content" : "11"};

//var info = getContent(testmessage);

//console.log(info);