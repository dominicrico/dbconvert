'use strict';

/**
 * Module dependencies.
 */

var async = require('async');

module.exports = function down(options, callback) {
  var dbConvert = this;

  dbConvert.log.verbose('Shutting down DBconvert...');

  // Options are optional
  if ('function' === typeof options) {
    callback = options;
    options = null;
  }

  // Callback is optional
  callback = callback || function(err) {
    if (err) {
      return dbConvert.log.error(err);
    }
  };

  options = options || {};
  options.delay = options.delay || 100;

  dbConvert._exiting = true;

  async.series([

    function shutdownDBConnections(cb) {
      dbConvert.log.verbose(
        'Closing database connections...');
      if (dbConvert.connections) {
        async.parallel([
          dbConvert.connections.fromHost.close,
          dbConvert.connections.toHost.close
        ], function(err) {
          if (err) {
            dbConvert.log.verbose(
              'Error while closing database connections.',
              err);
          }

          return closed(cb);
        });
      } else {
        dbConvert.log.verbose(
          'No connections to close.');
        return cb(null);
      }

      function closed(callback) {
        dbConvert.log.verbose(
          'Database connection closed successfully.');
        return callback(null);
      }
    },

    function removeListeners(cb) {

      dbConvert.log.verbose(
        'Removing listeners...');

      var listeners = dbConvert._processListeners;

      if (listeners) {
        process.removeListener('SIGUSR2', listeners.sigusr2);
        process.removeListener('SIGINT', listeners.sigint);
        process.removeListener('SIGTERM', listeners.sigterm);
        process.removeListener('exit', listeners.exit);
      }

      dbConvert._processListeners = null;

      dbConvert.log.verbose(
        'All listeners removed successfully.');

      cb();
    }
  ], callback);

};
