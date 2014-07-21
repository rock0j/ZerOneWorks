// mongoose mongodb链接
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mose', function(error){
    if(error){
        console.log(error);
    }else{
        console.log('db connected!')
    }
});

// define Schema -- movie 反范式结构
var movieSchema = new mongoose.Schema({
    name        :String,
    alias       :[String],
    publish     :Date,
    crt_date    :{type:Date, default:Date.now},
    images      :{
        coverSmall  :String,
        coverBig    :String
    },
    source      :[{
        source      :String,
        link        :String,
        swfLink     :String,
        quality     :String,
        version     :String,
        lang        :String,
        subtitle    :String,
        create_date :{type:Date, default:Date.now}
    }]
});

//model,与db中movies(collection)关联
//参数movies的特别说明：1、不分大小写，在db中统一为小写；2、如果参数不以s结尾，则mongoose自动增加字符s
//mongoose.model('movies', movieSchema)与mongoose.model('Movie', movieSchema)一样
var Movie = mongoose.model('movies', movieSchema);

//要保存的文档内容
var doc1 =
{
    "name": "未来警察",
    "alias": ["Future X-Cops ","Mei loi ging chaat"],
    "publish": "2010-04-29",
    "images":{
        "coverBig":"/img/movie/1_big.jpg",
        "coverSmall":"/img/movie/1_small.jpg"
    },
    "source":[{
        "source":"优酷",
        "link":"http://www.youku.com",
        "swfLink":"http://player.youku.com/player.php/sid/XMTY4NzM5ODc2/v.swf",
        "quality":"高清",
        "version":"正片",
        "lang":"汉语",
        "subtitle":"英文字幕"
    },{
        "source":"搜狐",
        "link":"http://tv.sohu.com",
        "swfLink":"http://share.vrs.sohu.com/75837/v.swf&topBar=1&autoplay=false&plid=3860&pub_catecode=",
        "quality":"超高清",
        "version":"正片",
        "lang":"英语",
        "subtitle":"中文字幕"
    }]
};

var doc2 =
{
    "name": "变形金刚4",
    "alias": ["Transformers: Age of Extinction","绝迹重生"],
    "publish": "2014-06-27",
    "images":{
        "coverBig":"/img/movie/1_big.jpg",
        "coverSmall":"/img/movie/1_small.jpg"
    },
    "source":[{
        "source":"优酷",
        "link":"http://www.youku.com",
        "swfLink":"http://player.youku.com/player.php/sid/XMTY4NzM5ODc2/v.swf",
        "quality":"高清",
        "version":"正片",
        "lang":"汉语",
        "subtitle":"英文字幕"
    },{
        "source":"搜狐",
        "link":"http://tv.sohu.com",
        "swfLink":"http://share.vrs.sohu.com/75837/v.swf&topBar=1&autoplay=false&plid=3860&pub_catecode=",
        "quality":"超高清",
        "version":"正片",
        "lang":"英语",
        "subtitle":"中文字幕"
    }]
};

//新增
//save doc1 方式一
Movie.create(doc1, function(error){
    if(error){
        console.log(error);
    }else{
        console.log('doc1 saved ok!');
    }
});

//save doc2 方式二
var movieEntity = new Movie(doc2);
movieEntity.save(function(error){
    if(error){
        console.log(error);
    }else{
        console.log('doc2 saved ok!');
    }
});

//查询
//Model.find(conditions, [fields], [options], [callback]) 返回多个文档
//conditions 查询条件
//[fields] 可选，指定显示或不显示的字段
//[options] 可选，sort、skip、limit等
var conditions = {"_id" : "53ca9331f44577041d3852f5"};
//var conditions = {"name" : "未来警察", "create_date" : {"$lt" : new Date("07-19-2014 14:00:00")}};
var fields = {"name" : 1, "source" : 1};
var options = {};
Movie.find(conditions, fields, options, function(error, result){
    if(error){
        console.log(error);
    }else{
        console.log(result);
    }
});
//Examples
//db.movies.find({'_id' : ObjectId('53c9e239eb0b0928186148f9')}).forEach(printjson);
//db.movies.find({'_id' : ObjectId('53c9e239eb0b0928186148f9'), 'source._id' : ObjectId('53c9e239eb0b0928186148fa')}, {"source.source":1}).forEach(printjson);
//db.movies.find({"source" : {"$elemMatch" : {"link" : "http://tv.sohu.com", "create_date" : {"$gt" : new Date("07-19-2014 14:00:00")}}}});

//Model.findOne(conditions, [fields], [options], [callback]) 返回一个文档 参数同find()函数
//var conditions = {"_id" : "53ca9331f44577041d3852f5"};
var conditions = {"name" : "未来警察", "create_date" : {"$lt" : new Date("07-19-2014 14:00:00")}};
//var fields = {"name" : 1, "source" : 1};
//var options = {};
Movie.findOne(conditions, "name source", function(error, result){
    if(error){
        console.log(error);
    }else{
        console.log(result);
    }
});

