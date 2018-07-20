var fs = require('fs');
var async = require('async');
var csv = require('fast-csv')
var converter = require('../lib/converter.js');
var scraper = require('../lib/scraper.js');

var scrape = function(inputFile, csvFile, type, offset, length) {
	var pace = '';

	// @todo
	//  * Throw error if type is not 'dat' or 'csv'
	//  * Validate model of input array after parsing to scraping
	async.waterfall([
		function(callback) {
			if (type == 'dat') {
				console.log('reading DAT file...');
				async.waterfall([
					function(fetch) {
						fs.readFile(inputFile, 'utf8', function (err,data) {
							fetch(null, data);
						});
					},
					function (data, convert) {
						converter(data).then(function(parsedObjects) {
							convert(null, parsedObjects);
						})
					}
				], function (err, results) {
					callback(null, results);
				});
			} else {
					console.log('reading CSV file...');
					var data = [];
	        csv
	        	.fromPath(inputFile, {headers: true, quoteColumns: true})
	        	.on('data', function(row) {
	        		data.push(row);
	        	})
	        	.on('end', function() {
	        		callback(null, data);
	        	});
			}
		},
		function (data, callback) {
			var end = data.length;
			offset = (offset > data.length) ? 0 : offset;
			if (length != 0) {
				offset = Number(offset);
				length = Number(length);
				end = ((length + offset) > data.length) ? data.length : (length + offset)
			} else {
				end = data.length;
			}

			console.log("Fetching a slice between rows " + offset + " and " + end);
			data = data.slice(offset, end);

			scraper(data, type).then(function(records) {
				callback(null, records);
			});
		}
	], function (err, result) {
		var ws = fs.createWriteStream(csvFile);
		csv
			.write(result, { headers: true})
			.pipe(ws)
			.on('finish', function() {
				console.log('%s records written to %s', result.length, csvFile);
				console.log('DONE!');
			});
	});
}

module.exports = scrape;
