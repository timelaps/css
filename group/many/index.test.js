var b = require('@timelaps/batterie');
var groupMany = require('.');
b.describe('groupMany', function () {
    b.expect(groupMany).toBeFunction();
    b.it('can handle an object to be concatted as a style block', function (t) {
        t.expect(groupMany({
            display: 'block',
            position: 'relative',
            top: 0,
            opacity: 0.4
        })).toBe('display: block; position: relative; top: 0px; opacity: 0.4;');
    });
});