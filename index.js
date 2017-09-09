var knownPrefixes = require('./prefixes'),
    numberBasedCss = require('./number-based'),
    timeBasedCss = require('./time-based'),
    styleKebabCase = require('./html-case'),
    parseSelector = require('./parse-selector'),
    maxLength = reduce(knownPrefixes, function (memo, item) {
        var length = item.length;
        return memo > length ? memo : length;
    }, 0);

function makeDataAttr(key, value) {
    return '[' + (value == NULL ? key : (key + '="' + value + '"')) + ']';
}

function createAttributeFromTag(tag) {
    return '[' + CUSTOM_KEY + '="' + tag + '"]';
}

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

function cautiousConvertValue(generated) {
    var converted = +generated;
    return generated.length && converted === converted && converted + '' === generated ? converted : generated;
}

function convertAttributeValue(val_) {
    var val = val_;
    if (val === '') {
        return true;
    } else if (!isNil(val)) {
        return cautiousConvertValue(val);
    } else {
        return false;
    }
}

function prefixedStyles(allStyles) {
    var i, j, found, prefixIndex, __prefix, styleName, currentCheck, deprefixed, currentLen,
        validCssNames = [],
        prefixed = {};
    // for (i = 0; i < knownPrefixes.length; i++) {
    //     currentLen = knownPrefixes[i].length;
    //     if (counter < currentLen) {
    //         counter = currentLen;
    //     }
    // }
    while ((next = allStyles.next())) {
        found = 0;
        currentCheck = '';
        __prefix = '';
        if (isNumber(+next)) {
            styleName = allStyles[next];
        } else {
            styleName = kebabCase(next);
        }
        kebabCase(styleName);
        camelCase(styleName);
        deprefixed = styleName;
        for (j = 0; j < maxLength && styleName[j] && !found; j++) {
            currentCheck += styleName[j];
            checkPrefix(currentCheck);
            prefixIndex = indexOf(knownPrefixes, currentCheck);
            if (prefixIndex !== -1) {
                __prefix = knownPrefixes[prefixIndex];
                deprefixed = styleName.split(__prefix).join('');
                found = 1;
            }
            prefixIndex = indexOf(knownPrefixes, HYPHEN + currentCheck);
            if (prefixIndex !== -1) {
                __prefix = knownPrefixes[prefixIndex];
                deprefixed = styleName.split(currentCheck).join('');
                found = 1;
            }
        }
        deprefixed = camelCase(deprefixed);
        validCssNames.push(deprefixed);
        if (!prefixed[deprefixed]) {
            prefixed[deprefixed] = [];
        }
        addPrefix(prefixed[deprefixed], __prefix);
    }
    return prefixed;

    function checkPrefix(currentCheck) {
        var prefixIndex = indexOf(knownPrefixes, HYPHEN + currentCheck);
        if (prefixIndex !== -1) {
            __prefix = knownPrefixes[prefixIndex];
            deprefixed = styleName.split(currentCheck).join('');
            found = 1;
        }
    }

    function addPrefix(list, prefix) {
        if (indexOf(list, __prefix) === -1) {
            list.push(__prefix);
        }
    }
}

function unitRemoval(str, unit) {
    return +(str.split(unit || 'px').join('').trim()) || 0;
}