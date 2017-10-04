module.exports = convertStyleValue;
var timeBasedCss = require('../time-based');
var numberBasedCss = require('../number-based');
var toNumber = require('@timelaps/to/number');
var isNaN = require('@timelaps/is/nan');

function convertStyleValue(key, value) {
    if (isNaN(toNumber(value))) {
        return value;
    } else if (timeBasedCss[key]) {
        return value + 'ms';
    } else if (numberBasedCss[key]) {
        return value;
    } else {
        return value + 'px';
    }
}