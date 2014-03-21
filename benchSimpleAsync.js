var simpleAsync = require('./simpleAsync');
var assert = require('assert');
var config = require('./config');

var runCount = config.runCount;

console.log(new Date().getTime());

for(var i = 0; i < runCount; ++i) {
    doRun(i, areWeDone)
}

function areWeDone(i) {
    if (i == runCount - 1) {
        console.log(new Date().getTime());
        process.exit(0);
    }
};

function doRun(i, cb) {
    var start = new Date().getTime();
    simpleAsync.parallelize([
      wait10,
      wait10,
      wait10,
      wait10
    ], function(){
        assert.ok(new Date().getTime() - start >= 10);
        cb(i);
    });
}

function wait10(cb) {
    setTimeout(cb, 10);
}

setTimeout(function(){ process.exit(1); }, config.benchTimeout);
