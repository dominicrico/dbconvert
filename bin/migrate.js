#!/usr/bin/env node

'use strict';

var DBconvert = require('../lib');
var conf = require('../lib/configuration/rcconf');
var pkg = require('../package.json');
var _ = require('lodash');
var log = require('winston').cli();

module.exports = function() {

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

  if (!conf._.quiet) {
    log.info('Starting database migration...');
  }

  delete conf.configs;

  var config = _.merge({
    rootPath: process.cwd(),
    dbConvertPackageJSON: pkg
  }, conf);

  DBconvert.migrate(config);
};
