'use strict';

/**
 * Module dependencies
 */

var DBconvert = require('./DbConvert');

module.exports = dbConvertFactory();

function dbConvertFactory() {
  return new DBconvert();
}

// Expose constructor for convenience/tests
module.exports.DBconvert = DBconvert;
