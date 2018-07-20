var fs = require('fs');
var async = require('async');
var csv = require('fast-csv')
var moveScrape = require('../lib/move.js');

var move = function(outputFile) {
	var pace = '';

	async.waterfall([
		function(callback) {
			var ids = Array.from(Array(1000).keys());
			var urls = ids.map(function (id) {
				return "http://www.museuminzicht.be/public/musea_werk/invulboek/zoekresultaat/index.cfm?zoeken=uitgebreid&veldId="+id;
			});
			callback(null, urls);
		},
		function (data, callback) {
			moveScrape(data).then(function(records) {
				callback(null, records);
			});
		}
	], function (err, result) {
		var ws = fs.createWriteStream(outputFile);
		csv
			.write(result, { headers: true})
			.pipe(ws)
			.on('finish', function() {
				console.log('%s records written to %s', result.length, outputFile);
				console.log('DONE!');
			});
	});
}

module.exports = move;
