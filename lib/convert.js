'use strict';

var async = require('async');
var _ = require('lodash');

module.exports = function(configOverride, callback) {
  var dbConvert = this;
  var t = new Date().getTime();

  if (_.isFunction(configOverride)) {
    callback = configOverride;
    configOverride = {};
  }

  async.series([
    function(cb) {
      dbConvert.load(configOverride, cb);
    },

    function(cb) {
      dbConvert.initialize(cb);
    },

    function(cb) {
      dbConvert.connect(cb);
    },

    function(cb) {
      dbConvert.doMigrate(cb);
    },

    function(cb) {
      dbConvert.doRelate(cb);
    }

  ], function dbConvertDone(err) {

    if (err && err.message) {
      dbConvert.log.debug(err.stack);
      dbConvert.log.error(err.message);
    }

    dbConvert.down(function() {

      t = (new Date().getTime() - t);
      dbConvert.log.info('Conversion took %s minutes to complete.',
        dbConvert.helpers.msToHuman(t));

      if (callback) {
        return callback(null);
      }
    });
  });
};
