'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');

module.exports = function(overrides, cb) {
  try {
    if (!overrides.mapping) {
      fs.openSync(process.cwd() + '/mapping.json', 'r');
      overrides.mapping = require(process.cwd() + '/mapping.json');
    } else {
      var path = process.cwd() + '/' + overrides.mapping + '/mapping.json';
      fs.openSync(path, 'r');
      overrides.mapping = require(path);
    }
  } catch (e) {
    overrides.mapping = {};
  }

  return cb(null, overrides);
};
