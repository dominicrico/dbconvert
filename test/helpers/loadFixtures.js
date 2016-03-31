'use strict';

var url = require('url');
var async = require('async');

var fixturesJSON = require('./fixtures.json');
var mappings = require('./mapping.js');

var MongoAdapter = require('../../lib/adapter/adapter-mongodb');
var MysqlAdapter = require('../../lib/adapter/adapter-mysql');
var mongoConfig = undefined;
var mysqlConfig = undefined;
if (!process.env.TRAVIS_CI) {
  mongoConfig = require('./config-local.json');
  mysqlConfig = require('./config-mysql.json');
} else {
  mongoConfig = require('./config-mongo.json');
  mysqlConfig = require('./config-mysql.json');
}

var fixtures = {
  hosts: [],

  init: function() {
    console.log('Loading fixtures...');
    mongoConfig = url.parse(mongoConfig.toHost);
    mysqlConfig = url.parse(mysqlConfig.toHost);
    this.hosts.push(new MysqlAdapter(mysqlConfig));
    this.hosts.push(new MongoAdapter(mongoConfig));

    this.fixtures();
  },


  fixtures: function() {
    async.eachSeries(this.hosts, function(host, cbOut) {
      host.connect(function() {
        var collections = Object.keys(fixturesJSON);
        async.eachSeries(collections, function(col, cb) {
          console.log('Loading fixtures for %s on %s', col,
            host.config.protocol.replace(':', ''));
          host.useCollection(col);
          host.drop(function() {
            if (host.config.protocol === 'mysql:') {
              host.db.query(host.createTable(mappings, col,
                  true, true),
                function() {
                  host.insert(fixturesJSON[col], function(
                    err) {
                    console.log(
                      'Loading fixtures for %s on %s done!',
                      col, host.config.protocol.replace(
                        ':',
                        ''));
                    return cb(err);
                  });
                });
            } else {
              host.insert(fixturesJSON[col], function(err) {
                console.log(
                  'Loading fixtures for %s on %s done!',
                  col, host.config.protocol.replace(
                    ':',
                    ''));
                return cb(err);
              });
            }
          });
        }, function(err) {
          console.log('Done with %s!', host.config.protocol.replace(
            ':',
            ''));
          return cbOut(err);
        });
      });
    }, function(err) {
      if (err) {
        console.log(err);
      }

      console.log('Fixtures loaded!');
      process.exit(0);
    });
  }
};

fixtures.init();
