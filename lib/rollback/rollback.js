'use strict';

var async = require('async');
var _ = require('lodash');

module.exports = function(dbConv, callback) {
  var db = dbConv.connections.toHost,
    error = [];

  db.useCollection('_dbConvertRollback_');

  db.findAll(function(entries) {
    async.each(entries, function(entry, cb) {
      var ids = entry.ids;

      if (_.isString(ids)) {
        ids = ids.replace(/(\s)*,(\s)*/g, ',').split(',');
      }

      db.useCollection(entry.tablename);

      async.each(ids, function(id, innerCb) {

        db.delete(id, function(data) {
          if (!data.result.ok) {
            error.push(data.error);
          }
          innerCb(null);
        });
      }, function() {

        db.count(function(count) {
          if (count === 0) {

            db.drop(function(err) {
              return cb(err);
            });

          } else {
            return cb(null);
          }
        });

      });

    }, function(error) {
      if (error && error.length > 0) {
        return callback(error);
      }

      db.useCollection('_dbConvertRollback_');

      db.drop(function() {
        return callback(null);
      });
    });
  });
};
