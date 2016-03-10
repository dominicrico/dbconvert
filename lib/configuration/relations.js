'use strict';

/*eslint global-require: 0 */

/**
 * Module dependencies.
 */

var fs = require('fs');

module.exports = function(overrides, cb) {
  try {
    if (!overrides.relation) {
      fs.openSync(process.cwd() + '/relation.js', 'r');
      overrides.relation = require(process.cwd() + '/relation.js');
    } else {
      var path = process.cwd() + overrides.relation;
      overrides.relation = require(path);
    }
  } catch (e) {
    overrides.relation = {};
  }

  overrides.toHost.relations = overrides.relation;

  return cb(null, overrides);
};
