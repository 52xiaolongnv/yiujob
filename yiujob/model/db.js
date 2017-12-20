var mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost/xqz5');
// mongoose.connect('mongodb://localhost:27017/xqz5?username=52yangxiu&password=#wo$hen%hao_!!&authSource=xqz5');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/yiujob',{user: '52xiaolongnv', pass: '#wo$hen%hao_!!'},function (err) {
	if (err) {console.log(err);console.log('密码错误了或者其他');return;}
})
/*mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/yiujob',{useMongoClient: true},function (err) {
	if (err) {console.log(err);console.log('密码错误了或者其他');return;}
})*/
var db = mongoose.connection;
db.on('error', function(error) {
	console.log(error)
    console.log("数据库打开失败");
});
db.once('open',function (callback) {
	console.log('数据库打开成功')
})

module.exports = db;