var assert = require('assert');
var simpleAsync = require('../simpleAsync');

describe("Simple Async", function(){
    describe("#parallelize", function(){

        it('should do functions in parallel', function(done){
            var minExpectedTime = 100;
            var maxExpectedTime = 200; //give 100ms leeway (still valid becuase should be nowhere near the serialed 500ms time)
            var wait100 = function(cb) {
                setTimeout(cb, 100);
            };
            var startTime = new Date().getTime();
            simpleAsync.parallelize([
                wait100,
                wait100,
                wait100,
                wait100,
                wait100
            ], function(err, results){
                var dt = new Date().getTime() - startTime;
                assert.ok(dt > minExpectedTime);
                assert.ok(dt < maxExpectedTime);
                done();
            });
        });

        it('should do functions in parallel and return values in order', function(done){
            var wait100 = function(i, cb) {
                setTimeout(function(){
                    cb(null, i);
                }, 100);
            };
            var startTime = new Date().getTime();
            simpleAsync.parallelize([
                wait100.bind(null, 1),
                wait100.bind(null, 2),
                wait100.bind(null, 3),
                wait100.bind(null, 4),
                wait100.bind(null, 5)
            ], function(err, results){
                assert.deepEqual(results, [1,2,3,4,5]);
                done();
            });
        });

        it('should do functions in parallel and return errors and values in order', function(done){
            var anError = "An Error";
            var wait100AndReturnErrOn3 = function(i, cb) {
                setTimeout(function(){
                    if (i == 3) {
                        cb(anError);
                    } else {
                        cb(null, i);
                    }
                }, 100);
            };
            var startTime = new Date().getTime();
            simpleAsync.parallelize([
                wait100AndReturnErrOn3.bind(null, 0),
                wait100AndReturnErrOn3.bind(null, 1),
                wait100AndReturnErrOn3.bind(null, 2),
                wait100AndReturnErrOn3.bind(null, 3),
                wait100AndReturnErrOn3.bind(null, 4)
            ], function(errors, results){
                assert.deepEqual(results, [0,1,2,undefined,4]);
                assert.ok(errors.length > 0);
                assert.equal(errors[3], anError);
                done();
            });
        });

        it('should do functions in series and return values in order', function(done){
            var current = 1;
            var wait100 = function(i, cb) {
                setTimeout(function(){
                    //verify that we're calling our function
                    //in the order we expect by comparing i to a counter
                    assert.equal(i, current);
                    current++;
                    cb(null, i);
                }, 10);
            };
            var startTime = new Date().getTime();
            simpleAsync.serialize([
                wait100.bind(null, 1),
                wait100.bind(null, 2),
                wait100.bind(null, 3),
                wait100.bind(null, 4),
                wait100.bind(null, 5)
            ], function(err, results){
                assert.deepEqual(results, [1,2,3,4,5]);
                done();
            });
        });
    });
});
