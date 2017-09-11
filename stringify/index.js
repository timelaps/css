module.exports = build;
var noop = require('@timelaps/fn/noop');
var once = require('@timelaps/fn/once');
var toArray = require('@timelaps/to/array');
var forEach = require('@timelaps/n/for/each');
var reduce = require('@timelaps/array/reduce');
var isObject = require('@timelaps/is/object');
var reduceOwn = require('@timelaps/array/reduce/own');
var assign = require('@timelaps/object/assign');
var returnsFirst = require('@timelaps/returns/first');
var group = require('../group');

function joinBlocks(blocks) {
    return blocks.join('');
}

function defaultLinePrefix(counter) {
    return counter ? ' ' : '';
}

function build(json, options_) {
    var options = assign({
        // defaults
        openBlock: returnsFirst,
        closesBlock: returnsFirst,
        joinBlocks: joinBlocks,
        prefixes: {},
        linePrefix: defaultLinePrefix
    }, options_);
    var linePrefix = options.linePrefix;
    var prefixes = options.prefixes;
    var joinDefinition = options.joinDefinition;
    return build(json);

    function openBlock(total, selector) {
        total.push(selector.join('') + options.openBlock('{'));
    }

    function closeBlock(total) {
        total.push(options.closesBlock('}'));
    }

    function build(json, selector_, memo_, beforeAnyMore) {
        var result, originalOpensBlock,
            baseSelector = selector_ || [],
            memo = memo_ || [],
            opensBlock = noop,
            closesBlock = noop;
        if (memo_) {
            opensBlock = createsOpenBlock(memo, baseSelector);
        }
        originalOpensBlock = opensBlock;
        if (beforeAnyMore) {
            beforeAnyMore();
        }
        var continuous = 0;
        var setBlockOptions = {
            prefixes: prefixes,
            joinDefinition: joinDefinition,
            linePrefix: function (property, value) {
                var previous = continuous;
                continuous += 1;
                return linePrefix(previous, property, value);
            }
        };
        result = reduceOwn(json, function (memo, block, key, chunk) {
            var cameled, defs, lineprefix, extras, trimmed = key.trim();
            if (isObject(block)) {
                continuous = 0;
                forEach(toArray(trimmed, ','), function (trimmd_) {
                    trimmed = trimmd_.trim();
                    if (baseSelector.length) {
                        if (trimmed[0] !== '&') {
                            trimmed = ' ' + trimmed;
                        } else {
                            trimmed = trimmed.slice(1);
                        }
                    }
                    opensBlock = createsOpenBlock(memo, baseSelector);
                    baseSelector.push(trimmed);
                    build(block, baseSelector, memo, closesBlock);
                    baseSelector.pop();
                });
            } else {
                opensBlock();
                closesBlock = once(function () {
                    closeBlock(memo);
                });
                // always on the same line
                defs = group(trimmed, block, setBlockOptions);
                memo.push.apply(memo, defs);
            }
            return memo;
        }, memo);
        closesBlock(memo);
        return options.joinBlocks(result);

        function createsOpenBlock(memo, baseSelector) {
            return once(function () {
                openBlock(memo, baseSelector);
            });
        }
    }
}