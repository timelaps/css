module.exports = build;
var noop = require('@timelaps/fn/noop');
var once = require('@timelaps/fn/once');
var toArray = require('@timelaps/to/array');
var forEach = require('@timelaps/n/for/each');
var reduce = require('@timelaps/array/reduce');
var isObject = require('@timelaps/is/object');
var cssCase = require('../case');
var camelCase = require('@timelaps/string/case/camel');
var prefixedStyles = require('../prefixes');
var reduceOwn = require('@timelaps/array/reduce/own');
var assign = require('@timelaps/object/assign');
var returnsFirst = require('@timelaps/returns/first');

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

function build(json, options_) {
    var options = assign({
        // defaults
        openBlock: returnsFirst,
        closesBlock: returnsFirst,
        joinBlocks: joinBlocks,
        joinDefinition: joinDefinition
    }, options_);
    return build(json);

    function joinDefinition(prefix, property, value) {
        return prefix + property + ':' + value + ';';
    }

    function joinBlocks(blocks) {
        // debugger;
        return blocks.join('');
    }

    function openBlock(total, selector) {
        total.push(selector.join('') + options.openBlock('{'));
    }

    function closeBlock(total) {
        total.push(options.closesBlock('}'));
    }

    function build(json, selector_, memo_, beforeAnyMore) {
        var result, baseSelector = selector_ || [],
            memo = memo_ || [],
            opensBlock = noop,
            closesBlock = noop;
        if (memo_) {
            opensBlock = createsOpenBlock(memo, baseSelector);
        }
        if (beforeAnyMore) {
            beforeAnyMore();
        }
        result = reduceOwn(json, function (memo, block, key) {
            var cameled, trimmed = key.trim();
            if (isObject(block)) {
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
                cameled = camelCase(trimmed);
                forEach(prefixedStyles[cameled] || [''], function (prefix) {
                    var property = cssCase(cameled);
                    var value = convertStyleValue(trimmed, block);
                    memo.push(options.joinDefinition(prefix, property, value));
                });
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