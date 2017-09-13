var copyCacheable = require('@timelaps/fn/cacheable/copy');
var isNull = require('@timelaps/is/null');
var isTrue = require('@timelaps/is/true');
var fromToEnd = require('@timelaps/n/from/to/end');
var token = require('@timelaps/string/token');
var throws = require('@timelaps/fn/throws');
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
// this never change so it can be cached
module.exports = copyCacheable(function (target_) {
    var target = target_.trim();
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
            hashtagCounter: 0,
            current: function () {
                var current = this._current;
                return current || this.reset();
            },
            reset: function (next) {
                var current = this._current = next || createSelector();
                this._root = this._root || current;
                this.focusedOn = 'tagName';
                this.hashtagCounter = 0;
                return current;
            },
            flush: function () {
                var current = this._root;
                if (current) {
                    this.finalizeAttr();
                    this.selectors.push(current);
                    delete this._root;
                    delete this._current;
                }
                return this.reset();
            },
            finalizeAttr: function () {
                var cased, last, nextval, startsWithQuote, lastIndex, memo = this,
                    current = this._current,
                    attributes = current.attributes;
                if ((last = attributes[attributes.length - 1])) {
                    // no operator (no value too)
                    // if (!last.operator) {
                    //     last.operator = '=';
                    // }
                    cased = last.cased;
                    value = last.value;
                    if ((startsWithQuote = quoteChecker[value[0]])) {
                        if (value.match(/\s?i$/igm)) {
                            value = removeInsensitivity(value).trim();
                            cased = !cased;
                        }
                        // this is ok because of the quotes
                        value = value.trim();
                        lastIndex = value.length - 1;
                        if (startsWithQuote === quoteChecker[value[lastIndex]]) {
                            value = value.slice(1, lastIndex);
                        }
                    }
                    last.value = value;
                    last.cased = cased;
                    if (value.split(/\'|\"/igm).length >= 2) {
                        throws({
                            type: 'SyntaxError',
                            message: 'Invalid Selector ' + target
                        });
                    }
                }
                memo.attributePart = 0;
                memo.focus(false);

                function removeInsensitivity(value) {
                    // this should only be called
                    // if the first character starts with quotes
                    var raw = value;
                    var length = raw.length;
                    var lastIndex = length - 1;
                    var last = raw[lastIndex];
                    if (validInvalidators[last]) {
                        length -= 1;
                    }
                    return value.slice(0, length);
                }
            },
            isEmpty: function (target) {
                var current = target || this._current;
                return !current || (!current.tagName && !current.id && !current.class.length && !current.attributes.length);
            },
            focus: function (focused) {
                this.focusedOn = focused;
                return focused;
            },
            append: function (next) {
                var last;
                var memo = this;
                var current = memo.current();
                var classes = current.class;
                var focus = memo.focusedOn;
                var attributes = current.attributes;
                if (focus === 'attributes') {
                    last = lastAttribute(attributes);
                    if (memo.attributePart === 3) {
                        //
                    } else if (memo.attributePart === 2) {
                        // if (!quoteChecker[next]) {
                        last.value += next;
                        // }
                    } else if (memo.attributePart === 1) {
                        last.operator += next;
                    } else {
                        last.name += next;
                    }
                } else if (focus === 'class') {
                    if (classes.length && memo.classCounter) {
                        classes[classes.length - 1] += next;
                    } else {
                        memo.classCounter += 1;
                        classes.push(next);
                    }
                } else {
                    if (!current[focus]) {
                        current[focus] = '';
                    }
                    if (memo.hashtagCounter >= 2) {
                        return;
                    }
                    current[focus] += next;
                }
            },
            createChild: function () {
                var memo = this;
                var child = createSelector();
                var current = this.current();
                memo.reset(child);
                current.child = child;
                return child;
            }
        },
        tokens: [{
            match:/\,+/igm,
            handle: function (memo, word) {
                if (!memo.attributePart) {
                    memo.flush();
                } else {
                    memo.append(word);
                }
                return memo;
            }
        }, {
            match: /\s+|\'+|\"+/igm,
            handle: function (memo, word) {
                var current = memo.current();
                if (!memo.attributePart) {
                    if (!memo._current) {
                        throws({
                            type: 'SyntaxError',
                            message: 'invalid selector ' + target
                        });
                    } else if (!memo.isEmpty(current)) {
                        memo.createChild();
                        return memo;
                    }
                }
                if (memo.attributePart <= 1) {
                    memo.attributePart = 2;
                }
                if (memo.focusedOn === 'attributes') {
                    memo.append(word);
                }
                return memo;
            }
        }, {
            match: /\>/igm,
            handle: function (memo, word) {
                var current = memo._current;
                if (!memo.attributePart && memo.isEmpty()) {
                    if (memo._root !== (current = memo._current)) {
                        if (current.immediate) {
                            throws({
                                type: 'SyntaxError',
                                message: 'Invalid Selector ' + target
                            });
                        } else {
                            current.immediate = true;
                        }
                    } else {
                        // "> something"
                        throws({
                            type: 'SyntaxError',
                            message: 'Invalid Selector ' + target
                        });
                    }
                }
                return memo;
            }
        }, {
            match: /\]/igm,
            handle: function (memo) {
                memo.current();
                if (memo.attributePart) {
                    memo.attributePart = 3;
                }
                memo.finalizeAttr();
                return memo;
            }
        }, {
            match: /\[/igm,
            handle: function (memo) {
                var current = memo.current();
                if (memo.focusedOn !== 'attributes') {
                    memo.focus('attributes');
                }
                current.attributes.push(createAttribute());
                if (memo.attributePart === 3) {
                    memo.attributePart = 0;
                }
                // start attribute selector
                return memo;
            }
        }, {
            match: /\#/igm,
            handle: function (memo, next) {
                memo.current();
                if (!memo.attributePart) {
                    memo.hashtagCounter += 1;
                    memo.focus('id');
                } else {
                    memo.append(next);
                }
                return memo;
            }
        }, {
            match: /\./igm,
            handle: function (memo, next) {
                memo.current();
                if (!memo.attributePart) {
                    memo.focus('class');
                    memo.classCounter = 0;
                } else {
                    memo.append(next);
                }
                // start attribute selector
                return memo;
            }
        }, {
            match: /\||\~|\*|\=/igm,
            handle: function (memo, word) {
                var current = memo.current();
                if (!memo.attributePart) {
                    memo.attributePart = 1;
                }
                memo.append(word);
                return memo;
            }
        }, {
            match: /\w+|\-+|\_/igm,
            handle: function (memo, word) {
                var last, operator;
                if (memo.attributePart === 1) {
                    last = lastAttribute(memo.current().attributes);
                    operator = last.operator;
                    if (operator[operator.length - 1] === '=') {
                        memo.attributePart = 2;
                    }
                }
                memo.append(word);
                return memo;
            }
        }]
    }).selectors;

    function createSelector() {
        return {
            tagName: null,
            id: null,
            class: [],
            attributes: []
        };
    }

    function createAttribute() {
        return {
            name: '',
            operator: '',
            value: '',
            cased: true
        };
    }

    function lastAttribute(attributes) {
        var last = attributes[attributes.length - 1];
        if (!last) {
            last = createAttribute();
            attributes.push(last);
        }
        return attributes[attributes.length - 1];
    }
});