module.exports = manyDefinitionGroups;
var definitionGroups = require('../');
var reduceOwn = require('@timelaps/array/reduce/own');

function manyDefinitionGroups(keyvals, options_) {
    return [].concat.apply([], reduceOwn(keyvals, function (memo, value, key) {
        return memo.concat(definitionGroups(key, value, options_));
    }, []));
}