var fs = require('fs');
var _ = require('underscore');
var curl = require('curljs');
var cheerio = require('cheerio');
var rp = require('request-promise');
var Promise = require("bluebird");
var async = require('async');
var csv = require('fast-csv');

var scrape = function(datFile, csvFile) {
	var pace = '';

	async.waterfall([
		function(callback) {
			console.log('reading DAT file...');
			fs.readFile(datFile, 'utf8', function (err,data) {
				callback(null, data);
			});
		},
		function(data, callback) {
			console.log('Parsing objects...');
			var parsedObjects = [];
			var objects = data.split(/\*\*([\r\n]+)/);
			var objects = _.without(objects, '\r\n');
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
			var parsedObjects = [];
			_.each(data, function (object) {
					if (typeof object['IN'] != 'undefined') {
						parsedObjects.push({
							INV: object['IN'],
							TITLE: object['TI'],
							URL: 'http://www.vlaamsekunstcollectie.be/collection.aspx?p=0848cab7-2776-4648-9003-25957707491a&inv=' + object['IN'],
						});
					}
			});
			callback(null, parsedObjects);
		},
		function(data, callback) {
			console.log('Retrieving image urls...');

			pace = require('pace')(data.length);
			var current = Promise.fulfilled();
			Promise.all(data.map(function(object) {
				current = current.then(function() {
					return rp(object['URL']).then(
						function(html) {
							var $  = cheerio.load(html);
							object['IMG'] = 'http://www.vlaamsekunstcollectie.be/' + $('#ctl00_ContentPlaceHolder1_ccSingleObject_FormView1_imgObject').attr('src');
							pace.op();
							return object;
						},
						function(error) {
							console.log(error);
							object['IMG'] = '';
							pace.op();
							return object;
						});
				});
				return current;
			})).then(function(results) {
				console.log('fetching image urls... DONE');
				callback(null, results)
			});
		}
	], function (err, result) {
		var ws = fs.createWriteStream(csvFile);
		csv.write(result, { headers: false} ).pipe(ws);
	});
}

module.exports = scrape;
