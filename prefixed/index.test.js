var b = require('@timelaps/batterie');
var prefix = require('.');
b.describe('prefix', function () {
    b.expect(prefix).toBeFunction();
    b.expect(prefix).toThrow();
    b.it('expects a generator', function (t) {
        t.expect(function () {
            return prefix({
                next: function () {}
            });
        }).toReturnObject();
    });
});