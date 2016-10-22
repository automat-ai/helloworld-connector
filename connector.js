/* eslint no-console: 0 */
'use strict';

const cluster = require('cluster'),
      nb_cpu  = require('os').cpus().length,
      server  = require('./lib/server'),
      bunyan  = require('bunyan'),
      log     = bunyan.createLogger({
                  name:  "helloworld",
                  level: process.env.LEVEL || 'INFO'
                });

function start_master() {
  log.info(`[master] Starting ${nb_cpu} worker thread.`);
  for (var nb_worker = 0; nb_worker < nb_cpu; nb_worker++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    log.error(`[master] ${worker.process.pid} died >>> restarting it.`);
    // TO restart a worker when it dies, uncomment this line.
    // cluster.fork();
  });

  cluster.on('error', (worker, error) => {
    log.error(`[master] worker: ${worker.process.pid} ERROR >>> worker:${worker} error:${error}`);
  });
}

function start_worker(id, log) {
  server(id, log);
}

if (cluster.isMaster) {
  start_master();
} else {
  start_worker(cluster.worker.id, log);
}