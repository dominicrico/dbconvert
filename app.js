// #!/usr/bin/env node
//
// /*jshint multistr:true*/
// (function() {
//   if (!module.parent) {
//     var args = process.argv.slice(2),
//       drop = false,
//       table = null,
//       runAsync = true,
//       logPath = process.cwd;
//
//     if (args.indexOf('-log') !== -1 || args.indexOf('--log-path') !== -1) {
//       logPath = (args.indexOf('-log') !== -1) ? args[args.indexOf(
//           '--log-path') + 1] :
//         args[args.indexOf('--log-path') + 1];
//     }
//
//     global.cursor = require('ansi')(process.stdout);
//     global.chalk = require('chalk');
//     global.mappings = require('./table_mapping');
//     winston = require('winston');
//     global.log = new(winston.Logger)({
//       transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({
//           filename: logPath + '/migration-' + new Date().toJSON().slice(
//               0, 10) +
//             '.log',
//           level: 'debug'
//         })
//       ],
//       exceptionHandlers: [
//         new winston.transports.File({
//           filename: logPath + '/migration-' + new Date().toJSON().slice(
//               0, 10) +
//             '.log'
//         })
//       ],
//       exitOnError: false
//     });
//
//     if (args.indexOf('-h') !== -1 || args.indexOf('--help') !== -1) {
//       process.stdout.write(
//         'Mysql-2-Mongo\n\n\
// Usage: m2m [options] \n\n\
// Options:\n\
//   -h, --help                                        show this text \n\
//   -s, --sync                                        disables asynchron migrates \n\
//   -t, --table [table]                               run the importer for a single table \n\
//   -d, --drop                                        drop old mongodb data and start from a clean database \n\
//   -r, --relation-only                               build relations only, could also used with \"-t\" to run for one table \n\
//   -e, --elastic-rebuild                             restarts ElasticSearch and recreates indexies, no migration will run! \n\
//   -q, --quiet                                       no log output except of errors \n\
//   -l, --level [level]                               define a log level (info, debug, verbose, silly) \n\
//   -log, --log-path [path]                           specify a log path \n\
//   -mongo, --mongo-host [[user:password]@host:port]  to connect to a specific mongo host. \n\
//   -mysql, --mysql-host [[user:password]@host:port]  to connect to a specific mongo host. \n\
// '
//       );
//
//       return false;
//     }
//
//     cursor.hide();
//
//     global.log.level = 'info';
//     global.log.exitOnError = false;
//
//     process.on('uncaughtException', function(err) {
//       global.log.debug(chalk.red(err.stack + '\n'));
//       global.log.error('\n' + chalk.red.bold('✘ Caught exception: ' +
//         err.message + '\n' + 'Check the logs for more information'));
//       cursor.show();
//       process.exit();
//     });
//
//     process.on('SIGINT', function() {
//       process.stdout.write('\n');
//       cursor.show();
//       process.exit();
//     });
//
//     if (args.indexOf('-t') !== -1 || args.indexOf('--table') !== -1) {
//       table = (args.indexOf('-t') !== -1) ? args[args.indexOf('-t') + 1] :
//         args[args.indexOf('--table') + 1];
//     }
//
//     if (args.indexOf('-d') !== -1 || args.indexOf('--drop') !== -1) {
//       drop = true;
//     }
//
//     if (args.indexOf('-l') !== -1 || args.indexOf('--level') !== -1) {
//       logLevel = (args.indexOf('-l') !== -1) ? args[args.indexOf('-l') + 1] :
//         args[args.indexOf('--level') + 1];
//       global.log.level = logLevel;
//     }
//
//     if (args.indexOf('-q') !== -1 || args.indexOf('--quiet') !== -1) {
//       global.log.level = 'error';
//     }
//
//     if (args.indexOf('-s') !== -1 || args.indexOf('--sync') !== -1) {
//       runAsync = false;
//     }
//
//     if (args.indexOf('-r') !== -1 || args.indexOf('--relation-only') !== -1) {
//
//       require('./modules/relationBuilder')(null, table);
//
//     } else {
//       require('./modules/importer')(table, drop, runAsync);
//     }
//   }
// })();

function m2m() {
  this.initialize = function(args) {
    console.log(args);
  };
}

module.exports = m2m;
