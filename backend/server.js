let express = require('express');
let cluster = require('cluster');
let middlewares = require('./core/commons/middlewares');
let log = require('./core/commons/logger');
const config = require('./core/configs/config');

let messagePassingApi = {};
messagePassingApi.activeWorkerList = [];
messagePassingApi.refreshActiveWorkerList = () => {
    let newWorkers = Object.keys(cluster.workers);
    for (let i = newWorkers.length - 1; i >= 0; i--) {
        if (messagePassingApi.activeWorkerList.indexOf(newWorkers[i]) === -1) {
            cluster.workers[newWorkers[i]].on('message', messagePassingApi.onMessageHandler);
        }
    }
    messagePassingApi.activeWorkerList = newWorkers;
};
messagePassingApi.onMessageHandler = (msg) => {
    let newKeys = Object.keys(cluster.workers);
    for (let j = newKeys.length - 1; j >= 0; j--) {
        cluster.workers[newKeys[j]].send(msg);
    }
};
if (cluster.isMaster) {
    let numCPUs = require('os').cpus().length;
    numCPUs = numCPUs > 8 ? 8 : numCPUs;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('death', (worker) => {
        cluster.fork();
        messagePassingApi.refreshActiveWorkerList();
    });
    cluster.on('disconnect', (worker) => {
        cluster.fork();
        messagePassingApi.refreshActiveWorkerList();
    });
    messagePassingApi.refreshActiveWorkerList();
} else {
    let app = express();
    app.use(require('body-parser').json());
    app.use(middlewares.cors);
    app.use(middlewares.apiTimeout(60000));
    process.on('uncaughtException', function (err) {
        log.error(err);
    });
    let apiRoutes = require('./core/routes/v1route.js')(express);
    app.use((req, res, next) => {
        log.info("Incoming Request : " + req.url)
        next();
    })
    app.use('/api', apiRoutes);
    app.use(middlewares.error404);
    app.use(middlewares.error40x);
    app.listen(config.port);
    log.info("Server Started on " + config.port);
};