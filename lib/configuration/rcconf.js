/*eslint global-require: 0 */

'use strict';

/**
 * Module dependencies.
 */

var rc = require('rc');
var _ = require('lodash');
var config;

try {
  config = require(process.cwd() + '/config.json');
} catch (e) {
  config = {};
}

/**
 * Load the rcconfig file and merge it with the defaults and command line args
 */

module.exports = rc('dbc', _.merge({
  log: 'info',
  drop: false,
  sync: false,
  table: undefined,
  logPath: undefined,
  fromHost: undefined,
  toHost: undefined
}, config));
