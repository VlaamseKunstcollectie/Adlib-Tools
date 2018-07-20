// var cheerio = require('cheerio');
var jsdom = require('jsdom');
var rp = require('request-promise');
var Promise = require("bluebird");
var async = require('async');
var _ = require('underscore');
var parse = require('url-parse');
var util = require('../lib/util.js')

var move = Promise.method(function (records) {
  return new Promise(function (resolve, reject) {
    async.waterfall([
      function(callback) {
        console.log('Retrieving data...');

        pace = require('pace')(records.length);
        var current = Promise.fulfilled();
        Promise.all(records.map(function(record) {
          var object = {};
          object['URL'] = record;
          current = current.then(function() {
            return rp({uri: record, resolveWithFullResponse: true}).then(
              function(response) {
              	// @todo
              	//  Currently none testable since all requests ALWAYS return 200!!

                jsdom.env(
                  response.body,
                  ["http://code.jquery.com/jquery.js"],
                  function (err, window) {
                    object['veld'] = window.$('div.tekst table:first tr td.data:last b').text();
                    object['bestand'] = window.$('div.tekst table:first tr td:nth-child(2)').text();
                    object['tabblad'] = window.$('div.tekst table:first tr td:nth-child(4)').text();
                    object['groep'] = window.$('div.tekst table:first tr td:nth-child(6)').text()

                    var opmerkingen = window.$('div.tekst table:nth-child(1) tr:nth-child(4) td.data').text()
                    object['herhaalbaar'] = (opmerkingen.indexOf('herhaalbaar') != -1) ? 'Y' : 'N';

                    object['definitie'] = window.$('div.tekst table:nth-child(1) tr:nth-child(1) td.data').text()
                  }
                );

               /* if (response.statusCode == 200) {
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
                } */
	              pace.op();
	              return object;
              });
          }).catch(function (error) {
          	console.log(error);
          });
          return current;
        })).then(function(results) {
          console.log('fetching data... DONE');
          callback(null, results)
        });
      }
    ], function (err, result) {
      resolve(result);
    });
  });
});

module.exports = move;