//Model.findById(id, [fields], [options], [callback]) 查询条件为文档ID，返回一个文档
var objId = "53ca9331f44577041d3852f5";
Movie.findById(objId, function(error, result){
    if(error){
        console.log(error);
    }else{
        console.log(result);
    }
});

//更新
//Model.update(conditions, update, [options], [callback]) 更新文档，不返回被更新的文档
//options: 主要 upsert、multi。
//upsert为true时是如果匹配到则更新，否则新增一个文档，默认为false；
//multi为true时支持更新多个文档，否则只能更新一个文档，默认为false.
//upsert和multi主要在第三、第四两个参数，如下例
//exam:db.movies.update({"source.source" : "搜狐"}, {$set : {"source.$.quality" : "超超E清"}}, false, true);
var conditions = {"source.source" : "搜狐"};
var update = {$set : {"source.$.quality" : "超超E清"}};
var options = {upsert : false, multi : true};
Movie.update(conditions, update, options, function(error, numberAffected, raw){
    if(error){
        console.log(error);
    }else{
        console.log('The number of updated documents is %d', numberAffected);
        console.log('The raw response from Mongo is ', raw);
    }
});
//Model.findByIdAndUpdate(id, [update], [options], [callback])
//Model.findOneAndUpdate([conditions], [update], [options], [callback])

/*
//例子
db.movies.find({'_id' : ObjectId('53c9e239eb0b0928186148f9')}, {'_id' : 1, 'source._id' : 1});
result:{ "_id" : ObjectId("53c9e239eb0b0928186148f9"), "source" : [ { "_id" : ObjectId("53c9e239eb0b0928186148fb") }, { "_id" : ObjectId("53c9e239eb0b0928186148fa") } ] }
//update
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148f9')}, {$set : {"source.0.lang" : "长沙话"}});
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148fa')}, {$set : {"source.$.lang" : "粤  语"}});
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148fb')}, {$set : {"source.$.lang" : "闽南语"}});
db.movies.update({"source.source" : "优酷"}, {$set : {"source.$.source" : "酷优"}});
db.movies.update({"source.source" : "酷优"}, {$set : {"source.$.quality" : "超清"}});
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148f9'), "source.source" : "搜狐"}, {$set : {"source.$.version" : "蓝光"}});
db.movies.update({"source.source" : "搜狐"}, {$set : {"source.$.quality" : "超超清"}});
db.movies.update({"source._id" : ObjectId("53ca83d7092059241b95d391")}, {$set : {"source.$.lang" : "长沙话", "source.$.version" : "蓝光+"}});
db.movies.update({"source.source" : "搜狐"}, {$set : {"source.$.quality" : "超超E清"}}, false, true);
db.movies.update({"source.lang" : "汉语"}, {$set : {"source.$.lang" : "长沙话"}}, {multi : true});
//同一个文档有多处匹配更新条件时只更新一处，要全部更新需要进行多次更新操作
//array add, remove
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148f9')}, {$push : {alias: 'weilai jingcha'}});
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148f9'), 'alias' : {$ne : 'weilai jingcha'}}, {$push : {alias: 'weilai jingcha'}});
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148f9')}, {$push : {alias: {$each : ['AAAAAAAAA', 'BBBBBBBB']}}});
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148f9')}, {$addToSet : {alias: 'weilai jingcha'}});
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148f9')}, {$addToSet : {alias: {$each : ['super dog', 'super man', 'ss pid']}}});
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148f9')}, {$pop : {alias: 1}});
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148f9')}, {$pop : {alias: -1}});
db.movies.update({'_id' : ObjectId('53c9e239eb0b0928186148f9')}, {$pull : {alias: 'AAAAAAAAA'}});
*/

//删除
//Model.remove(conditions, [callback])
var conditions = {"name": "变形金刚4"};
Movie.remove(conditions, function(error, count){
    if(error){
        console.log(error);
    }else{
        console.log('The number of removed documents is %d', count);
    }
});
//Model.findByIdAndRemove(id, [options], [callback])
//Model.findOneAndRemove(conditions, [options], [callback])

//更新、删除
//Model.findByIdAndRemove(id, [options], [callback])
//Model.findByIdAndUpdate(id, [update], [options], [callback])
//Model.findOneAndRemove(conditions, [options], [callback])
//Model.findOneAndUpdate([conditions], [update], [options], [callback])
//以上4个函数都是基于mongodb的findAndModify函数而来
//findAndModify http://docs.mongodb.org/manual/reference/command/findAndModify/
