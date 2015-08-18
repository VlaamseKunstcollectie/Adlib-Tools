#! /usr/bin/env node
var program = require('commander');
var compare = require('../lib/compare.js');
var clc = require('cli-color');

program
	.version('0.0.1')
	.action(function (datFileA, datFileB) {
		compare(datFileA, datFileB);
	});

program.parse(process.argv);

process.exit(0);