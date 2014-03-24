#Async vs RSVP vs Q vs Bluebird vs when.js vs Native callbacks
Basic set of code to look at performance overhead of using flow control libraries
vs native callbacks

##About Benchmark
Simple comparison over 100000 runs.

* an async call (setTimeout for 10ms) is called 4 times in parallel
* code waits till all 4 calls are finished
* an assertion is verified that the calls took at least the minimum amount of time needed
* rinse and repeat 100000 times in parallel

While this is naive and doesn't show the flexibility of the various frameworks,
it does show the overhead of simply resolving a set of async tasks.

This is also a bit skewed due to the fact that this is a pretty tight loop.

##SimpleAsync
Simple Async is a naive wrapper around native callbacks to add async.js like
syntax for handling native node callbacks.

Lest there be any doubt of whether these calls are doing what they're supposed to
there are tests that can be run with `npm test`

##Run Benchmark
`time node bench<Lib>.js`  ex. `time node benchSimpleAsync.js`

##Results

* Q - didn't finish (stopped after 40s)
* RSVP - 8.2s
* Async.js - 7.3s
* When.js - 4.1s
* BlueBird - 1.3s
* Native callbacks - 0.8s
