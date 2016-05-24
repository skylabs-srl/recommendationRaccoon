'use strict';

const raccoon = require('./index.js');
const Hapi = require('hapi');
const fs = require('fs');

const env = process.env.NODE_ENV || "development";
var configPath = './config/' + env + '.js';

// Config
try { // checking if configPath is accessible
  fs.accessSync(configPath, fs.F_OK);
} catch (e) {
  console.log("ERROR(?): " + configPath + " is not accessible!" + e);
  configPath = './config/default.js';
}

var app = { // app will contain everything
  start: new Date(),
  config: require(configPath)
};

const logger = require('./utils/logger')(app);

var now = new Date();
logger.trace("Bootstrapping on " + now.getDate() + "-" + now.getDay() + "-" + now.getFullYear() + " - Config and dependendencies loaded successfully.");

app.models = require('./api/models')(app);
app.ctrls = require('./api/controllers')(app);

logger.trace("Models and controllers loaded successfully.");

// starting server
var server = new Hapi.Server({
  debug: app.config.debugRequests
});

server.connection({ port: app.config.server.port, routes: { cors: true } });
server.route((require('./api/routes')(app)).endpoints);
logger.trace("Routes loaded successfully.");

server.start((err) => { // start server
  if (err) {
    logger.fatal("Can't start server: " + err);
    console.log(err);
  }
  logger.trace('Server Listening on : http://' + app.config.server.host + ':' + app.config.server.port);
  console.log('Server Listening on : http://' + app.config.server.host + ':' + app.config.server.port);
});

process.on('SIGINT', function() {
  server.stop({
    timeout: 5 * 1000
  }, function() {
    var now = new Date();
    logger.trace("Shutting down on " + now.getDate() + "-" + now.getDay() + "-" + now.getFullYear() + " Thanks, see you soon!");
    process.exit(0);
  });
});
process.on('SIGTERM', function() {
  server.stop({
    timeout: 5 * 1000
  }, function() {
    var now = new Date();
    logger.trace("Shutting down on " + now.getDate() + "-" + now.getDay() + "-" + now.getFullYear() + " Thanks, see you soon!");
    process.exit(0);
  });
});
