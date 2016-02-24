'use strict';

/*eslint space-unary-ops: 0, global-require: 0 */

/**
 * Module dependencies.
 */

var _ = require('lodash');
var async = require('async');
var winston = require('winston').cli();
var Url = require('url');
var loadMappings = require('./mappings');
var loadRelations = require('./relations');

module.exports = function(dbConvert) {

  /**
   * Expose Configuration loader
   *
   * Load command-line overrides
   */

  return function loadConfig(cb) {

    dbConvert.log.verbose('Loading config...');

    async.auto({

        mapOverrides: function(cb) {
          var overrides = _.cloneDeep(dbConvert.config || {});

          if (overrides.config) {
            var configFile = require(process.cwd() + '/' + overrides.config);
            overrides = _.merge(configFile, overrides);
          }

          // Map dbConvert options from overrides
          overrides = _.merge(overrides, {
            // `--log-level=?` command-line argument
            log: (overrides.silent !== undefined && overrides.silent) ?
              'error' : overrides.log,

            // `--drop` command-line argument
            drop: overrides.drop,

            // `--table=?` command-line argument
            table: overrides.table,

            // `--sync` command-line argument
            sync: overrides.sync,

            // `--logPath` command-line argument
            logPath: (overrides.logPath) ? overrides.logPath : (
              overrides
              .rootPath) ? overrides.rootPath : './',

            fromHost: overrides.fromHost,

            toHost: overrides.toHost
          });

          cb(null, overrides);
        },

        connections: ['mapOverrides',
          function(cb, overrides) {
            async.auto({
              fromHost: function(callback) {
                if (typeof overrides.mapOverrides.fromHost !==
                  'object') {
                  return getDbConfig(
                    overrides.mapOverrides
                    .fromHost, callback);
                } else if (!overrides.mapOverrides
                  .fromHost.adapter) {
                  overrides.mapOverrides
                    .fromHost.adapter = guessAdapter(overrides.mapOverrides
                      .fromHost.port);
                }

                callback(null);
              },
              toHost: ['fromHost',
                function(callback) {
                  if (typeof overrides.mapOverrides.toHost !==
                    'object') {
                    return getDbConfig(
                      overrides.mapOverrides
                      .toHost, callback);
                  } else if (!overrides.mapOverrides
                    .toHost.adapter) {
                    overrides.mapOverrides
                      .toHost.adapter = guessAdapter(overrides.mapOverrides
                        .toHost.port);
                  }
                  callback(null);
                }
              ]
            }, function(err, connections) {
              if (connections && connections.fromHost) {
                overrides.mapOverrides.fromHost = connections.fromHost;
              }
              if (connections && connections.toHost) {
                overrides.mapOverrides.toHost = connections.toHost;
              }

              return cb(err, overrides.mapOverrides);
            });
          }
        ],

        // Initialize dbConvert logger
        logger: ['connections',
          function(cb, overrides) {
            dbConvert.log = new(winston.Logger)({
              level: overrides.connections.log
            });

            dbConvert.log.add(winston.transports.File, {
              colorize: true,
              timestamp: true,
              prettyPrint: true,
              level: 'silly',
              filename: overrides.connections.logPath +
                '/db-convert.log'
            });

            dbConvert.log.add(winston.transports.Console, {
              level: overrides.connections.log,
              colorize: true,
              prettyPrint: true,
              timestamp: false
            });

            dbConvert.log.cli();

            winston.setLevels(winston.config.npm.levels);
            winston.addColors({
              error: 'red',
              warn: 'yellow',
              info: 'blue',
              verbose: 'green',
              debug: 'blue',
              silly: 'magenta'
            });

            cb(null, overrides.connections);
          }
        ],

        mappings: ['logger',
          function(cb, overrides) {
            loadMappings(overrides.logger, cb);
          }
        ],

        relations: ['mappings',
          function(cb, overrides) {

            loadRelations(overrides.mappings, cb);
          }
        ]
      },

      function configLoaded(err, config) {
        if (err) {
          dbConvert.log.error('Error encountered loading config ::\n',
            err);
          return cb(err);
        }

        dbConvert.config = config.relations;
        dbConvert.log.verbose('Config loaded successfully.');

        cb(null);
      });
  };


  function getDbConfig(hostString, cb) {
    var config, parsed;

    if (hostString.indexOf('://') === -1) {
      hostString = 'none://' + hostString;
    }

    parsed = Url.parse(hostString);

    config = {
      user: (parsed.auth) ? parsed.auth.split(':')[0] : null,
      password: (parsed.auth) ? parsed.auth.split(':')[1] : null,
      host: parsed.hostname,
      port: parsed.port,
      database: parsed.path.replace('/', ''),
      adapter: (parsed.protocol && parsed.protocol.search(/http|none/) ===
          -1) ?
        'adapter-' + parsed.protocol.replace(':',
          '') : guessAdapter(
          parsed.port)
    };

    return cb(null, config);
  }

  function guessAdapter(port) {
    dbConvert.log.silly('No adapter in config, we have to guess one...');

    var adapterByPort = {
      27017: 'adapter-mongodb',
      3306: 'adapter-mysql',
      9200: 'adapter-elasticsearch',
      6379: 'adapter-redis',
      5984: 'adapter-couchdb',
      5432: 'adapter-postgres'
    };

    dbConvert.log.silly('Using %s for now...', adapterByPort[parseInt(
      port, 10)]);

    return adapterByPort[parseInt(port, 10)];
  }
};
