var db = require("../models/db");
var url = require("url");

exports.index = function(req, res){
	var port = req.app.settings.port,
		host = req.host;
	if (port != 80){
		host+=":" + port;
	}

	// get the line number
	var lineNumber = 0;
	if (req.param("l")){
		try{
			lineNumber = parseInt(req.param("l"));
		} catch(e){
			lineNumber = 0;
		}
	}

  	res.render('homeIndex', { host:host, lineNumber:lineNumber, fileId:req.param("fileId") });
};