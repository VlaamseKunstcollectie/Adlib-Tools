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
        // Fixed positions, can't use substring because it munges the propertyKey
        // somehow. Need to fix this.
        var propertyKey = row.substr(0, 2);
        var propertyValue = row.substr(3)
        // Deal with multivalued fields
        if (_.contains(_.keys(parsedObject), propertyKey)) {
          parsedObject[propertyKey].push(propertyValue);
        } else {
          parsedObject[propertyKey] = [ propertyValue ];
        }
      });
      parsedObjects.push(parsedObject);
    });

    console.log('%s parsed objects', parsedObjects.length);
    resolve(parsedObjects);
  });
});

module.exports = converter;



