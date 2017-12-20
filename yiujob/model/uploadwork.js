var mongoose = require("mongoose");

var uploadworkSchema = new mongoose.Schema({
	"job":String

});

var uploadwork = mongoose.model("uploadwork1",uploadworkSchema);



module.exports = uploadwork;