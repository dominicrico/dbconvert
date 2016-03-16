'use strict';

var url = require('url');
var MongoAdapter = require('../lib/adapter/adapter-mongodb');
var MysqlAdapter = require('../lib/adapter/adapter-mysql');
var mongoConfig = undefined;
var mysqlConfig = undefined;
if (!process.env.TRAVIS_CI) {
  mongoConfig = require('./config-local.json');
  mysqlConfig = require('./config-mysql.json');
} else {
  mongoConfig = require('./config-mongo.json');
  mysqlConfig = require('./config-mysql.json');
}

module.exports = {
  mongoClient: null,

  mysqlClient: null,

  init: function() {
    mongoConfig = url.parse(mongoConfig.toHost);
    mysqlConfig = url.parse(mysqlConfig.toHost);
    this.mongoClient = new MongoAdapter(mysqlConfig);
    this.mysqlClient = new MysqlAdapter(mysqlConfig);

    this.mongoClient.connect(function() {
      self.fixtures();
    });
    this.mysqlClient.connect(function() {
      self.fixtures();
    });
  },


  fixtures: function() {}
};
