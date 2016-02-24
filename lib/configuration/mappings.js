'use strict';

/*eslint global-require: 0 */

/**
 * Module dependencies.
 */

var fs = require('fs');

module.exports = function(overrides, cb) {
  try {
    if (!overrides.mapping) {
      fs.openSync(process.cwd() + '/mapping.js', 'r');
      overrides.mapping = require(process.cwd() + '/mapping.js');
    } else {
      var path = process.cwd() + overrides.mapping;
      overrides.mapping = require(path);
    }
  } catch (e) {
    overrides.mapping = {};
  }

  overrides.toHost.mappings = overrides.mapping;

  return cb(null, overrides);
};
