var moment = require('moment');
var _ = require('underscore');

var util = function() {
	return {
		// @todo
		//  Factor type out to specific class?
	  fetchValue: function (object, field, key, type) {
			var result = "";
			if (field in object) {
				if (!_.isUndefined(object[field])) {
					if (type == 'dat') {
						if (!_.isUndefined(object[field][key])) {
							result = object[field][key]
						}
					} else {
						result = object[field];
					}
				}
			}
			return result;
		},

		convertDate: function (object, field, key) {
			result = "";
			var date = this.fetchValue(object, field, key);
			if (date !== "") {
				result = moment(new Date(date)).format('YYYY');
			}
			return result;
		}
	}
}();

module.exports = util;
