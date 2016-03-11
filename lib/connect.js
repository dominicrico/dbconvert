'use strict';

/*eslint global-require: 0*/

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
    if (dbConvert.config && dbConvert.config.hasOwnProperty(key)) {
      config = dbConvert.config[key];
      dbConvert.connections[key] = loadAdapter(config, cb);
    } else {
      throw Error('No database connections configured!');
    }
  }, function(err) {
    if (err) {
      throw Error(err);
    }

    if (dbConvert.config._.indexOf('rb') < 0 && dbConvert.config._.indexOf(
        'rollback') < 0) {
      dbConvert.connections.toHost.useCollection(
        '_dbConvertRollback_');
      dbConvert.connections.toHost.drop();
    }

    dbConvert.log.verbose('Adapter `%s` and `%s` loaded successfully.',
      dbConvert.config.fromHost.adapter,
      dbConvert.config.toHost.adapter);

    callback(null);
  });

  function loadAdapter(config, cb) {
    var Adapter;

    dbConvert.log.silly('Loading adapter `%s`...', config.adapter);
    try {
      Adapter = require('./adapter/' + config.adapter);
    } catch (e) {
      try {
        Adapter = require(config.adapter);
      } catch (e) {
        dbConvert.log.error('No adapter found with name `' + config.adapter +
          '`!');
        dbConvert.down();
      }
    }

    return new Adapter(config, cb);
  }
};
