'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var async = require('async');
var winston = require('winston').cli();

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
            log: (overrides.quiet !== undefined) ? 'error' : overrides
              .log,

            // `--drop` command-line argument
            drop: overrides.drop,

            // `--table=?` command-line argument
            table: overrides.table,

            // `--sync` command-line argument
            sync: overrides.sync,

            // `--logPath` command-line argument
            logPath: (overrides.logPath) ? overrides.logPath : overrides
              .rootPath,

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
                  callback();
                } else {
                  callback();
                }
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
                    callback();
                  } else {
                    callback();
                  }
                }
              ]
            }, function(err, connections) {
              if (connections && connections.fromHost) {
                overrides.mapOverrides.fromHost = connections.fromHost;
              }
              if (connections && connections.toHost) {
                overrides.mapOverrides.toHost = connections.toHost;
              }

              return cb(null, overrides.mapOverrides);
            });
          }
        ],

        // Initialize dbConvert logger
        logger: ['connections',
          function(cb, overrides) {
            dbConvert.log = new winston.Logger({
              level: overrides.connections.log,
              transports: [
                new(winston.transports.File)({
                  levels: winston.config.npm.levels,
                  filename: overrides.connections.logPath +
                    '/db-convert.log'
                }),
                new(winston.transports.Console)({
                  colorize: true,

                  colors: {
                    error: 'red',
                    warn: 'yellow',
                    info: 'blue',
                    verbose: 'green',
                    debug: 'blue',
                    silly: 'magenta'
                  }
                })
              ],
            });

            cb(null, overrides.connections);
          }
        ],

        mappings: ['logger',
          function(cb, overrides) {
            require('./mappings')(overrides.logger, cb);
          }
        ],

        relations: ['mappings',
          function(cb, overrides) {

            require('./relations')(overrides.mappings, cb);
          }
        ],
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
    var auth, url, adapter, stringParts = (typeof hostString === 'string') ?
      hostString.split(/:\/\/|@/) : false;

    if (stringParts && stringParts.length > 2) {
      adapter = stringParts[0];
      auth = stringParts[1].split(':');
      url = stringParts[2].split(/:|\//);
    } else if (stringParts && stringParts.length === 2) {
      if (hostString.indexOf('://')) {
        adapter = 'adapter-' + stringParts[0];
      } else {
        auth = stringParts[0].split(':');
        adapter = guessAdapter(url[1]);
      }
      url = stringParts[1].split(/:|\//);
    } else if (stringParts && stringParts.length < 2) {
      url = stringParts[0].split(/:|\//);
      adapter = guessAdapter(url[1]);
    }

    var config = (stringParts) ? {
      user: (auth) ? auth[0] : undefined,
      password: (auth) ? auth[1] : undefined,
      host: url[0],
      port: url[1],
      database: url[2],
      adapter: adapter
    } : undefined;

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
      port)]);

    return adapterByPort[parseInt(port)];
  }
};
