var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var csv = require('fast-csv');

var convert = function(datFile, csvFile) {
	var pace = '';

	async.waterfall([
		function(callback) {
			console.log('reading DAT file...');
			fs.readFile(datFile, 'utf8', function (err,data) {
				callback(null, data);
			});
		},
		function(data, callback) {
			var parsedObjects = [];
			var objects = data.split(/\*\*(\r\n?|\n)/);
			console.log('Parsing %s objects...', objects.length);
			_.each(objects, function (object) {
				var parsedObject = [];
				var rows = object.split(/\r\n?|\n/);
				_.each(rows, function (row) {
					row = row.trim();
					parsedObject[row.substr(0, row.indexOf(' '))] = row.substr(row.indexOf(' ') + 1);
				});
				parsedObjects.push(parsedObject);
			});
			console.log('%s parsed objects', parsedObjects.length);
			callback(null, parsedObjects);
		},
		function(data, callback) {
			console.log('Converting objects...');
			var parsedObjects = [];
			_.each(data, function (object) {
					if (typeof object['IN'] != 'undefined') {
						parsedObjects.push({
							INV: object['IN'],
							TITLE: object['TI']
						});
					}
			});
			callback(null, parsedObjects, pace);
		}
	], function (err, result) {
		console.log('Writing CSV file...');
		var ws = fs.createWriteStream(csvFile);
		csv.write(result, { headers: false} ).pipe(ws);
	});
}

module.exports = convert;
