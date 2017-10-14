module.exports = middleware;

function middleware(fn) {
    return function (query, context) {
        var subquery = createSubquery(query);
        var queried = fn(subquery, context);
        return subset(queried);
    };
}

function createSubquery(query) {
    return query;
}

function subset(queried) {
    return queried;
}