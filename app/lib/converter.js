var Promise = require("bluebird");
var _ = require('underscore');

var converter = Promise.method(function (records) {
  return new Promise(function (resolve, reject) {
    console.log('Parsing objects...');
    var parsedObjects = [];
    var objects = records.split(/\*\*([\r\n]+)/);
    var objects = _.without(objects, '\r\n');
    console.log('Parsing %s objects...', objects.length);

    _.each(objects, function (object) {
      var parsedObject = [];
      var rows = object.split(/\r\n?|\n/);
      _.each(rows, function (row) {
        row = row.trim();
        parsedObject[row.substr(0, row.indexOf(' '))] = row.substr(row.indexOf(' ') + 1);
      });
      parsedObjects.push(parsedObject);
    });

    console.log('%s parsed objects', parsedObjects.length);
    resolve(parsedObjects);
  });
});

module.exports = converter;



