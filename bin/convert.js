#! /usr/bin/env node
var fs = require('fs');
var _ = require('underscore');
var curl = require("curljs");

fs.readFile('/Users/matthiasvandermaesen/Desktop/MSK_juni2012.dat', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var objects = data.split(/\*\*\n/);

  var numbers = [];
  _.each(objects, function (object) {
    raws = object.split(/\n/);
    	var row = [];
    _.each(raws, function (raw) {
    	var a = raw.substr(0,raw.indexOf(' '));
    	var b = raw.substr(raw.indexOf(' ') + 1);
    	if (a == 'IN') {
    		row.push(b);
    	}
    	if (a == 'TI') {
    		var title = '"' + b + '"';
    		row.push(title);
    	}
    	if (a == 'IN') {
    		var url = 'http://www.vlaamsekunstcollectie.be/collection.aspx?p=0848cab7-2776-4648-9003-25957707491a&inv=' + b;
    			row.push(url);
    	}
    });
    numbers.push(row);
  });
  console.log(numbers.join('\n'));
});