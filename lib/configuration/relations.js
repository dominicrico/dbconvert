'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');

module.exports = function(overrides, cb) {
  try {
    if (!overrides.relations) {
      fs.openSync(process.cwd() + '/relation.json', 'r');
      overrides.relation = require(process.cwd() + '/relation.json');
    } else {
      var path = process.cwd() + '/' + overrides.mapping + '/relation.json';
      fs.openSync(path, 'r');
      overrides.relation = require(overrides.relations +
        '/relation.json');
    }
  } catch (e) {
    overrides.relation = {};
  }

  return cb(null, overrides);
};
