#!/usr/bin/env node

'use strict';

global.i = 0;
var _ = require('lodash');
var program = require('./commands');
var pkg = require('../package.json');
var NOOP = function() {};

process.argv = _.map(process.argv, function(arg) {
  return (arg === '-V') ? '-v' : arg;
});

program.unknownOption = NOOP;

program.version(pkg.version, '-v, --version');

program
  .command('convert')
  .alias('con')
  .option('--sync', 'Run migration in synchrone mode.')
  .option('--table [table]', 'Run migration for a single table.')
  .option('--drop', 'Drop mongodb collections if they exist.')
  .option('--quiet', 'No output except of errors.')
  .option('--log [level]', 'Define a log level [level].',
    'info, debug, verbose, silly')
  .option('--logPath [path]', 'Specify a log path (default: cwd).')
  .option('--fromHost [[user:password@]host:port]',
    'Run migration for a single table.')
  .option('--toHost [[user:password@]host:port]',
    'Run migration for a single table.')
  .option('--config [path]', 'path to your config.json')
  .option('--mapping [path]', 'path to your mapping.json')
  .option('--relation [path]', 'path to your relation.json')
  .usage('[options]')
  .description('Runs migration and relation builder with the given options')
  .action(function(options) {
    require('./convert')(options);
  });

program
  .command('migrate')
  .alias('mig')
  .option('--sync', 'Run migration in synchrone mode.')
  .option('--table [table]', 'Run migration for a single table.')
  .option('--drop', 'Drop mongodb collections if they exist.')
  .option('--quiet', 'No output except of errors.')
  .option('--log [level]', 'Define a log level [level].',
    'info, debug, verbose, silly')
  .option('--logPath [path]', 'Specify a log path (default: cwd).')
  .option('--fromHost [[user:password@]host:port]',
    'Run migration for a single table.')
  .option('--toHost [[user:password@]host:port]',
    'Run migration for a single table.')
  .option('--config [path]', 'path to your config.json')
  .usage('[options]')
  .description('Runs migration only with the given options, no relations!')
  .action(function(options) {
    require('./migrate')(options);
  });

program
  .command('relation')
  .alias('rel')
  .option('--sync', 'Run migration in synchrone mode.')
  .option('--table [table]', 'Run migration for a single table.')
  .option('--quiet', 'No output except of errors.')
  .option('--log [level]', 'Define a log level [level].',
    'info, debug, verbose, silly')
  .option('--logPath [path]', 'Specify a log path (default: cwd).')
  .option('--fromHost [[user:password@]host:port]',
    'Run migration for a single table.')
  .option('--toHost [[user:password@]host:port]',
    'Run migration for a single table.')
  .option('--config [path]', 'path to your config.json')
  .usage('[options]')
  .description(
    'Runs relation builder only with the given options, no migration!')
  .action(function(options) {
    require('./relation')(options);
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
