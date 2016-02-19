'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');

module.exports = function(cb, overrides) {
  try {
    fs.accessSync(process.cwd() + '/mapping.json', fs.FS_OK);
    overrides.logger.mapping = require(process.cwd() + '/mapping.json');
  } catch (e) {
    overrides.logger.mapping = {};
  }

  return cb(null, overrides.logger);
};
