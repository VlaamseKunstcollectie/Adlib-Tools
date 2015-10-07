var cheerio = require('cheerio');
var rp = require('request-promise');
var Promise = require("bluebird");
var async = require('async');
var _ = require('underscore');
var parse = require('url-parse');
var util = require('../lib/util.js')
var sabam = require('../lib/sabam.js');

var scraper = Promise.method(function (records) {
  return new Promise(function (resolve, reject) {
    async.waterfall([
      function(callback) {
        var parsedObjects = [];
        _.each(records, function (object) {
            if (typeof object['IN'] != 'undefined') {
              var creator = util.fetchValue(object, "VV", 0)
              parsedObjects.push({
                INV: object['IN'][0],
                TITLE: object['TI'][0],
                CREATOR: creator,
                SABAM: sabam(creator),
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
            return rp({uri: object['URL'], resolveWithFullResponse: true}).then(
              function(response) {
              	// @todo
              	//  Currently none testable since all requests ALWAYS return 200!!
                if (response.statusCode == 200) {
	               var $  = cheerio.load(response.body);
	               var image = $('#ctl00_ContentPlaceHolder1_ccSingleObject_FormView1_imgObject').attr('src');
	               if (_.isUndefined(image)) {
                  object['IMG'] = ''; // no image if image could not be found in DOM.
	               } else {
                   var imageUrl = 'http://www.vlaamsekunstcollectie.be/' + image;
                   var parsedUrl = parse(imageUrl, true);
                   // Get rid of the 'width' & 'height' query parameters, we are not
                   // interested in the thumbnail version.
                   parsedUrl.set('query', _.omit(parsedUrl.query, ['width', 'height']));
                   object['IMG'] = parsedUrl.href;
	               }
                } else {
                  object['IMG'] = '';
                  object['URL'] = ''; // unset the URL if not 200
                }
	              pace.op();
	              return object;
              });
          }).catch(function (error) {
          	console.log(error);
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