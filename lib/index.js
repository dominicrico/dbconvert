'use strict';

/**
 * Module dependencies
 */

var DBconvert = require('./DbConvert');

module.exports = DbConvertFactory();

function DbConvertFactory() {
  return new DBconvert();
}

// Expose constructor for convenience/tests
module.exports.DBconvert = DBconvert;
