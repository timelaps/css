var b = require('@timelaps/batterie');
var generator = require('@timelaps/fn/generator/array');
var prefix = require('.');
var data = require('./data');
var reduceOwn = require('@timelaps/array/reduce/own');
var isArray = require('@timelaps/is/array');
b.describe('prefix', function () {
    b.expect(prefix).toBeFunction();
    b.expect(prefix).toThrow();
    b.it('expects a generator like object', function (t) {
        t.expect(function () {
            return prefix({
                next: function () {
                    return {
                        done: true
                    };
                }
            });
        }).toReturnObject();
    });
    b.it('will return an object with all prefixes corresponding to css values', function (t) {
        var prefixed = prefix(generator(data));
        var result = reduceOwn(prefixed, function (memo, item) {
            // gets coerced in to 1
            return memo + isArray(item);
        }, 0);
        t.expect(result).toBeNumber();
        t.expect(result).toBeGreaterThan(0);
    }, 2);
});