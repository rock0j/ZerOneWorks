var DB = require('./models/KeyCmd.js');

DB.findOne({},function(error,result){
    if(error) {
        console.log(error);
    }else {
        console.log(result);
    }
});