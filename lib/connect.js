'use strict';

var async = require('async');

module.exports = function(callback) {
  var dbConvert = this,
    config;
  dbConvert.connections = {
    fromHost: null,
    toHost: null
  };

  dbConvert.log.verbose('Loading adapters...');

  async.forEachOf(dbConvert.connections, function(value, key, cb) {
    config = dbConvert.config[key];
    dbConvert.connections[key] = loadAdapter(config, cb);
  }, function(err) {
    if (err) {
      throw Error(err);
    }

    dbConvert.log.verbose('Adapter `%s` and `%s` loaded successfully.',
      dbConvert.config.fromHost.adapter,
      dbConvert.config.toHost.adapter);

    callback(null);
  });

  function loadAdapter(config, cb) {
    var adp;

    dbConvert.log.silly('Loading adapter `%s`...', config.adapter);

    try {
      adp = require('./adapter/' + config.adapter);
    } catch (e) {
      try {
        adp = require(config.adapter);
      } catch (e) {}
    }

    return new adp(config, cb);
  }
};
