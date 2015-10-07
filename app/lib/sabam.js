var sabamCreators = require('../config/sabamcreators.json')
var _ = require('underscore');

var sabam = function(creator) {
  var index = sabamCreators.names.indexOf(creator);
  return (index > 0) ? "1" : "0";
}

module.exports = sabam;
