'use strict';

var dbConvertConfig = require('./configuration');
var _ = require('lodash');
var async = require('async');

module.exports = function(dbConvert) {

  var configuration = dbConvertConfig(dbConvert);

  return function load(configOverride, cb) {

    if (_.isFunction(configOverride)) {
      cb = configOverride;
      configOverride = {};
    }

    // Ensure override is an object and clone it (or make an empty object if it's not)
    configOverride = configOverride || {};
    dbConvert.config = _.cloneDeep(configOverride);

    async.auto({
      config: [configuration.load]
    }, function(err) {
      return cb(err, dbConvert);
    });

    return dbConvert;
  };

};
