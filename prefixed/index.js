module.exports = prefixed;
var u, reduce = require('@timelaps/n/reduce'),
    camelCase = require('@timelaps/string/case/camel'),
    kebabCase = require('@timelaps/string/case/kebab'),
    knownPrefixes = require('../prefixes'),
    find = require('@timelaps/array/find'),
    add = require('@timelaps/array/add'),
    whilst = require('@timelaps/fn/whilst'),
    // max length that a prefix can be
    maxLength = reduce(knownPrefixes, function (memo, item) {
        var length = item.length;
        return memo > length ? memo : length;
    }, 0);

function prefixed(styles) {
    var next;
    return whilst(function (memo, index) {
        // get the next style key
        next = next = styles.next();
        return next.value !== u;
    }, function (prefixed) {
        var deprefixer, __prefix = '',
            value = next.value,
            kebabed = kebabCase(value),
            deprefixed = value,
            // get the prefix and deprefixed pair
            tuple = retrievePair(kebabed);
        // if nothing was found, use empty string
        __prefix = tuple[0] || __prefix;
        // if nothing was found, use original
        deprefixer = tuple[1] || '';
        deprefixed = kebabed.slice(deprefixer.length);
        // camel case to make js accessable
        deprefixed = camelCase(deprefixed);
        // access list of prefixes
        if (!(prefixedList = prefixed[deprefixed])) {
            prefixedList = prefixed[deprefixed] = [''];
        }
        // add to list if it doesn't already exist
        add(prefixedList, __prefix);
        return prefixed;
    }, {});
}

function checkPrefix(current) {
    return find(knownPrefixes, function (prefix) {
        return prefix === current;
    });
}

function retrievePair(next) {
    var currentCheck = '';
    // while you have more prefixes to check
    // and there are more characters
    // and you have not filled out the tuple yet
    return whilst(function (memo, index) {
        return index < maxLength && next[index] && !memo[0];
    }, function (memo, index) {
        currentCheck += next[index];
        var nohyphen = checkPrefix(currentCheck);
        var prefix = nohyphen ? nohyphen : checkPrefix('-' + currentCheck);
        if (prefix) {
            return [prefix, currentCheck];
        }
        return memo;
    }, []);
}