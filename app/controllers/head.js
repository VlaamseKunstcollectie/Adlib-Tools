var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var csv = require('fast-csv');

// Unfinished
var head = function(inputFile, column) {
  async.waterfall([
    function(fetched) {
      console.log('reading CSV file...');
      var data = [];
      csv
        .fromPath(inputFile, {headers: true, quoteColumns: true})
        .on('data', function(row) {
          data.push(row);
        })
        .on('end', function() {
          fetched(null, data);
        });
    },
    function (data, parsed) {
      head(data).then(function(records) {
        parsed(null, records);
      });
    }
  ], function (err, results) {
    console.log('YAY!');
  });
}

module.exports = head;