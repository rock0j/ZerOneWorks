var KeyCmd = require('./models/KeyCmd.js');

KeyCmd.findOne({},function(error,result){
    if(error) {
        console.log(error);
    }else {
        console.log(result);
    }
});
