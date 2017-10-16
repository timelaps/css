module.exports = manyDefinitionGroups;
var definitionGroups = require('../');
var objectReduce = require('@timelaps/object/reduce');

function manyDefinitionGroups(keyvals, options_) {
    return [].concat.apply([], objectReduce(keyvals, function (memo, value, key) {
        return memo.concat(definitionGroups(key, value, options_));
    }, []));
}