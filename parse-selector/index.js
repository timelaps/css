var copyCacheable = require('@timelaps/fn/cacheable/copy');
var isNull = require('@timelaps/is/null');
var isTrue = require('@timelaps/is/true');
var fromToEnd = require('@timelaps/n/from/to/end');
var token = require('@timelaps/string/token');
// var tokeneater = require('tokeneater');
var quoteChecker = {
    '"': 1,
    "'": 2
};
var operatorHash = {
    '~': true,
    $: true,
    '^': true,
    '*': true,
    '|': true
};
var validInvalidators = {
    i: true,
    I: true
};
module.exports = copyCacheable(function (target) {
    if (!target) {
        return [];
    }
    return token({
        target: target,
        finishBlock: function (memo) {
            memo.flush();
            return memo;
        },
        memo: {
            selectors: [],
            _current: null,
            current: function () {
                var current = this._current;
                return current || this.reset();
            },
            reset: function () {
                var current = this._current = {
                    tagName: null,
                    id: null,
                    class: [],
                    attributes: []
                };
                this.focusedOn = 'tagName';
                return current;
            },
            flush: function () {
                var current = this._current;
                if (current) {
                    this.selectors.push(current);
                }
                return this.reset();
            },
            isEmpty: function () {
                var current = this._current;
                return !current || (!current.tagName && !current.id && !current.class.length && !current.attributes.length);
            },
            focus: function (focused) {
                this.focusedOn = focused;
                return focused;
            },
            append: function (next) {
                var memo = this;
                var current = memo.current();
                var classes = current.class;
                var focus = memo.focusedOn;
                if (focus === 'attributes') {
                    //
                } else if (focus === 'class') {
                    if (classes.length && memo.classCounter) {
                        classes[classes.length - 1] += next;
                    } else {
                        memo.classCounter += 1;
                        classes.push(next);
                    }
                } else {
                    if (!current[focus]) {
                        current[focus] = next;
                    }
                }
            }
        },
        tokens: [{
            match: /\[/igm,
            handle: function (memo) {
                memo.focus('attributes');
                // start attribute selector
                return memo;
            }
        }, {
            match: /\#/igm,
            handle: function (memo) {
                memo.current();
                memo.focus('id');
                return memo;
            }
        }, {
            match: /\./igm,
            handle: function (memo) {
                memo.current();
                memo.focus('class');
                memo.classCounter = 0;
                // start attribute selector
                return memo;
            }
        }, {
            match: /\w+/igm,
            handle: function (memo, word) {
                memo.append(word);
                return memo;
            }
        }]
    }).selectors;
    // var tagName, idx = 0,
    //     length = total.length,
    //     id = null,
    //     classes = [],
    //     attributes = [];
    // total.replace(/[\#\.\[\]]/igm, function (char, index) {
    //     if (idx > index) {
    //         idx = index;
    //     } else {
    //         if (!tagName) {
    //             // no tag specified could be anything
    //             tagName = index === 0 || total.slice(0, index);
    //         } else {
    //             parseTo(idx, index);
    //         }
    //         idx = index;
    //     }
    //     return '';
    // });
    // // why is this last bit here
    // parseTo(idx, length);
    // // reset tagname if it was never in the selector
    // tagName = isTrue(tagName) ? null : tagName;
    // return {
    //     tagName: tagName,
    //     id: id,
    //     class: classes,
    //     attributes: attributes
    // };
    // function parseTo(i, here_) {
    //     var part, startsWithQuote, operator, cased, here = here_,
    //         char = total[i];
    //     if (char === '[') {
    //         here = findNextUnquotedBracket(total, i);
    //         part = total.slice(i + 1, here);
    //         split = part.split('=');
    //         attr = split[0];
    //         value = split.slice(1).join('=');
    //         startsWithQuote = quoteChecker[value[0]];
    //         cased = true;
    //         if (startsWithQuote) {
    //             if (value.match(/\s?i$/igm)) {
    //                 value = removeInsensitivity(value);
    //                 cased = !cased;
    //             }
    //             // this is ok because of the quotes
    //             value = value.trim();
    //             last = value.length - 1;
    //             if (startsWithQuote === quoteChecker[value[last]]) {
    //                 value = value.slice(1, last);
    //             }
    //         }
    //         operator = '=';
    //         last = attr.length - 1;
    //         if (operatorHash[attr[last]]) {
    //             operator = attr[last] + operator;
    //             attr = attr.slice(0, last);
    //         }
    //         attributes.push({
    //             name: attr,
    //             operator: operator,
    //             value: value,
    //             cased: cased
    //         });
    //     } else if (char === '#') {
    //         // the first id always wins
    //         if (isNull(id) && i + 1 < here) {
    //             id = total.slice(i + 1, here);
    //         }
    //     } else if (char === '.') {
    //         classes.push(total.slice(i + 1, here));
    //     } else if (!tagName && i === 0) {
    //         tagName = total.slice(i, here);
    //     }
    //     idx = here;
    // }
    // function findNextUnquotedBracket(total, index) {
    //     var quotes = [];
    //     var idx = fromToEnd(function (index) {
    //         var character = total[index];
    //         if (quoteChecker[character]) {
    //             if (!quotes.length) {
    //                 quotes.push(character);
    //             } else if (quotes[quotes.length - 1] === character) {
    //                 quotes.pop();
    //             } else {
    //             }
    //         }
    //         return !quotes.length && character === ']';
    //     }, null, index, total.length, 1);
    //     return idx === -1 ? total.length - 1 : idx;
    // }
    // function removeInsensitivity(value) {
    //     // this should only be called
    //     // if the first character starts with quotes
    //     var raw = value;
    //     var length = raw.length;
    //     var lastIndex = length - 1;
    //     var last = raw[lastIndex];
    //     if (validInvalidators[last]) {
    //         length -= 1;
    //     }
    //     return value.slice(0, length);
    // }
});