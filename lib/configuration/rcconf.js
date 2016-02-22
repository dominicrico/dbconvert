'use strict';

/**
 * Module dependencies.
 */

var rc = require('rc');

/**
 * Load the rcconfig file and merge it with the defaults and command line args
 */



module.exports = rc('dbc', {
  log: 'info',
  drop: false,
  sync: false,
  table: undefined,
  logPath: undefined,
  fromHost: undefined,
  toHost: undefined
});
