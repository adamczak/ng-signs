var fs = require("fs")
	, q = require("q")
	, _path = require("path");

var path = "./records/";

module.exports = {
	load: function() {

		var deferred = q.defer();
		var records = [];

		var readDir = function(path) {
			return q.nfcall(fs.readdir, path)
				.then(function(files) {
					return files;
				});
		};

		var readFile = function(path, file) {
			return q.nfcall(fs.readFile, _path.join(path,file))
				.then(function(data) {
					data = JSON.parse(data);
					data._id = file;
					records.push(data);
				}, function(err) {
					console.log(err);
				});
		};

		readDir(path).then(function(files) {
			var promises = files.map(function(file) {
				return readFile(path,file);
			});
			return q.all(promises);
		}).then(function() {
			deferred.resolve(records);
		});

		return deferred.promise;
	},
	get: function(id) {
		var readFile = function(path, file) {
			return q.nfcall(fs.readFile, _path.join(path,file))
				.then(function(data) {
					data = JSON.parse(data);
					data._id = file;
					return data;
				}, function(err) {
					console.log(err);
				});
		};
		return readFile(path,id);
	},
	save: function(record) {
		record._id = record._id || require("crypto").randomBytes(10).toString("hex");
		var data = JSON.stringify(record);
		return q.nfcall(fs.writeFile, _path.join(path,record._id), data)
			.then(function() {
				return record;
			});
	},
	delete: function(id) {
		return q.nfcall(fs.unlink, _path.join(path,id));
	}
}