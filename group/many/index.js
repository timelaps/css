module.exports = manyDefinitionGroups;
var definitionGroups = require('..');
var reduceOwn = require('@timelaps/array/reduce/own');
var assign = require('@timelaps/object/assign');

function manyDefinitionGroups(keyvals, options_) {
    var counter = 0;
    var options = assign({
        linePrefix: linePrefix
    }, options_);
    return reduceOwn(keyvals, function (memo, value, key) {
        return memo.concat(definitionGroups(key, value, options));
    }, []).join('');

    function linePrefix(key, value) {
        var previous = counter;
        counter += 1;
        return previous ? ' ' : '';
    }
}