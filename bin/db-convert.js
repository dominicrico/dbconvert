#!/usr/bin/env node

'use strict';

/* eslint global-require: 0 */

global.i = 0;
var _ = require('lodash');
var program = require('./commands');
var pkg = require('../package.json');
var NOOP = function() {};
var DBconvert = require('../lib');

process.argv = _.map(process.argv, function(arg) {
  return (arg === '-V') ? '-v' : arg;
});

program.unknownOption = NOOP;

program.version(pkg.version, '-v, --version');

program
  .command('convert')
  .alias('con')
  .option('--table [table]', 'Run conversion for a single table/collection.')
  .option('--drop',
    'Drop collections/tables if they exist on destination host.')
  .option('--silent', 'No output, except of errors.')
  .option('--log [level]', 'Define a log level [level].',
    'info, debug, verbose, silly')
  .option('--logPath [path]', 'Specify a log path (default: cwd).')
  .option('--fromHost [[protocol://][user:password@]host:port]',
    'Connection string for the host to convert from.')
  .option('--toHost [[protocol://][user:password@]host:port]',
    'Connection string for the host to convert to.')
  .option('--config [path]', 'path to your config.json')
  .option('--mapping [path]', 'path to your mapping.js')
  .option('--relation [path]', 'path to your relation.js')
  .usage('[options]')
  .description('Runs conversion with the given options')
  .action(function() {
    var config = require('./init')('Starting database convertion...');
    DBconvert.convert(config);
  });

program
  .command('migrate')
  .alias('mig')
  .option('--table [table]', 'Run migration for a single table/collection.')
  .option('--drop', 'Drop collections/tables if they exist on destination .')
  .option('--silent', 'No output, except of errors.')
  .option('--log [level]', 'Define a log level [level].',
    'info, debug, verbose, silly')
  .option('--logPath [path]', 'Specify a log path (default: cwd).')
  .option('--fromHost [[protocol://][user:password@]host:port]',
    'Connection string for the host to migrate from.')
  .option('--toHost [[user:password@]host:port]',
    'Connection string for the host to migrate to.')
  .option('--config [path]', 'path to your config.json')
  .usage('[options]')
  .description('Runs the migration with the given options, no relations!')
  .action(function() {
    var config = require('./init')('Starting database migration...');
    DBconvert.migrate(config);
  });

program
  .command('relation')
  .alias('rel')
  .option('--table [table]', 'Run relations for a single table/collection.')
  .option('--silent', 'No output, except of errors.')
  .option('--log [level]', 'Define a log level [level].',
    'info, debug, verbose, silly')
  .option('--logPath [path]', 'Specify a log path (default: cwd).')
  .option('--toHost [[protocol://][user:password@]host:port]',
    'Connection string for the host to migrate to.')
  .option('--config [path]', 'path to your config.json')
  .usage('[options]')
  .description(
    'Runs the relation builder with the given options, no migration!')
  .action(function() {
    var config = require('./init')(
      'Starting database relation building...');
    DBconvert.relate(config);
  });

program
  .command('rollback')
  .alias('rb')
  .option('--table [table]', 'Rollback for a single table/collection.')
  .option('--silent', 'No output, except of errors.')
  .option('--log [level]', 'Define a log level [level].',
    'info, debug, verbose, silly')
  .option('--logPath [path]', 'Specify a log path (default: cwd).')
  .option('--toHost [[protocol://][user:password@]host:port[/database]]',
    'Connection string for the rollback host.')
  .option('--config [path]', 'path to your config.json')
  .usage('[options]')
  .description('Rollback your last migration.')
  .action(function() {
    var config = require('./init')(
      'Starting rollback of last migration...');
    DBconvert.rollback(config);
  });

program
  .command('help')
  .description('Displays this help text')
  .action(program.usageMinusWildcard);

program
  .command('*')
  .action(program.usageMinusWildcard);

program.parse(process.argv);


var NO_COMMAND_SPECIFIED = program.args.length === 0;
if (NO_COMMAND_SPECIFIED) {
  program.usageMinusWildcard();
}
