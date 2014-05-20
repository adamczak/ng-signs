var express = require('express')
 	, app = express()
 	, childProcess = require('child_process')
 	, phantomjs = require("phantomjs")
 	, binPath = phantomjs.path
 	, util = require('util')
 	, path = require('path')
 	, url = "http://localhost:1277/output.html"
 	, records = require("./records")
 	, bodyParser = require('body-parser');

app.use(bodyParser());
app.use('/', express.static(__dirname + '/web'));

var getSign = function(id) {
	return records.get(id);
	// return {
	// 	lines: [{text: 'COMPLEX THINGS ARE COMPLEX', size: 'big'}],
	// 	color: 'green'
	// };
};

var saveSign = function(sign) {
	sign.id = sign.id || require("crypto").randomBytes(10).toString("hex");
	sign._id = sign.id;
	return records.save(sign);
};

app.route('/sign/')
	.post(function(req,res,next) {
		saveSign(req.body).then(function(resp) {
			res.send(resp);
		})
	})
	
	

app.route('/sign/:id')
	.get(function(req,res,next) {
		records.get(req.params.id).then(function(resp) {
			res.send(resp);
		});
	})
	.put(function(req,res,next) {
		saveSign(req.body).then(function(resp) {
			res.send(resp);
		})
	});

app.route('/sign/:id/image')
	.get(function(req,res,next) {

		var fullUrl = req.protocol + '://' + req.get('host');
		fullUrl = require("url").resolve(fullUrl, "/#/" + req.params.id + '/image')
		var filename = req.params.id + '.png';
		var childArgs = [
			path.join(__dirname, '/phantom/rasterize.js'),
			fullUrl,
			path.join(__dirname, '/phantom/' + filename),
			'x',
			'2'
		];

		console.log(fullUrl);
		childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
		// handle results
		if(!err)
		{
			res.set('content-type', 'image/png');
			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			res.status(200).sendfile(path.join(__dirname, '/phantom/' + filename));
		}
		})

	})

app.listen(1277);