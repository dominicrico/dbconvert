'use strict';

var async = require('async');
//var _ = require('lodash');

module.exports = function(callback) {
  var dbConv = this;

  dbConv.log.info('Starting migration process...');

  async.eachSeries(dbConv.config.mapping, function(mapping, seriesCb) {
    async.auto({
      init: function(cb) {
        //TODO convert mapping json to something useful.
        cb(null, mapping);
      },
      drop: ['init', function(cb, mapping) {
        if (dbConv.config.drop) {
          drop(mapping.init.split(':')[1], cb);
        } else {
          cb(null);
        }
      }]
    }, function(err) {
      seriesCb(err);
    });
  }, function(err) {
    dbConv.log.info('Migration process successfully completed.');
    return callback(err);
  });

  function drop(collection, cb) {
    dbConv.connections.toHost.drop(collection, cb);
  }

};
