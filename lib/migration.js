/*global chalk, mappings */

'use strict';

var workers = require('./workers');
var async = require('async');

function mainRunner(task, con, drop, worker, seriesCb) {
  var t1 = new Date().getTime(),
    count = 0;
  var i = task;

  if (mappings[worker] instanceof Array) {
    task = mappings[worker][task];
  }

  async.waterfall([
      function(next) {
        /* clean the collection if the drop argument is passed */

        if (drop) {
          global.log.verbose(chalk.white.bold(
            worker + ' ➜ Cleaning MongoDB collection ' + task.collection +
            ' ...\n'
          ));

          con.mongo.db.collection(task.collection).drop(function(err) {
            if (err) {
              global.log.warn(chalk.red.bold(worker + ' ✘ ' + err.message +
                '\n'));
            } else {
              global.log.verbose(chalk.green.bold(
                worker + '✔ MongoDB collection for ' + task.collection +
                ' dropped!\n'));
            }

            next(null);
          });
        } else {
          next(null);
        }
      },
      function(next) {

        global.log.verbose(chalk.white.bold(worker + ' ➜ Migrating ' +
          worker +
          ' (MySQL) to ' + task.collection + ' (MongoDB)...\n'));
        con.mysql.db().query('SELECT count( * ) as total FROM `' + worker +
          '`',
          function(err, rows) {
            var total = rows[0].total,
              maxCount = 10000;
            if (total > maxCount) {
              var queries = Math.ceil(total / maxCount),
                stmtRows = [];

              var countArr = Array.apply(null, Array(queries));
              countArr = countArr.map(function(x, i) {
                return i;
              });

              async.eachSeries(countArr, function(q, cb) {
                con.mysql.db().query('SELECT * FROM `' + worker +
                  '` LIMIT ' + (q + 1 * maxCount) + ' OFFSET ' + ((
                    q) * maxCount),
                  function(err,
                    rows) {
                    count += rows.length;
                    stmtRows = stmtRows.concat(rows);
                    global.log.verbose('Nr. ' + (q + 1) + ' of ' +
                      queries + ' splitted queries done...');
                    cb(err);
                  });
              }, function(err) {
                next(err, stmtRows);
              });
            } else {
              con.mysql.db().query('SELECT * FROM `' + worker + '`',
                function(err,
                  rows) {
                  count = rows.length;
                  next(err, rows);
                });
            }
          });
      },
      function(rows, next) {
        if (mappings[worker] instanceof Array) {
          workers[worker](rows, con, i, function(err, data) {
            next(err, data);
          });
        } else {
          workers[worker](rows, con, task, function(err, data) {
            next(err, data);
          });
        }

      },
      function(data, next) {
        global.log.verbose(chalk.blue.bold(worker +
          ' ➜ Saving data in MongoDB...')); // write text

        con.mongo.db.collection(task.collection)
          .insertMany(data, function(err) {
            next(err);
          });
      },
      function(next) {
        var t2 = new Date().getTime();

        global.log.info(chalk.green.bold(worker + ' ✔ Migrated ' + count +
          ' rows from ' + worker + ' (MySQL) to ' + task.collection +
          ' (MongoDB) successful in ' + (t2 - t1) / 1000 + 's!\n'));
        next(null);
      },
      function(next) {
        process.stdout.write(chalk.white.bold('\n'));
        if (seriesCb) {
          return seriesCb();
        } else {
          next(null);
        }
      }
    ],
    function(err) {
      if (err) {
        global.log.error(chalk.red.bold('✘ ' + err.toString() + '\n'));
      }
    });
}

module.exports = function(con, drop, worker, callback) {
  /* fetch data from the mysql table and
     send it to the worker to process the data */
  async.waterfall([
    function(cb) {
      if (mappings[worker] instanceof Array) {
        var i = 0;
        async.eachSeries(mappings[worker], function(task, seriesCb) {
          mainRunner(i, con, drop, worker, seriesCb);
          i++;
        }, function() {
          cb(null);
        });
      } else {
        async.eachSeries([1], function(task, seriesCb) {
          mainRunner(mappings[worker], con, drop, worker, seriesCb);
        }, function() {
          cb(null);
        });
      }

    }
  ], function() {
    callback(null);
  });
};
