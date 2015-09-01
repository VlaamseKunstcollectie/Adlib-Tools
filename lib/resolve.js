var fs = require('fs');
var _ = require('underscore');
var csv = require('fast-csv');
var Promise = require('bluebird');

var resolve = function(csvFile) {
	var stream = fs.createReadStream(csvFile);

	var promisecsv = Promise.method(function(path, options) {
	    return new Promise(function(resolve, reject) {
	        var records = [];
	        csv
	        	.fromPath(path, options)
	        	.transform(function (row) {
            	  return {
            	  	'PID': row['PID'],
            	  	'entity type': 'work',
            	  	'title': row['title'],
            	  	'document type': 'data',
            	  	'URL': row['data_url'],
            	  	'enabled': '1',
            	  	'notes': '',
            	  	'format': 'html',
            	  	'reference': '',
            	  	'order': '',
            	  	'images': _.filter(row, function (val, key) {
	        		  		if (key.match(/image_url*/)) {
	        		  			return val;
	        		  		}
	        		  	})
            	  }
	        	})
            .on('data', function(record) {
            		var images = record.images;
                delete record.images;
            		// Push the data record
                records.push(record);

                // Let's generate image records
                // Can't use clone since that only makes a shallow copy of the
                // object.
                _.each(images, function (image, key) {
                	 records.push({
										'PID': record['PID'],
	            	  	'entity type': 'work',
	            	  	'title': record['title'],
	            	  	'document type': 'representation',
	            	  	'URL': image,
	            	  	'enabled': '1',
	            	  	'notes': '',
	            	  	'format': '',
	            	  	'reference': (key == 0) ? 1: '',
	            	  	'order': key,
                	})
                })
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

	var records = promisecsv(csvFile, {'headers': true});
	records.then(function (data) {
		csv
  		.writeToStream(fs.createWriteStream("out.csv"), data, {headers: true});
		console.log('DONE!');
	})
}

module.exports = resolve;