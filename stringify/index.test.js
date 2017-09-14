var b = require('@timelaps/batterie');
var stringify = require('.');
b.describe('stringify', function () {
    b.expect(stringify).toBeFunction();
    b.it('stringifies json to a css structure', function (t) {
        t.expect(stringify({
            '.stringify': {
                display: 'block'
            }
        })).toBe('.stringify{display: block;}');
    });
    b.it('can create prefix blocks where there otherwise may not be', function (t) {
        t.expect(stringify({
            '.stringify': {
                display: 'block'
            }
        }, {
            prefixes: {
                display: ['-blah-', '']
            }
        })).toBe('.stringify{-blah-display: block; display: block;}');
    });
    b.describe('nesting', function () {
        b.it('with children', function (t) {
            t.expect(stringify({
                '.stringify': {
                    '.me': {
                        display: 'block'
                    }
                }
            })).toBe('.stringify .me{display: block;}');
        });
        b.it('with replacement', function (t) {
            t.expect(stringify({
                '.stringify': {
                    '.me&': {
                        display: 'block'
                    }
                }
            })).toBe('.me.stringify{display: block;}');
        });
        b.it('with multiple replacements', function (t) {
            t.expect(stringify({
                '.c': {
                    '&.b&': {
                        '#a &': {
                            display: 'block'
                        }
                    }
                }
            })).toBe('#a .c.b.c{display: block;}');
        });
    });
});