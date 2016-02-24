'use strict';

var async = require('async');
var _ = require('lodash');
var rollback = require('./rollback');

module.exports = function(configOverride, callback) {
  var dbConvert = this;

  if (_.isFunction(configOverride)) {
    callback = configOverride;
    configOverride = {};
  }

  async.series([
    function(cb) {
      dbConvert.load(configOverride, cb);
    },

    dbConvert.initialize,

    dbConvert.connect,

    function(cb) {
      rollback(dbConvert, cb);
    }

  ], function dbRollbackDone(err) {
    if (err) {
      dbConvert.log.error(err.message);
    }

    dbConvert.down(function() {
      if (callback) {
        return callback(null);
      }
    });
  });

};
