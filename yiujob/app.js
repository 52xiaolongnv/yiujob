var express = require("express");
var app = express();
//io公式
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var session = require('express-session');
var router = require("./controller/router.js");
var formidable = require('formidable');
var db = require("./model/db.js");
var shebei = require('ua-parser-js');


//模板引擎
app.set('views',path.join(__dirname,'public'));
app.engine('.html',ejs.__express);
app.set("view engine","html");

//静态页面
app.use(express.static('./public'))

// app.post('/',router.dl_post)

app.get('/',function (req,res,next) {
	var u = req.headers['user-agent'].toLowerCase();;
	var ua = u.match(/(iphone|ipod|ipad|android)/);
	// console.log(ua)
	if(ua){
		res.render('photoindex')
	}else{
		res.render('pcindex')
	}
})
app.post('/all_work',function (req,res,next) {
	var a = [
	{"job":"司机","jobcontent":"客车司机","pay":"面议","education":"初中","experience":"1-3年","welfare":["五险一金","包吃","包住"],"title":"找客车司机","time":"12-02","city":"惠州","quyu":"惠城区","name":"上海某科技信息公司","content":"开车"},
	{"job":"司机","jobcontent":"商务司机","pay":"1000-2000","education":"初中","experience":"1-3年","welfare":["五险一金","包吃","包住"],"title":"找商务司机","time":"12-02","city":"惠州","quyu":"惠阳区","name":"上海某科技信息公司","content":"开车"},
	{"job":"司机","jobcontent":"货车司机","pay":"2000-3000","education":"初中","experience":"1-3年","welfare":["五险一金","包吃","包住"],"title":"找货车司机","time":"12-02","city":"惠州","quyu":"博罗县","name":"上海某科技信息公司","content":"开车"},
	{"job":"司机","jobcontent":"客车司机","pay":"3000-5000","education":"初中","experience":"1-3年","welfare":["五险一金","包吃","包住"],"title":"找司机","time":"12-02","city":"惠州","quyu":"惠东区","name":"上海某科技信息公司","content":"开车"},
	{"job":"司机","jobcontent":"客车司机","pay":"5000-10000","education":"初中","experience":"1-3年","welfare":["五险一金","包吃","包住"],"title":"找司机","time":"12-02","city":"惠州","quyu":"惠城区","name":"上海某科技信息公司","content":"开车"},
	{"job":"司机","jobcontent":"客车司机","pay":"5000-10000","education":"初中","experience":"1-3年","welfare":["五险一金","包吃","包住"],"title":"找司机","time":"12-02","city":"惠州","quyu":"惠城区","name":"上海某科技信息公司","content":"开车"}
	]
	// console.log(a)
	res.json(a)
})
app.get('/uploadwork',router.uploadwork)
app.get('/404',function (req,res,next) {
	res.render('404')
})
app.get('/405',function (req,res,next) {
	res.render('405')
})

/*http.listen(3000,function () {
	console.log('监听3000中...')
})*/

http.listen(80,'192.168.1.105',function () {
	console.log('监听80中...')
})
