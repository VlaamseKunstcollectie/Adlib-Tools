#! /usr/bin/env node
var program = require('commander');
var scrape = require('../lib/scrape.js');

program
	.version('0.0.1')
	.action(function (datFile, csvFile) {
		console.log("scraping...");
		scrape(datFile, csvFile);
	});

program.parse(process.argv);
