var Q = require('q');
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
    var promises = [wait10(), wait10(), wait10(), wait10()];
    Q.all(promises).then(function(){
        assert.ok(new Date().getTime() - start >= 10);
        cb(i);
    });
}

function wait10() {
    return new Q.Promise(function(resolve){
        setTimeout(resolve, 10);
    });
}

setTimeout(function(){ process.exit(1); }, config.benchTimeout);
