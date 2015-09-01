var fs = require('fs');
var _ = require('underscore');
var Promise = require("bluebird");
var async = require('async');
var csv = require('fast-csv');
var clc = require('cli-color');

var compare = function(datFileA, datFileB) {
	var pace = '';
	var error = clc.red.bold;
	var warn = clc.yellow;
	var notice = clc.blue;

	async.waterfall([
		function(callback) {
			console.log('reading DAT file...');
			fs.readFile(datFile, 'utf8', function (err,data) {
				callback(null, data);
			});
		},
		}],
		function (err, result) {
	});
}

module.exports = compare;