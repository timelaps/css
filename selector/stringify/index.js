module.exports = stringify;
var map = require('@timelaps/n/map');

function stringify(objectSelector) {
    return map(objectSelector, stringifyBlock).join(',');
}

function stringifyBlock(block) {
    return tagName(block.tagName) + id(block.id) + classes(block.class) + attributes(block.attributes) + child(block.child);
}

function child(child) {
    return child ? (child.immediate ? '>' : '') + stringifyBlock(child) : '';
}

function attributes(attributes) {
    return map(attributes, stringifyAttribute);
}

function stringifyAttribute(attribute) {
    return '[' + attribute.name + attribute.operator + attributeValue(attribute.value) + attributeCased(attribute.cased) + ']';
}

function attributeCased(cased) {
    return cased ? '' : ' i';
}

function attributeValue(value_) {
    var value = value_ || '';
    if (value) {
        return '"' + value + '"';
    } else {
        return value;
    }
}

function classes(classes) {
    return classes && classes.length ? '.' + classes.join('.') : '';
}

function tagName(tagName) {
    return tagName || '';
}

function id(id) {
    return id ? '#' + id : '';
}