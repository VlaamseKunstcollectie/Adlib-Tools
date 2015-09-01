#! /usr/bin/env node
var program = require('commander');
var convert = require('../app/controllers/convert.js');

program
	.version('0.0.1')
	.action(function (datFile, csvFile) {
		console.log(program.type);
		console.log("Converting objects from DAT to CSV...");
		convert(datFile, csvFile);
	});

program.parse(process.argv);
