'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');

module.exports = function(cb, overrides) {
  try {
    fs.accessSync(process.cwd() + '/relation.json', fs.FS_OK);
    overrides.mappings.relation = require(process.cwd() + '/relation.json');
  } catch (e) {
    overrides.mappings.relation = {};
  }

  return cb(null, overrides.mappings);
};
