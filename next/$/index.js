module.exports = middleware;

function middleware(document, resolve, fn) {
    return function (query, context) {
        var ctx = resolve(context, document);
        var subquery = createSubquery(query);
        var queried = fn(subquery, ctx);
        return subset(queried);
    };
}

function createSubquery(query) {
    return query;
}

function subset(queried) {
    return queried;
}