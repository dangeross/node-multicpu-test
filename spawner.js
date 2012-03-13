var os = require('os'),
    cluster = require('cluster');

var numCPUs = os.cpus().length;
var workers = {};

console.log('CPUs: ' + numCPUs);

if(cluster.isMaster) {
    var spawner = function() {
        var worker = cluster.fork();
        workers[worker.pid] = worker;      
        
        console.log('Spawned '+workers[worker.pid].pid);
    };
    
    for(var i = 0; i < numCPUs; i++) {
        spawner();
    }
    
    cluster.on('death', function(worker) {
        console.log('Worker '+worker.pid+' died');
        delete workers[worker.pid];
        
        spawner();
    });
}
else {
    console.log('Worker '+process.pid+' started');
    var i = 0;
    
    setInterval(function() {
        console.log('Pid: '+process.pid+': '+(i++));
        
        if(i == 10) process.exit(0);
    }, 1000);
}