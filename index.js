/**
 * Created by Adib on 17-Nov-16.
 */
'use strict';
(function(){
    var worker;

    function workerImp() {
        var functions = [];

        function executeFunction(name, params){
            if(functions[name]){
                return {status: 'success', output: functions[name](params)};
            } else {
                return {status: 'error', message: 'function ' + name + ' must passed to the worker before execution '};
            }
        }

        onmessage = function (e) {
            var funcName;
            if (e.data.type === 'function') {
                funcName = e.data.name;
                try{
                    functions[funcName] = eval('(' + e.data.body + ')');
                } catch(ex){
                    postMessage({status: 'error', message: 'function ' + funcName + ' can be evaluated,' +
                    ' please check: ' + ex});
                }

            } else if (e.data.type === 'execute') {
                funcName = e.data.name;
                var params = e.data.params;
                postMessage(executeFunction(funcName, params));
            }
        }
    }

    if(window.Worker){
        var blobURL = URL.createObjectURL( new Blob(['(', workerImp.toString(), ')()'],
            {type: 'application/javascript'}));
        worker = new Worker(blobURL);
    }

    function proxyFunction(name){
        return function(i) {
            worker.postMessage({
                type: 'execute',
                name: name,
                params: [i]

            });
            return new Promise(function (resolve, reject){
                worker.onmessage = function(e){
                    if(e.data.status === 'success'){
                        resolve(e.data.output);
                    } else if(e.data.status === 'error'){
                        reject(e.data.message);
                    }
                }
            });
        }

    }

    function createProxyFunction(func){
        worker.postMessage({
            type: 'function',
            name: func.name,
            body: func.toString()
        });
        return proxyFunction(func.name);
    }

    module.exports = {
        createBGTask: createProxyFunction
    };

}());