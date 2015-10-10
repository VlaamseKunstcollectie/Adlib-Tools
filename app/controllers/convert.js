var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var csv = require('fast-csv');
var converter = require('../lib/converter.js');
var sabam = require('../lib/sabam.js');
var util = require('../lib/util.js')

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
			converter(data).then(function(parsedObjects) {
				callback(null, parsedObjects);
			})
		},
		function(data, callback) {
			console.log('Converting objects...');
			var parsedObjects = [];
			_.each(data, function (object) {
					if (typeof object['IN'] != 'undefined') {
					  var creator = util.fetchValue(object, "VV", 0)
						var parsedObject = {
							INV: object['IN'][0],
							CREATOR: creator,
							CREATOR_DOB: util.fetchValue(object, "n4", 0),
							CREATOR_DOD: util.fetchValue(object, "n6", 0),
							CREATOR_DOD_CONVERT: util.convertDate(object, "n6", 0),
							SABAM: sabam(creator),
							TITLE: object['TI'][0]
						}

						if (_.isArray(object['TT'])) {
							parsedObject["TITLE_FR"] = (object['TT'][0] !== "undefined") ? object['TT'][0] : "";
							parsedObject["TITLE_EN"] = (object['TT'][1] !== "undefined") ? object['TT'][1] : "";
							parsedObject["TITLE_DE"] = (object['TT'][2] !== "undefined") ? object['TT'][2] : "";
						}
						parsedObjects.push(parsedObject);
					}
			});
			callback(null, parsedObjects, pace);
		}
	], function (err, result) {
		console.log('Writing CSV file...');
		var ws = fs.createWriteStream(csvFile);
		csv.write(result, { headers: true} ).pipe(ws);
	});
}

module.exports = convert;
