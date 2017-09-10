var copyCacheable = require('@timelaps/fn/cacheable/copy');
module.exports = copyCacheable(function (total) {
    var tagName, i = 0,
        length = total.length,
        id = null,
        classes = [],
        attributes = [];
    total.replace(/[#|\.|\[]|\]/igm, function (char, index) {
        if (!tagName) {
            // no tag specified could be anything
            tagName = index === 0 || total.slice(0, index);
        } else {
            parseTo(i, index);
        }
        i = index;
        return '';
    });
    // why is this last bit here
    parseTo(i, length);
    // reset tagname if it was never in the selector
    tagName = tagName === true ? null : t;
    return {
        tagName: tagName,
        id: id,
        class: classes,
        attributes: attributes
    };

    function parseTo(i, here) {
        var part, char = total[i];
        if (char === '#') {
            if (!id) {
                id = total.slice(i + 1, here);
            }
        } else if (char === '.') {
            classes.push(total.slice(i + 1, here));
        } else if (char === '[') {
            part = total.slice(i + 1, here - 1);
            part = part.split(/[\'|\"]/);
            attributes.push({
                name: part[0],
                value: part[1]
            });
        } else if (!t && i === 0) {
            t = total.slice(i, here);
        }
    }
});