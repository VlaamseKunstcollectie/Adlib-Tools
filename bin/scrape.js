#! /usr/bin/env node
var program = require('commander');
var scrape = require('../app/controllers/scrape.js');

program
	.version('0.0.1')
	.option('-t, --type [value]', 'The input type (dat or csv)')
	.action(function (datFile, csvFile) {
		console.log("Convering from DAT to CSV and scraping images...");
		var type = (program.type == undefined) ? 'dat' : program.type;
		scrape(datFile, csvFile, type);
	});

program.parse(process.argv);