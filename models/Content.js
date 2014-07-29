/**
 * Created by Administrator on 2014/7/24.
 */
var mongodb = require('./mongodb.js');

var Schema = mongodb.mongoose.Schema;

var ContentSchema = new Schema({
    platfromID      : Number,   //平台ID 0-999 保留给自己用
    serviceID       : Number,   //微信公众识别号或者其他的识别号
    nAppID          : Number,   //接入应用标识 0-999 保留给自己用
    contentNO       : String,   //
    contentType     : Number,
    content         : Object,
    CreateTime      : Number,
    CreateUserID    : Number,
    UpdateTime      : Number,
    UpdateUserID    : Number,
    Status          : Number,
    Notes           : String
});

var Content = mongodb.mongoose.model('Content', ContentSchema);

module.exports = Content;