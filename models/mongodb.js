// DB Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ZerOneWorks', {server : {poolSize : 50}});
exports.mongoose = mongoose;
