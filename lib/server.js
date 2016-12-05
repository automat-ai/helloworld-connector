/* eslint no-console: 0 */
'use strict';

module.exports = function (id, logger) {
  const express     = require('express'),
        compression = require('compression'),
        bodyParser  = require('body-parser'),
        array2hash  = require('./array2hash'),
        routes      = require('./routes'),
        app         = express(),
        basicAuth   = require('basic-auth-connect'),
        bunyanMiddleware = require('bunyan-middleware'),
        config = {
          id:   id,
          username: 'bot',
          password: 'secret',
          port: process.env.PORT     || 3000,
          env:  process.env.NODE_ENV || 'production'
        };
  

  app.use(basicAuth(config.username, config.password));
  app.use(require('express-toobusy')());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(array2hash);

  if (config.env === 'dev') {
    app.use(bunyanMiddleware({
        headerName: 'X-Request-Id'
      , propertyName: 'reqId'
      , logName: 'req_id'
      , obscureHeaders: []
      , logger: logger
      }
    ));
  }

  routes(app, config, logger);
  app.listen(config.port, () => {
    logger.info(`hello-world-[${config.id}] listening on port ${config.port}!`);
  });
};
