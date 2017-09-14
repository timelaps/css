var b = require('@timelaps/batterie');
var stringify = require('.');
var parse = require('../parse');
b.describe('stringify', function () {
    b.expect(stringify).toBeFunction();
    b.it('is analagous to parse', function (t) {
        var input = 'input#identifier.classname.here[lov="e"]>#wild.child,.shopping.popping.moping.stopping';
        var parsed = parse(input);
        t.expect(stringify(parsed)).toBe(input);
    });
});