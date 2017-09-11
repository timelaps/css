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
                // b.log(JSON.stringify(parseSelector('#stringhere#stringthere'), null, 2));
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
        //     b.describe('attributes', function () {
        //         b.it('without values', function (t) {
        //             t.expect(parseSelector('[data-attr]')).toEqual({
        //                 tagName: null,
        //                 id: null,
        //                 class: [],
        //                 attributes: [{
        //                     name: 'data-attr',
        //                     operator: '=',
        //                     value: '',
        //                     cased: true
        //                 }]
        //             });
        //         });
        //         b.it('with values', function (t) {
        //             t.expect(parseSelector('[data-attribute="validvalue"]')).toEqual({
        //                 tagName: null,
        //                 id: null,
        //                 class: [],
        //                 attributes: [{
        //                     name: 'data-attribute',
        //                     operator: '=',
        //                     value: 'validvalue',
        //                     cased: true
        //                 }]
        //             });
        //         });
        //         b.it('without quotes', function (t) {
        //             t.expect(parseSelector('[data-attribute=unquoted]')).toEqual({
        //                 tagName: null,
        //                 id: null,
        //                 class: [],
        //                 attributes: [{
        //                     name: 'data-attribute',
        //                     operator: '=',
        //                     value: 'unquoted',
        //                     cased: true
        //                 }]
        //             });
        //         });
        //         b.it('with complex operators', function (t) {
        //             t.expect(parseSelector('[data-attribute|="web"]')).toEqual({
        //                 tagName: null,
        //                 id: null,
        //                 class: [],
        //                 attributes: [{
        //                     name: 'data-attribute',
        //                     operator: '|=',
        //                     value: 'web',
        //                     cased: true
        //                 }]
        //             });
        //         });
        //         b.it('with casing insensitizer', function (t) {
        //             var result = {
        //                 tagName: null,
        //                 id: null,
        //                 class: [],
        //                 attributes: [{
        //                     name: 'data-attribute',
        //                     operator: '~=',
        //                     value: 'site',
        //                     cased: false
        //                 }]
        //             };
        //             t.expect(parseSelector('[data-attribute~="site" i]')).toEqual(result);
        //             t.expect(parseSelector('[data-attribute~="site"i]')).toEqual(result);
        //             t.expect(parseSelector('[data-attribute~="site" I]')).toEqual(result);
        //             t.expect(parseSelector('[data-attribute~="site"I]')).toEqual(result);
        //         }, 4);
        //         b.it('will not interfere with other pieces of the selector', function (t) {
        //             t.expect(parseSelector('[href*="#h"]')).toEqual({
        //                 tagName: null,
        //                 id: null,
        //                 class: [],
        //                 attributes: [{
        //                     name: 'href',
        //                     operator: '*=',
        //                     value: '#h',
        //                     cased: true
        //                 }]
        //             });
        //         });
        //     });
    });
});