/*global chalk */
var mysql = require('mysql');
var MongoClient = require('mongodb').MongoClient;
var configs = require('../../config/connections').connections;
var args = process.argv.slice(2);

module.exports = {

  mongo: {

    db: null,

    connect: function(cb) {
      'use strict';

      var self = this,
        url = 'mongodb://localhost:27017/sem-ng';

      if (configs['sem-ng-mongo']) {
        var conf = configs['sem-ng-mongo'];
        url = 'mongodb://' + conf.user + ':' + conf.password + '@' + conf.host +
          ':' +
          conf.port + '/' + conf.database;
      }

      if (args.indexOf('-mongo') !== -1 || args.indexOf('--mongo-host') !==
        -1) {
        url = (args.indexOf('-mongo') !== -1) ? args[args.indexOf(
            '-mongo') + 1] :
          args[args.indexOf('--mongo-host') + 1];
        url = 'mongodb://' + url;
      }

      // Connect using MongoClient
      return new MongoClient.connect(url, function(err, db) {
        if (err) {
          global.log.error(chalk.red.bold(
            '✘ Error connecting to host ' + url + '\n'));
          global.log.debug(err.stack + '\n');
          return cb(err);
        } else {
          self.db = db;
          return cb(null);
        }
      });
    },

    close: function(cb) {
      'use strict';

      this.db.close(function(err) {
        if (err) {
          global.log.error(err.message + '\n');
          global.log.debug(err.stack + '\n');
          return cb(err);
        } else if (cb) {
          return cb(null);
        }
      });
    }

  },

  mysql: {

    config: configs['sem-old-mysql'],

    db: function() {
      if (args.indexOf('-mysql') !== -1 || args.indexOf('--mysql-host') !==
        -1) {
        url = (args.indexOf('-mysql') !== -1) ? args[args.indexOf('-mysql') +
            1] :
          args[args.indexOf('--mysql-host') + 1];
        if (url.indexOf('@') !== -1) {
          var user = url.split('@')[0];
          var db = url.split('@')[1];
          this.config.user = user.split(':')[0];
          this.config.password = user.split(':')[1]
          this.config.host = db.split(':')[0];
          this.config.port = db.split(':')[1];
        } else {
          this.config.host = url.split(':')[0];
          this.config.port = url.split(':')[1];
        }

      }

      return mysql.createConnection(this.config);
    },

    connect: function(cb) {
      'use strict';

      var self = this;

      return this.db().connect(function(err) {
        if (err) {
          global.log.error('Connecting to database ' + self.config.database +
            ' on host ' + self.config.host + '!');
          global.log.debug(err.stack + '\n');
        } else {
          self.db().on('error', function(err) {
            global.log.error(err.message);
            global.log.debug(err.stack);
          });
          self.db().query('SET GLOBAL wait_timeout=86400', function(err,
            rows, fields) {
            self.db().query('RESET QUERY CACHE', function(err, rows,
              fields) {
              return cb(null);
            });
          });
        }
      });
    },

    close: function(cb) {
      'use strict';
      var self = this;

      this.db().query('SET GLOBAL wait_timeout=30', function(err, rows,
        fields) {
        if (err) {
          self.db().end(function() {
            self.db = undefined;
          });
          global.log.error(err.message + '\n');
          global.log.debug(err.stack + '\n');
          return cb(err);
        }
        self.db().end(function() {
          self.db().on('error', function() {});
          self.db = undefined;

        });
        return cb(null);
      });
    }

  }

};
