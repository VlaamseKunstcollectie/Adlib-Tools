var fs = require('fs');
var _ = require('underscore');
var csv = require('fast-csv');
var Promise = require('bluebird');
var unidecode = require('unidecode');

var pid = function(csvFile, idColumn) {
	var stream = fs.createReadStream(csvFile);

	var promisecsv = Promise.method(function(path, options) {
	    return new Promise(function(resolve, reject) {
	        var records = [];
	        csv
	        	.fromPath(path, options)
	        	.transform(function (row) {
	        		  row['MEH'] = cleanId(row['OID']);
            	  return row;
	        	})
	        	.on('data', function(record) {
	        		  // Push the data record
                records.push(record);
	        	})
            .on('data-invalid', function() {
                // validation failed, do nothing
            })
            .on('end', function() {
                console.log('Parsing done: ' + records.length + ' records generated.');
                resolve(records);
            })
	    });
	});

	var cleanId = function(ID) {
     var cleanRe = new RegExp("[\t !\"#$%&\'()*\/<=>?@\[\\\]^`{|}]+");
     var patterns = [
        [/- /g,'-'],[/ -/g,'-'],[/\)+$/g,''],[/\]+$/g, ''],[/\°+$/g, ''],
        [/\./g,'_'],[/ /g,'_'],[/\(/g,'_'],[/\)/g,'_'],[/\[/g,'_'],[/\]/g,'_'],
        [/\//g,'_'],[/\?/g,'_'],[/,/g,'_'],[/&/g,'_'],[/\+/g,'_'],[/°/g,'_'],
        [/_+/g, '_']];

     var partial = ID;
     _.each(patterns, function(p) {
       partial = partial.replace(p[0], p[1]);
     });

     return partial;
	}

	var records = promisecsv(csvFile, {'headers': true});
	records.then(function (data) {
		csv
  		.writeToStream(fs.createWriteStream("out.csv"), data, {headers: true});
		console.log('DONE!');
	})
}

module.exports = pid;