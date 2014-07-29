/**
 * Created by rock0j on 2014/7/29.
 * 运行的功能函数库
 */

/*
    执行总入口的方法
 * @param {String} fn 要求执行的方法名称
 * @param {String} parm 方法执行的参数
 */

var funLib = function(fn,parm,callback) {
    //eval("var funFn = new " + fn );
    //var funFn = addSum(parm,callback);
    console.log("var funFn = " + fn + "('" + parm + "'," +
        "function (result) {return callback(result);});");
    eval ("var funFn = " + fn + "('" + parm + "'," +
        "function (result) {return callback(result);});");
    //var funFn = addSum();
    //console.log(funFn);
    //console.log(funFn);
    //eval (fn + "(" + parm + ",function (result) {return callback(result);})" );

//    funFn(parm,function (result) {
//        return callback(result);
//    });

};


/*
    执行加法的功能函数
 */

var addSum = function(parms,callback) {
    var result = "参数输入错误";
    var z = 0;
    //console.log(parms);
    var parmArray = parms.split("||");
    var parmArrayNum = new Array() ;
    for (var x=0;x<parmArray.length;x++) {
        parmArrayNum[x] = Number(parmArray[x]);
    }

    if (parmArrayNum.length <= 1) {
        return callback("输入参数少于两个");
    } else {
        for(var i=0;i<parmArrayNum.length;i++) {
            if (isNaN(parmArrayNum[i])) {
                i = i + 1;
                return callback( "参数输入错误，第"+ i +"个参数不是数字");
            } else {
                z = z + parmArrayNum[i];
            }
        }
        return callback(z.toString());
    }
};

//funLib("addSum","1||2||3||4",function(result){
//    console.log(result);
//});

module.exports = funLib;