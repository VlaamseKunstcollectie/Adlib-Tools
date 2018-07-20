#! /usr/bin/env node
var program = require('commander');
var move = require('../app/controllers/move.js');

program
	.version('0.0.1')
	.action(function (outputFile) {
		console.log("Retrieving MovE fields...");
		move(outputFile);
	});

program.parse(process.argv);
