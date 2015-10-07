var moment = require('moment');
var _ = require('underscore');

var util = function() {
	return {
	  fetchValue: function (object, field, key) {
			var result = "";
			if (field in object) {
				if (!_.isUndefined(object[field])) {
					if (!_.isUndefined(object[field][key])) {
						result = object[field][key]
					}
				}
			}
			return result;
		},

		convertDate: function (object, field, key) {
			result = "";
			var date = fetchValue(object, field, key);
			if (date !== "") {
				result = moment(new Date(date)).format('YYYY');
			}
			return result;
		}
	}
}();

module.exports = util;