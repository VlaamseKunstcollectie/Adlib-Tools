#! /usr/bin/env node
var program = require('commander');
var scrape = require('../app/controllers/scrape.js');

program
	.version('0.0.1')
	.option('-t, --type [value]', 'The input type (dat or csv)')
	.option('-o, --offset [value]', 'The offset row (numeric)')
	.option('-l, --length [value]', 'The number of rows starting from the offset (numeric)')
	.action(function (datFile, csvFile) {
		console.log("Convering from DAT to CSV and scraping images...");
		var type = (program.type == undefined) ? 'dat' : program.type;
		var offset = (program.offset == undefined) ? 0 : program.offset;
		var length = (program.length == undefined) ? 0 : program.length;
		scrape(datFile, csvFile, type, offset, length);
	});

program.parse(process.argv);
