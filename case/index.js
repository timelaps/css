var cacheable = require('@timelaps/fn/cacheable');
var kebabCase = require('@timelaps/string/case/kebab');
module.exports = cacheable(function (styleKey) {
    var kebabed = kebabCase(styleKey);
    if (styleKey && styleKey[0] >= 'A' && styleKey[0] <= 'Z') {
        kebabed = '-' + kebabed;
    }
    return kebabed;
});