#run-in-worker
A util function that transfer execution of function to a web worker

###How to install
```
npm i run-in-worker -S
```

###How to use
```javascript
var worker = require('run-in-worker');
function add(a, b){
    return a + b;
}

var addInWorker = worker.createBGTask(add);

console.log('Adding on main thread, 3 + 7 = ', add(3,7));
console.log('Adding on web worker thread, 3 + 7 = ', addInWorker(3,7));
```
