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

function build(json, options_) {
    var options = assign({
        // defaults
        openBlock: returns('{'),
        closesBlock: returns('}'),
        joinBlocks: joinBlocks
    }, options_);
    return build(json);

    function joinBlocks(blocks) {
        return blocks.join('');
    }

    function openBlock(selector, total) {
        return once(function () {
            total.push(selector.join('') + options.openBlock('{'));
        });
    }

    function closeBlock(total) {
        return once(function () {
            total.push(options.closesBlock('}'));
        });
    }

    function build(json, selector_, memo_, beforeAnyMore) {
        var result, baseSelector = selector_ || [],
            memo = memo_ || [],
            opensBlock = noop,
            closesBlock = noop;
        if (memo_) {
            opensBlock = openBlock(baseSelector, memo);
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
                    opensBlock = openBlock(baseSelector, memo);
                    baseSelector.push(trimmed);
                    build(block, baseSelector, memo, closesBlock);
                    baseSelector.pop();
                });
            } else {
                opensBlock();
                closesBlock = closeBlock(memo);
                // always on the same line
                cameled = camelCase(trimmed);
                forEach(prefixedStyles[cameled] || [''], function (prefix) {
                    memo.push('\n\t' + prefix + cssCase(cameled) + ': ' + convertStyleValue(trimmed, block) + ';');
                });
            }
        }, memo);
        closesBlock(memo);
        return options.joinBlocks(result);
    }
}