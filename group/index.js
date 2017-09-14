module.exports = definitionGroup;
var map = require('@timelaps/n/map');
var cssCase = require('../case');
var propertyDefinition = require('../property');
var convertStyleValue = require('../value');
var camelCase = require('@timelaps/string/case/camel');
var returnsEmpty = require('@timelaps/returns/empty-string');

function definitionGroup(input, block, options_) {
    var options = options_ || {};
    var propertyDef = options.propertyDefinition || propertyDefinition;
    var linePrefix = options.linePrefix || returnsEmpty;
    var prefixedStyles = options.prefixes || {};
    var cameled = camelCase(input);
    var prefixes = prefixedStyles[cameled] || [''];
    if (prefixes.length === 1) {
        return [runIt(prefixes[0])];
    } else {
        return map(prefixes, runIt);
    }

    function runIt(prefix) {
        var property = cssCase(cameled);
        var value = convertStyleValue(input, block);
        var fullproperty = prefix + property;
        return linePrefix(fullproperty, value) + propertyDef(fullproperty, value);
    }
}