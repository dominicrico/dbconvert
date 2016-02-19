#!/usr/bin/env node

'use strict';

var DBconvert = require('../lib');
var conf = require('../lib/configuration/rcconf');
var pkg = require('../package.json');
var _ = require('lodash');
var log = require('winston');

module.exports = function() {

  log.level = conf['log-level'] || conf.l || 'info';

  log.info('Starting database migration...');

  var config = _.merge({
    rootPath: process.cwd(),
    dbConvertPackageJSON: pkg
  }, conf);

  DBconvert = new DBconvert(config);

  DBconvert.convert();
};
