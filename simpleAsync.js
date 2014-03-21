
/**
 * Simple parallelize function
 * Assumes fns array has function(err, callback) items and no nulls
 * This is naive, but no error checking == fast
 *
 * cb should be a function(errors[], results[])
 * where errors and results will be arrays containing the results of the fn call
 *
 * so if fn[0] returns 'x' and fn[1] returns an error,
 * then errors == [undefined, err_from_fn1] and results == ['x', undefined]
 */
exports.parallelize = function(fns, cb) {
    var fnsLength = fns.length,
        i = 0,
        countingCallback = makeCountNCallback(fnsLength, cb);
    for (i; i < fnsLength; ++i) {
        fns[i](makeIndexedCallback(i, countingCallback));
    }
}

/**
 * Simple serialize function
 * Assumes fns array has function(err, callback) items and no nulls
 * This is naive, but no error checking == fast
 *
 * cb should be a function(errors[], results[])
 * where errors and results will be arrays containing the results of the fn call
 *
 * so if fn[0] returns 'x' and fn[1] returns an error,
 * then errors == [undefined, err_from_fn1] and results == ['x', undefined]
 */
exports.serialize = function(fns, cb) {
    var fnsLength = fns.length,
        i = 0,
        errors = [],
        results = [];
    fns[i](makeChainedCallback(i, fns, errors, results, cb));
}

/**
 * Create a function that will call the next function in a chain
 * when finished
 */
function makeChainedCallback(i, fns, errors, results, cb) {
    return function(err, result) {
        if (err) errors[i] = err;
        results[i] = result;
        if (fns[i + 1]) {
            return fns[i + 1](makeChainedCallback(i + 1, fns, errors, results, cb));
        } else {
            return cb(errors, results);
        }
    }
}

/**
 * Create a function that will call a callback after n function calls
 */
function makeCountNCallback(n, cb) {
    var count = 0,
        results = [],
        errors = [];
    return function(index, err, result) {
        results[index] = result;
        if (err) errors[index] = err;
        if (++count == n) {
            cb(errors, results);
        }
    }
}

/**
 * Create a function that will call a callback with a specified index
 */
function makeIndexedCallback(i, cb) {
    return function(err, result) {
        cb(i, err, result);
    }
}
