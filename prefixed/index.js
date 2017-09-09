module.exports = prefixed;
var reduce = require('@timelaps/array/reduce'),
    knownPrefixes = require('../prefixes'),
    indexOf = require('@timelaps/n/index/of'),
    add = require('@timelaps/array/add'),
    // max length that a prefix can be
    maxLength = reduce(knownPrefixes, function (memo, item) {
        var length = item.length;
        return memo > length ? memo : length;
    }, 0);

function prefixed(styles) {
    var next;
    return whilst(function (memo, index) {
        // get the next style key
        return (next = styles.next());
    }, function (prefixed) {
        var __prefix = '',
            deprefixed = next,
            // get the prefix and deprefixed pair
            tuple = retrievePair(next);
        // if nothing was found, use empty string
        __prefix = tuple[0] || __prefix;
        // if nothing was found, use original
        deprefixed = tuple[1] || deprefixed;
        // camel case to make js accessable
        deprefixed = camelCase(deprefixed);
        // access list of prefixes
        if (!(prefixedList = prefixed[deprefixed])) {
            prefixedList = prefixed[deprefixed] = [];
        }
        // add to list if it doesn't already exist
        add(prefixedList, __prefix);
        return prefixed;
    }, {});
}

function checkPrefix(next, current) {
    var __prefix, deprefixed,
        prefixIndex = indexOf(knownPrefixes, current);
    // if you found a prefix
    if (prefixIndex !== -1) {
        // overwrite the variables above
        // to return a full tuple
        __prefix = knownPrefixes[prefixIndex];
        deprefixed = next.split(__prefix).join('');
    }
    return [__prefix, deprefixed];
}

function retrievePair(next) {
    var currentCheck = '';
    // while you have more prefixes to check
    // and there are more characters
    // and you have not filled out the tuple yet
    return whilst(function (memo, index) {
        return index < maxLength && next[index] && !memo[0];
    }, function () {
        currentCheck += next[j];
        return checkPrefix(next, currentCheck);
    }, []);
}