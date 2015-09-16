var Promise = require("bluebird");
var _ = require('underscore');

// Unfinished.
// Should be used to check if a URL pings a 200, 404 or other steatus code
var head = Promise.method(function (records) {
  return new Promise(function (resolve, reject) {
    console.log('Parsing objects...');
    var parsedObjects = [];

    pace = require('pace')(data.length);
    var current = Promise.fulfilled();
    Promise.all(data.map(function(object) {
      current = current.then(function() {
        return rp.head(object['URL']).then(
          // return object;
        );
      });
      return current;
    })).then(function(results) {
      console.log('%s parsed objects', parsedObjects.length);
      resolve(null, results)
    });
  });
});

module.exports = converter;
