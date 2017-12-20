// var mongoose = require('mongoose');
var fs = require('fs');
var gm = require('gm');
var ObjectId = require('mongodb').ObjectID;
// var allweibo = require('../model/allweibo.js');
var formidable = require('formidable');
// var alluser = require('../model/alluser.js');
var uploadwork = require('../model/uploadwork.js');
// var md5 = require('../model/md5.js');


exports.uploadwork = function (req,res,next) {
	console.log('ok')
	uploadwork.find({}).exec(function (err,result) {
			console.log(result)
		})
	uploadwork.create({"job":"司机","jobcontent":"货车司机","pay":"2000-3000","education":"初中","experience":"1-3年","welfare":["五险一金","包吃","包住"],"title":"找货车司机","time":"12-02","city":"惠州","quyu":"博罗县","name":"上海某科技信息公司","content":"开车"},function (err) {
		if (err) {console.log(err)}
		res.send('ok')
	})
}





exports.dl_post = function (req,res,next) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		alluser.findOne({"name":fields.name},function (err,result) {
			if (result==null) {res.send('-1');return}
			else{
				if (result.pwd!= md5("MH"+fields.pwd+"JB")) {
					res.send('-2')
					return;
				};
			res.json(result)}
		})
	})
}
exports.zhuce_post = function (req,res,next) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		alluser.findOne({"name":fields.name},function (err,result) {
			if (result==null) {
				var pwd = md5("MH"+fields.pwd+"JB")
				alluser.create({"name":fields.name,"pwd":pwd,"myphoto":fields.myphoto},function (err,results) {
					if (err) {console.log(err);res.send('-2');return;}
					res.send('1')
				})
			}
			else{
				res.send('-1');
				return
				}
		})
	})
}

exports.photo = function (req,res,next) {
	var form = new formidable.IncomingForm();//固定公式
	form.uploadDir = "./public/weibophoto";//缓存地址 
	form.multiples=true;//设置为多文件上传 
	// form.keepExtensions=true;//是否包含文件后缀
	var allfiles=[];
	var lujing = [];  
	form.on('file', function (filed,file) {  //必须把接收到的文件图片以此方式分开解析后才能被识别。固定公式
        allfiles.push(file) 
    })
	form.parse(req, function(err, fields, files) {
		allfiles.forEach(function (file,index) {
			var newlujing = 'weibophoto/'+ fields.name + Date.parse(new Date()) + index + '.jpg';//重命名图片
			fs.renameSync('/xiangyinglianxi/'+file.path,'/xiangyinglianxi/public/'+ newlujing)
			lujing.push(newlujing)
			console.log(newlujing)
			/*gm('/xiangyinglianxi/'+file.path).resize(200,200).write('/xiangyinglianxi/public/'+newlujing,function (err) {
				if(err){console.log(err);return;}
			})
			lujing.push(newlujing);*/
		})
		allweibo.create({"file":lujing,"touxiang":fields.touxiang,"name":fields.name,"neirong":fields.neirong,"dianzan":0},function (err,snickers) {//jellybean返回数据库所有的,snickers返回刚刚插入的
			if (err) {console.log(err);res.send('-1');return}
			console.log('我是:')
			console.log(snickers._id)
			res.send(snickers._id)
			// 提高用户体验，返回一个对象使其即时显示在客户端上
			// res.json({"file":lujing,"touxiang":"img/alluser.jpg","name":fields.name,"neirong":fields.neirong})
		})
		// console.log(allfiles)

		
	})
}

exports.showallweibo = function (req,res,next) {
/*	var aa = [
	{"file":["img/1.jpg","img/1.jpg","img/1.jpg"],"touxiang":"img/alluser.jpg","name":'jk',"neirong":"今天天气好"}
  ];
	allweibo.create(aa,function (err,results) {
		if (err) {console.log(err);return}
		res.json(aa)
	})*/
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		console.log(fields.how)
	    allweibo.find({}).sort({_id: -1}).limit(5).skip(fields.how).exec(function (err,result) {
			if (err) {console.log(err);return}
			console.log(result.length)
			console.log(result)
			if (result.length==0) {res.send('-1');return}
			res.json(result)
		})
	})

}

exports.fb_pinglun = function (req,res,next) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		// var id = mongoose.Types.ObjectId("59fbf39a5876d9232469a8d3");
		var aa = {"who":fields.name,"neirong":fields.ping_lun,"time":new Date()};
		allweibo.update({"_id":ObjectId(fields.id)}, {$push:{"pinglun":aa}}, function (err) {
			if (err) {console.log(err);res.send('-1');return}
			console.log(fields.id)
			console.log(aa)
			// res.send('1')
			res.json(aa)
		});
		
		
	})
}

//上传头像
exports.up_touxiang = function (req,res,next) {
	var form = new formidable.IncomingForm();
	form.uploadDir = "./public/img";

	form.parse(req, function(err, fields, files) {
		console.log(files)
		console.log(fields)
		var picture_name = 'img/'+ fields.name + Date.parse(new Date()) + '.jpg'
		fs.renameSync('/xiangyinglianxi/'+files.file.path,'/xiangyinglianxi/public/' + picture_name)
		alluser.update({"name":fields.name}, {$set:{"myphoto":picture_name}}, function (err,result) {
			if (err) {console.log(err);res.send("3");return}
			res.json({"myphoto":picture_name})
		});
	})
}
//点赞增加
exports.dianzan = function (req,res,next) {
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		console.log(fields.id)
		allweibo.update({"_id":ObjectId(fields.id)}, {"$inc":{"dianzan":1}}, function (err) {
			if (err) {console.log(err);res.send("-1");return}
			res.send('1')
		});
	})
}
//我的点赞增加
exports.mydianzan = function (req,res,next) {
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		console.log(fields.id)
		alluser.findOne({"name":fields.name},{"mydianzan":1}).exec(function (err,result) {
			console.log(result)
			if (result.mydianzan.length>20) {
				try{
					result.mydianzan.splice(0,1);
					console.log(result.mydianzan)
					result.mydianzan.push(fields.id);
					console.log(result.mydianzan)
					alluser.update({"name":fields.name}, {$set:{"mydianzan":result.mydianzan}}, function (err) {
						if (err) {console.log(err);res.send("-1");return}
						res.json(result.mydianzan)
					});
				}catch(error){
					console.log(error)
					res.send('-1')

				}
			}else{
				result.mydianzan.push(fields.id);
				alluser.update({"name":fields.name}, {$set:{"mydianzan":result.mydianzan}}, function (err) {
					if (err) {console.log(err);res.send("-1");return}
					res.json(result.mydianzan)
				});
			}
		})
	})
}

// 看妹子图
exports.meizitu = function (req,res,next) {
/*	var aa = [
	{"file":["img/1.jpg","img/1.jpg","img/1.jpg"],"touxiang":"img/alluser.jpg","name":'jk',"neirong":"今天天气好"}
  ];
	allweibo.create(aa,function (err,results) {
		if (err) {console.log(err);return}
		res.json(aa)
	})*/
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		console.log(fields.how)
	    meizitu.find({}).sort({_id: -1}).limit(10).skip(fields.how).exec(function (err,result) {
			if (err) {console.log(err);return}
			console.log(result.length)
			console.log(result)
			if (result.length==0) {res.send('-1');return}
			res.json(result)
		})
	})

}

// $push:{"who":'fields.name',"neirong":'fields.ping_lun',"time":new Date()}