'use strict';

var async = require('async');

module.exports = function() {
  var dbConvert = this,
    config;
  dbConvert.connections = {
    fromHost: null,
    toHost: null
  };

  dbConvert.log.verbose('Loading adapters...');

  async.forEachOf(dbConvert.connections, function(value, key, callback) {
    config = dbConvert.config[key];

    dbConvert.connections[key] = loadAdapter(config, callback);
  }, function(err) {
    if (err) {
      throw Error(err);
    }

    dbConvert.log.verbose('Adapter `%s` and `%s` loaded successfully.',
      dbConvert.config.fromHost.adapter,
      dbConvert.config.toHost.adapter);
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
