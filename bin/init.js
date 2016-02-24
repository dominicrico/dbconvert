'use strict';

var conf = require('../lib/configuration/rcconf');
var pkg = require('../package.json');
var _ = require('lodash');
var log = require('winston').cli();

module.exports = function(msg) {
  log.level = conf.log;

  log.setLevels(log.config.npm.levels);
  log.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    verbose: 'green',
    debug: 'blue',
    silly: 'magenta'
  });

  if (!conf._.silent) {
    log.info(msg);
  }

  delete conf.configs;

  var config = _.merge({
    rootPath: process.cwd(),
    dbConvertPackageJSON: pkg
  }, conf);

  return config;
};
