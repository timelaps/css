var b = require('@timelaps/batterie');
var parseSelector = require('.');
b.describe('parseSelector', function () {
    b.expect(parseSelector).toBeFunction();
    b.describe('parses a given selector by', function () {
        b.it('tagName', function (t) {
            t.expect(parseSelector('div')).toEqual([{
                tagName: 'div',
                id: null,
                class: [],
                attributes: []
            }]);
        });
        b.describe('id', function () {
            b.it('detects one', function (t) {
                t.expect(parseSelector('#stringhere')).toEqual([{
                    tagName: null,
                    id: 'stringhere',
                    class: [],
                    attributes: []
                }]);
            });
            b.it('invalidates subsequent', function (t) {
                t.expect(parseSelector('#stringhere#stringthere')).toEqual([{
                    tagName: null,
                    id: 'stringhere',
                    class: [],
                    attributes: []
                }]);
            });
            b.it('can even detect short', function (t) {
                t.expect(parseSelector('#a')).toEqual([{
                    tagName: null,
                    id: 'a',
                    class: [],
                    attributes: []
                }]);
            });
            b.it('but only if they\'re valid', function (t) {
                t.expect(parseSelector('#')).toEqual([{
                    tagName: null,
                    id: null,
                    class: [],
                    attributes: []
                }]);
            });
        });
        b.describe('class', function () {
            b.it('detects one', function (t) {
                t.expect(parseSelector('.whatever')).toEqual([{
                    tagName: null,
                    id: null,
                    class: ['whatever'],
                    attributes: []
                }]);
            });
            b.it('or multiple', function (t) {
                t.expect(parseSelector('.whatever.happens.vagas.stays')).toEqual([{
                    tagName: null,
                    id: null,
                    class: ['whatever', 'happens', 'vagas', 'stays'],
                    attributes: []
                }]);
            });
        });
        b.describe('attributes', function () {
            b.it('without values', function (t) {
                t.expect(parseSelector('[data-attr]')).toEqual([{
                    tagName: null,
                    id: null,
                    class: [],
                    attributes: [{
                        name: 'data-attr',
                        operator: '',
                        value: '',
                        cased: true
                    }]
                }]);
            });
            b.it('with values', function (t) {
                t.expect(parseSelector('[data-attribute="validvalue"]')).toEqual([{
                    tagName: null,
                    id: null,
                    class: [],
                    attributes: [{
                        name: 'data-attribute',
                        operator: '=',
                        value: 'validvalue',
                        cased: true
                    }]
                }]);
            });
            b.it('without quotes', function (t) {
                t.expect(parseSelector('[data-attribute=unquoted]')).toEqual([{
                    tagName: null,
                    id: null,
                    class: [],
                    attributes: [{
                        name: 'data-attribute',
                        operator: '=',
                        value: 'unquoted',
                        cased: true
                    }]
                }]);
            });
            b.it('with complex operators', function (t) {
                t.expect(parseSelector('[data-attribute|="web"]')).toEqual([{
                    tagName: null,
                    id: null,
                    class: [],
                    attributes: [{
                        name: 'data-attribute',
                        operator: '|=',
                        value: 'web',
                        cased: true
                    }]
                }]);
            });
            b.it('with casing insensitizer', function (t) {
                var result = [{
                    tagName: null,
                    id: null,
                    class: [],
                    attributes: [{
                        name: 'data-attribute',
                        operator: '~=',
                        value: 'site',
                        cased: false
                    }]
                }];
                t.expect(parseSelector('[data-attribute~="site" i]')).toEqual(result);
                t.expect(parseSelector('[data-attribute~="site"i]')).toEqual(result);
                t.expect(parseSelector('[data-attribute~="site" I]')).toEqual(result);
                t.expect(parseSelector('[data-attribute~="site"I]')).toEqual(result);
            }, 4);
            b.it('will not interfere with other pieces of the selector', function (t) {
                t.expect(parseSelector('[href*="#h"]')).toEqual([{
                    tagName: null,
                    id: null,
                    class: [],
                    attributes: [{
                        name: 'href',
                        operator: '*=',
                        value: '#h',
                        cased: true
                    }]
                }]);
            });
            b.it('parses multiple attributes', function (t) {
                t.expect(parseSelector('custom-tag[one|=".classy"][two~="#hashy" i]')).toEqual([{
                    tagName: 'custom-tag',
                    id: null,
                    class: [],
                    attributes: [{
                        name: 'one',
                        operator: '|=',
                        value: '.classy',
                        cased: true
                    }, {
                        name: 'two',
                        operator: '~=',
                        value: '#hashy',
                        cased: false
                    }]
                }]);
            });
            b.it('handles spaces in the attr', function (t) {
                t.expect(parseSelector('custom-tag[one~="what happens in vagas"]')).toEqual([{
                    tagName: 'custom-tag',
                    id: null,
                    class: [],
                    attributes: [{
                        name: 'one',
                        operator: '~=',
                        value: 'what happens in vagas',
                        cased: true
                    }]
                }]);
            });
            b.it('throws error filled selectors', function (t) {
                t.expect(function () {
                    parseSelector('custom-tag[one="\'"]');
                }).toThrow();
            });
        });
        b.describe('child', function (t) {
            b.it('is added when there is a child selector present', function (t) {
                t.expect(parseSelector('custom-tag custom-child')).toEqual([{
                    tagName: 'custom-tag',
                    id: null,
                    class: [],
                    attributes: [],
                    next: {
                        child: true,
                        tagName: 'custom-child',
                        id: null,
                        class: [],
                        attributes: []
                    }
                }]);
            });
            b.it('can be flagged as immediate', function (t) {
                // b.log(JSON.stringify(parseSelector('custom-tag > custom-child'), null, 2));
                t.expect(parseSelector('custom-tag > custom-child')).toEqual([{
                    tagName: 'custom-tag',
                    id: null,
                    class: [],
                    attributes: [],
                    next: {
                        child: true,
                        tagName: 'custom-child',
                        id: null,
                        class: [],
                        attributes: [],
                        immediate: true
                    }
                }]);
            });
            // b.it('can handle excessively complex selectors', function () {});
        });
        b.describe('aggregators', function () {
            b.it('parses comma separated selector list', function (t) {
                t.expect(parseSelector('custom-tag,[custom-attribute],.a-classname')).toEqual([{
                    tagName: 'custom-tag',
                    id: null,
                    class: [],
                    attributes: []
                }, {
                    tagName: null,
                    id: null,
                    class: [],
                    attributes: [{
                        name: 'custom-attribute',
                        operator: '',
                        value: '',
                        cased: true
                    }]
                }, {
                    tagName: null,
                    id: null,
                    class: ['a-classname'],
                    attributes: []
                }]);
            });
        });
        b.describe('orchestra', function () {
            b.it('can handle excessively complex selectors', function (t) {
                var a = '.a[custom][class="never"]#goes.unwanted[again*="what" i]';
                var aParsed = {
                    tagName: null,
                    id: 'goes',
                    class: ['a', 'unwanted'],
                    attributes: [{
                        name: 'custom',
                        operator: '',
                        value: '',
                        cased: true
                    }, {
                        name: 'class',
                        operator: '=',
                        value: 'never',
                        cased: true
                    }, {
                        name: 'again',
                        operator: '*=',
                        value: 'what',
                        cased: false
                    }]
                };
                var _b = '.and#here[we="go"]#again';
                var bParsed = {
                    tagName: null,
                    id: 'here',
                    class: ['and'],
                    attributes: [{
                        name: 'we',
                        operator: '=',
                        value: 'go',
                        cased: true
                    }]
                };
                var c = '[parking|="angle><"].only .no.parking#here.sunday';
                var cParsed = {
                    tagName: null,
                    id: null,
                    class: ['only'],
                    attributes: [{
                        name: 'parking',
                        operator: '|=',
                        value: 'angle><',
                        cased: true
                    }],
                    next: {
                        child: true,
                        tagName: null,
                        id: 'here',
                        class: ['no', 'parking', 'sunday'],
                        attributes: []
                    }
                };
                var d = 'x-car.white.black[color="turquoise"]#white >.four#wheeled[auto="bomiles"]';
                var dParsed = {
                    tagName: 'x-car',
                    id: 'white',
                    class: ['white', 'black'],
                    attributes: [{
                        name: 'color',
                        operator: '=',
                        value: 'turquoise',
                        cased: true
                    }],
                    next: {
                        child: true,
                        tagName: null,
                        id: 'wheeled',
                        class: ['four'],
                        attributes: [{
                            name: 'auto',
                            operator: '=',
                            value: 'bomiles',
                            cased: true
                        }],
                        immediate: true
                    }
                };
                var selector = [a, _b, c, d];
                t.expect(parseSelector(selector.join(','))).toEqual([aParsed, bParsed, cParsed, dParsed]);
            });
        });
        b.it('parses complex ones', function (t) {
            t.expect(parseSelector('input#identifier.classname.here[lov=e]>.child#wild,.shopping.popping.moping.stopping')).toEqual([{
                tagName: 'input',
                id: 'identifier',
                class: ['classname', 'here'],
                attributes: [{
                    name: 'lov',
                    operator: '=',
                    value: 'e',
                    cased: true
                }],
                next: {
                    child: true,
                    tagName: null,
                    id: 'wild',
                    class: ['child'],
                    attributes: [],
                    immediate: true
                }
            }, {
                tagName: null,
                id: null,
                class: ['shopping', 'popping', 'moping', 'stopping'],
                attributes: []
            }]);
        });
    });
});