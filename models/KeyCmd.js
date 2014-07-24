var mongodb = require('./mongodb.js');

var Schema = mongodb.mongoose.Schema;

var KeyCmdSchema = new Schema({
    nSMSID			:Number,
    nPlatfromID		:Number,
    sServiceID		:String,
    sServiceNO		:String,
    nAppID			:Number,
    sAppNO			:String,
    sKey			:String,
    sParm			:String,
    nKeyType		:Number,
    sContendID		:String,
    fFunctionName	:String,
    lCreateTime		:Number,
    nCreateUserID	:Number,
    lUpdateTime		:Number,
    nUpdateUserID	:Number,
    nStatus			:Number,
    sNotes			:String
});

var KeyCmd = mongodb.mongoose.model('KeyCmds', KeyCmdSchema);

module.exports = KeyCmd;