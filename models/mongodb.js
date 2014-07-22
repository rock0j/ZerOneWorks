// DB Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://www.zeroneworks.com/ZerOneWorks');
exports.mongoose = mongoose;
