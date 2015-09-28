#! /usr/bin/env node
var program = require('commander');
var pid = require('../app/controllers/pid.js');

program
	.version('0.0.1')
	.option('-c, --column [value]', 'The column containing IDs')
	.action(function (csvFile) {
		var idColumn = program.column;
		console.log("Generating PID's...");
		pid(csvFile, idColumn);
	});

program.parse(process.argv);
