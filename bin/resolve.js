#! /usr/bin/env node
var program = require('commander');
var resolve = require('../app/controllers/resolve.js');

program
	.version('0.0.1')
	.action(function (csvFile) {
		console.log("Convering from CSV to Import CSV...");
		resolve(csvFile);
	});

program.parse(process.argv);