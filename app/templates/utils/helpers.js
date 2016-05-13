var moment = require('moment');

module.exports = {
    getReadableDate: function(rawDate) {
        return moment(rawDate).format('dddd, MMMM D, YYYY [at] ha');
    },
    now: function(dateFormat) {
        dateFormat = (!dateFormat || (typeof dateFormat !== 'string'))? 'MMMM Do YYYY, h:mm:ss a' : dateFormat;
        return moment().format(dateFormat);
    },
    debug: function() {
        debugger;
    },
    getMapURL: function() {
        var rawLocation = Array.prototype.slice.call(arguments, 0, arguments.length - 1),
            loc = rawLocation.reduce(function(location, locItem) {
                return location + ',' + locItem.toString().replace(/\s+/gi, '+');
            }, '');

        return 'https://www.google.com/maps/place/' + loc + ',+USA';
    }
};