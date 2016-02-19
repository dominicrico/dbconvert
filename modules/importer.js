/*global chalk, mappings */
var con = require('./connection');
var async = require('async');
var migrationRunner = require('./migrationRunner');
var relationBuilder = require('./relationBuilder');

module.exports = function(table, drop, runAsync) {
  'use strict';

  var t0 = null,
    wrks = Object.keys(mappings);

  /* async.waterfall makes async functions run synchrone */
  async.waterfall([
      function(cb) {
        /* establish mongo connection */
        con.mongo.connect(cb);
      },
      function(cb) {
        /* establish mysql connection */
        con.mysql.connect(cb);
      },
      function(cb) {
        if (!table) {

          global.log.info(chalk.white.bold(
            '➜ Starting migration for all tables...\n\n'));
          t0 = new Date().getTime();
          if (runAsync) {
            var wrkFncs = [];
            wrks.forEach(function(wrk) {
              var wrkTmp = function(callback) {
                global.log.info(chalk.white.bold(
                  wrk + ' ➜ Processing table ' +
                  wrk + '...\n'));
                /* Process the data and migrate it */
                migrationRunner(con, drop, wrk, callback);
              };
              wrkFncs.push(wrkTmp);
            });
            /* async.each makes async functions run synchrone */
            async.parallel(wrkFncs, function(err) {
              if (err) {
                global.log.error(chalk.red.bold('✘ ' + err.toString() +
                  '\n'));
              }
              cb(null);
            });
          } else {
            async.eachSeries(wrks, function(wrk, callback) {
              global.log.info(chalk.white.bold(wrk +
                ' ➜ Processing table ' +
                wrk + '...\n'));
              migrationRunner(con, drop, wrk, callback);
            }, function(err) {
              if (err) {
                global.log.error(chalk.red.bold('✘ ' + err.toString() +
                  '\n'));
              }
              cb(null);
            });
          }

        } else {

          global.log.info(chalk.white.bold(
            '➜ Starting migration for table ' + table + '...\n'));

          /* Process the data and migrate it */
          async.eachSeries([table], function(wrk, callback) {
            global.log.info(chalk.white.bold(
              '➜ Processing table ' +
              wrk + '...\n'));
            migrationRunner(con, drop, wrk, callback);
          }, function(err) {
            if (err) {
              global.log.error(chalk.red.bold('✘ ' + err.toString() +
                '\n'));
            }
            cb(null);
          });
        }
      },
      function(cb) {
        con.mysql.close(cb);
      },
      function(cb) {
        if (!table) {
          global.log.info(chalk.white.bold(
            '➜ Handling relations for all tables...\n\n'));

          if (runAsync) {
            var wrkFncs = [];
            wrks.forEach(function(wrk) {
              var wrkTmp = function(callback) {
                relationBuilder(con, wrk, callback);
              };
              wrkFncs.push(wrkTmp);
            });

            async.parallel(wrkFncs, function(err) {
              if (err) {
                global.log.error(chalk.red.bold('✘ ' + err.toString() +
                  '\n'));
              }
              cb(null);
            });
          } else {
            async.eachSeries(wrks, function(wrk, callback) {
              if (mappings[wrk].relation_mapping || mappings[wrk] instanceof Array) {
                global.log.info(chalk.white.bold(
                  '➜ Processing table ' + wrk + '...\n'));
                relationBuilder(con, wrk, callback);
              } else {
                callback(null);
              }
            }, function(err) {
              if (err) {
                global.log.error(chalk.red.bold('✘ ' + err.toString() +
                  '\n'));
              }
              cb(null);
            });
          }

        } else {

          process.stdout.write(chalk.white.bold(
            '➜ Handling relations for table ' + table + '...\n'));

          async.eachSeries([table], function(wrk, callback) {
            if (mappings[wrk].relation_mapping || mappings[wrk] instanceof Array) {
              process.stdout.write(chalk.white.bold(
                '➜ Processing table ' + wrk + '...\n'));
              relationBuilder(con, wrk, callback);
            } else {
              callback(null);
            }
          }, function(err) {
            if (err) {
              process.stdout.write(chalk.red.bold('✘ ' + err.toString() +
                '\n'));
            }
            cb(null);
          });
        }
      },
      function(cb) {
        con.mongo.close(cb);
      }
    ],
    function(err, done) {
      if (!table && !err) {
        var t3 = new Date().getTime();
        process.stdout.write(chalk.green.bold('✔ Migration done in ' + (
          t3 -
          t0) / 1000 + 's!\n'));
      }
      cursor.show();

      var util = require('util');
      var spawn = require('child_process').spawn;

      var ls = spawn("./bin/restart-elastic.sh");

      process.stdout.write(chalk.white.bold(
        '➜ Restarting ElasticSearch server...\n\n'));

      ls.stderr.on('data', function(data) {
        process.stdout.write(chalk.red.bold('=> ' + data + '\n'));
      });

      ls.on('close', function(code) {
        if (code === 0) {
          process.stdout.write(chalk.green.bold(
            '✔ ElasticSearch restart successful! \n'));
        } else {
          process.stdout.write(chalk.red.bold(
            '✘ Error on ElasticSearch restart! Code: ' + code +
            ' \n'));
        }
      });
    });
};
