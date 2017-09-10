var b = require('@timelaps/batterie');
var stringify = require('.');
b.describe('stringify', function () {
    b.expect(stringify).toBeFunction();
    b.it('stringifies json to a css structure', function (t) {
        t.expect(stringify({
            '.stringify': {
                display: 'block'
            }
        })).toBe('.stringify{display:block;}');
    });
});