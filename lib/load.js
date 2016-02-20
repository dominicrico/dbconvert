'use strict';

var dbConvertConfig = require('./configuration');
var rcconf = require('./configuration/rcconf');
var _ = require('lodash');
var async = require('async');

module.exports = function(dbConvert) {

  var configuration = dbConvertConfig(dbConvert);

  return function load(configOverride, cb) {
    if (_.isFunction(configOverride)) {
      cb = configOverride;
      configOverride = {};
    }

    if (require.main !== module) {
      configOverride = rcconf;
    } else {
      configOverride = configOverride || {};
    }

    dbConvert.config = _.cloneDeep(configOverride);

    async.auto({
      config: [configuration.load]
    }, function(err) {
      return cb(err, dbConvert);
    });

    return dbConvert;
  };

};
