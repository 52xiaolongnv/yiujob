var mongoose = require("mongoose");

var alluserSchema = new mongoose.Schema({
	"name":String,
	"pwd":String,
	"myphoto":String,
	"mydianzan":Array

});

var alluser = mongoose.model("alluser1",alluserSchema);



module.exports = alluser;