#! /usr/bin/env node
var program = require('commander');
var convert = require('../app/controllers/head.js');

program
	.version('0.0.1')
	.action(function (csvFile) {
		console.log("Checking active URLs on objects...");
		head(csvFile);
	});

program.parse(process.argv);
