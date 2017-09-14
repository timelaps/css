module.exports = convertStyleValue;
var timeBasedCss = require('../time-based');
var numberBasedCss = require('../number-based');

function convertStyleValue(key, value) {
    if (isNaN(value)) {
        return value;
    } else if (timeBasedCss[key]) {
        return value + 'ms';
    } else if (numberBasedCss[key]) {
        return value;
    } else {
        return value + 'px';
    }
}