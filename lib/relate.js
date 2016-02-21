'use strict';

var async = require('async');
var _ = require('lodash');

module.exports = function(configOverride, callback) {
  var dbConvert = this;

  if (_.isFunction(configOverride)) {
    callback = configOverride;
    configOverride = {};
  }

  if ((configOverride._ && configOverride._.indexOf('mig') !== -1 ||
      dbConvert.config && dbConvert.config._ && dbConvert.config._.indexOf(
        'mig') !== -1)) {
    dbConvert.doRelate(callback);
  } else {
    async.series([
      function(cb) {
        dbConvert.load(configOverride, cb);
      },

      dbConvert.initialize,

      dbConvert.connect,

      dbConvert.doRelate,

    ], function dbConvertDone(err) {
      if (err) {
        dbConvert.error(err.message);
      }

      dbConvert.down(function() {
        callback(null);
      });
    });
  }
};


// var async = require('async');
//
// function relationRunner(relation, con, worker, seriesCb) {
//
//   async.waterfall([
//     function(waterCb) {
//       async.forEachOfSeries(relation, function(val, rel, forCb) {
//         if (val.split('&&') && val.split('&&').length > 1) {
//           var valArr = val.split('&&');
//           async.eachSeries(valArr, function(arrVal, arrCb) {
//             return relationBuilt(relation, con, worker, arrVal, rel,
//               arrCb);
//           }, function(err) {
//             return forCb(err);
//           });
//         } else {
//           return relationBuilt(relation, con, worker, val, rel, forCb);
//         }
//       }, function() {
//         waterCb(null);
//       });
//     }
//   ], function() {
//     return seriesCb(null);
//   });
// }
//
// function relationBuilt(relation, con, worker, val, rel, forCb) {
//   var t0 = new Date().getTime(),
//     // which key will be search
//     finder = rel.split('.')[1],
//     // which collection will be used
//     collection = rel.split('.')[0];
//
//   global.log.verbose(chalk.blue.bold('➜ Spread some ') + chalk.red
//     .bold('❤ love ❤') + chalk.blue.bold(' between collection ' +
//       collection + ' and ' + worker + '...\n'));
//
//   var i = 0,
//     docCount = 0,
//     docLength = 0,
//     waiting = setInterval(function() {
//       if (global.log.level === 'verbose') {
//         process.stdout.clearLine(); // clear current text
//         process.stdout.cursorTo(0); // move cursor to beginning of line
//         i = (i + 1) % 4;
//         var h = (i + 1) % 2;
//         global.log.verbose(((h === 0) ? chalk.red.bold('❤') :
//           ' ') + chalk.red.bold(' LoveMeter: ' + docCount +
//           ' relations established.'));
//       }
//     }, 300);
//
//   return con.mongo.db.collection(collection).find({}).toArray().then(
//     function(docs) {
//       docLength = docs.length;
//       return async.forEach(docs, function(doc, callback) {
//         var myFind = {},
//           myKey = relation[rel].toString(),
//           up = {},
//           myUpdate = {
//             $set: null
//           },
//           o = {
//             w: 1
//           },
//           a = ((myKey.indexOf('.') !== -1) ? myKey.split(
//             '.')[0] : myKey),
//           b = ((myKey.indexOf('.') !== -1) ? myKey.split(
//             '.')[0] + '$' : myKey);
//
//         myFind[a] = doc[finder];
//         up[b] = doc._id;
//         myUpdate.$set = up;
//         o.multi = true;
//         if (myKey.indexOf('.') !== -1) {
//           var relCollection = [collection, myKey.split('.')[
//             1], '', worker, myKey.split('.')[0]].join('_');
//
//           if (docCount === 0) {
//             con.mongo.db.collection(relCollection).drop();
//           }
//
//           con.mongo.db.collection(worker).find(myFind).toArray()
//             .then(function(arrDocs) {
//               async.forEach(arrDocs, function(arrDoc,
//                 arrCb) {
//                 var insert = {},
//                   a = (worker + '_' + myKey.split('.')[
//                     0]),
//                   b = (collection + '_' + myKey.split(
//                     '.')[1]);
//                 insert[a] = arrDoc._id;
//                 insert[b] = doc._id;
//                 con.mongo.db.collection(relCollection)
//                   .insertOne(insert).then(function() {
//                     docCount++;
//                     arrCb(null);
//                   });
//               }, function() {
//                 callback(null);
//               });
//             });
//         } else {
//           con.mongo.db.collection(worker).updateMany(myFind,
//             myUpdate, o).then(function() {
//             docCount++;
//             callback(null);
//           });
//         }
//       }, function() {
//         clearInterval(waiting);
//         if (global.log.level === 'verbose') {
//           process.stdout.clearLine();
//           process.stdout.cursorTo(0);
//         }
//         var t1 = new Date().getTime();
//         global.log.info(chalk.green.bold(
//           '✔ Relations for ' + worker + ' to ' +
//           collection + ' built in ' + (t1 - t0) / 1000 +
//           's!\n\n'));
//         return forCb(null);
//       });
//     });
// }
//
// module.exports = function(con, worker, callback) {
//   var relationOnly = (con === null && worker === null) ? true : false;
//
//   function relateOnly(cb) {
//     var workers = Object.keys(mappings);
//
//     async.eachSeries(workers, function(worker, outerCb) {
//       if (mappings[worker] instanceof Array) {
//         global.log.info(chalk.white.bold('➜ Processing table ' +
//           worker + '...\n'));
//         async.eachSeries(mappings[worker], function(task, seriesCb) {
//           global.log.info(chalk.white.bold(
//             '➜ Building relations for ' + task.collection +
//             '...\n'));
//           if (task.relation_mapping) {
//             relationRunner(task.relation_mapping, con, task.collection,
//               seriesCb);
//           } else {
//             seriesCb(null);
//           }
//         }, function() {
//           outerCb(null);
//         });
//       } else {
//         if (mappings[worker].relation_mapping) {
//           global.log.info(chalk.white.bold('➜ Processing table ' +
//             worker + '...\n'));
//           async.eachSeries([mappings[worker]], function(task, seriesCb) {
//             global.log.info(chalk.blue.bold(
//               '➜ Building realtions for ' + mappings[worker].collection +
//               '...\n'));
//             relationRunner(mappings[worker].relation_mapping, con,
//               mappings[worker].collection, seriesCb);
//           }, function() {
//             outerCb(null);
//           });
//         } else {
//           outerCb(null);
//         }
//       }
//     }, function() {
//       cb(null);
//     });
//   }
//
//   function relate(cb) {
//     if (mappings[worker] instanceof Array) {
//       async.eachSeries(mappings[worker], function(task, seriesCb) {
//         global.log.info(chalk.blue.bold('➜ Building realtions for ' +
//           task.collection + '...\n'));
//         if (task.relation_mapping) {
//           relationRunner(task.relation_mapping, con, task.collection,
//             seriesCb);
//         } else {
//           seriesCb(null);
//         }
//       }, function() {
//         cb(null);
//       });
//     } else {
//       if (mappings[worker].relation_mapping) {
//         async.eachSeries([mappings[worker]], function(task, seriesCb) {
//           global.log.info(chalk.blue.bold(
//             '➜ Building realtions for ' + mappings[worker].collection +
//             '...\n'));
//           relationRunner(mappings[worker].relation_mapping, con, mappings[
//             worker].collection, seriesCb);
//         }, function() {
//           cb(null);
//         });
//       } else {
//         cb(null);
//       }
//     }
//   }
//
//   async.waterfall([
//     function(cb) {
//       if (con === null) {
//         con = require('./connection');
//         con.mongo.connect(cb);
//       } else {
//         cb(null);
//       }
//     },
//     function(cb) {
//       if (!relationOnly) {
//         relate(cb);
//       } else {
//         relateOnly(cb);
//       }
//     }
//   ], function() {
//     if (callback !== undefined) {
//       return callback(null);
//     } else {
//       cursor.show();
//       con.mongo.close();
//     }
//   });
// };
