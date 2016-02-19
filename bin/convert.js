#!/usr/bin/env node

'use strict';

var DBconvert = require('../lib');
var conf = require('../lib/configuration/rcconf');
var pkg = require('../package.json');
var _ = require('lodash');
var log = require('winston').cli();

module.exports = function() {

  log.level = conf.log;

  log.info('Starting database convertion...');

  delete conf.configs;

  var config = _.merge({
    rootPath: process.cwd(),
    dbConvertPackageJSON: pkg
  }, conf);

  DBconvert.convert(config);
};
