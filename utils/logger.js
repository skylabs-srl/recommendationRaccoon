'use strict';

module.exports = function(app){

  var log4js = require('log4js');
  log4js.configure(app.config.loggerOptions);
  var logger = log4js.getLogger('BNL-server');

  return logger;
};
