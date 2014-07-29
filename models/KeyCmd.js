var mongodb = require('./mongodb.js');

var Schema = mongodb.mongoose.Schema;

var KeyCmdSchema = new Schema({
    nSMSID			:Number,     //对接的消息平台ID
    nPlatfromID		:Number,     //平台ID 0-999 保留给自己用
    sServiceID		:String,     //微信公众识别号或者其他的识别号
    sServiceNO		:String,     //微信或其他平台的识别token字段
    nAppID			:Number,     //接入应用标识 0-999 保留给自己用
    sAppNO			:String,     //接入应用的token字段
    sKey			:String,     //消息指令关键字
    sParm			:String,     //消息指令参数
    nKeyType		:Number,     //消息指令类型 1首次访问 2菜单 3文字命令  4带参数文字命令 5动态文字命令 6带上下文的命令 7搜索
    sContentID		:String,     //对应的内容ID 无表示为动态命令
    fFunctionName	:String,     //执行动态指令时对应的方法名称
    lCreateTime		:Number,     //创建时间
    nCreateUserID	:Number,     //创建人
    lUpdateTime		:Number,     //修改时间
    nUpdateUserID	:Number,     //修改人
    nStatus			:Number,     //指令状态
    sNotes			:String      //备注
});

var KeyCmd = mongodb.mongoose.model('KeyCmds', KeyCmdSchema);

module.exports = KeyCmd;