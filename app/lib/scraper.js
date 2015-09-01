var cheerio = require('cheerio');
var rp = require('request-promise');
var Promise = require("bluebird");
var async = require('async');
var _ = require('underscore');

var scraper = Promise.method(function (records) {
  return new Promise(function (resolve, reject) {
    async.waterfall([
      function(callback) {
        var parsedObjects = [];
        _.each(records, function (object) {
            if (typeof object['IN'] != 'undefined') {
              parsedObjects.push({
                INV: object['IN'],
                TITLE: object['TI'],
                URL: 'http://www.vlaamsekunstcollectie.be/collection.aspx?p=0848cab7-2776-4648-9003-25957707491a&inv=' + object['IN'],
              });
            }
        });
        callback(null, parsedObjects);
      },
      function(data, callback) {
        console.log('Retrieving image urls...');

        pace = require('pace')(data.length);
        var current = Promise.fulfilled();
        Promise.all(data.map(function(object) {
          current = current.then(function() {
            return rp(object['URL']).then(
              function(html) {
                var $  = cheerio.load(html);
                object['IMG'] = 'http://www.vlaamsekunstcollectie.be/' + $('#ctl00_ContentPlaceHolder1_ccSingleObject_FormView1_imgObject').attr('src');
                pace.op();
                return object;
              },
              function(error) {
                console.log(error);
                object['IMG'] = '';
                pace.op();
                return object;
              });
          });
          return current;
        })).then(function(results) {
          console.log('fetching image urls... DONE');
          callback(null, results)
        });
      }
    ], function (err, result) {
      resolve(result);
    });
  });
});

module.exports = scraper;