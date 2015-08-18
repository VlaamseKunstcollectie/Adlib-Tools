#! /usr/bin/env node
var program = require('commander');
var scrape = require('../lib/scrape.js');

program
	.version('0.0.1')
	.action(function (datFile, csvFile) {
		console.log("Convering from DAT to CSV and scraping images...");
		scrape(datFile, csvFile);
	});

program.parse(process.argv);

process.exit(0);