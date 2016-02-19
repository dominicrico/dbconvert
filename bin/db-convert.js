#!/usr/bin/env node

'use strict';

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
  .option('-s, --sync', 'Run migration in synchrone mode.')
  .option('-t, --table [table]', 'Run migration for a single table.')
  .option('-d, --drop', 'Drop mongodb collections if they exist.')
  .option('-r, --relation-only',
    'Build only relations between collections. (No migration!)')
  .option('-q, --quiet', 'No output except of errors.')
  .option('-l, --log-level [level]', 'Define a log level [level].',
    'info, debug, verbose, silly')
  .option('-L, --log-path [path]', 'Specify a log path (default: cwd).')
  .option('-mongo, --mongo-host [[user:password@]host:port]',
    'Run migration for a single table.')
  .option('-mysql, --mysql-host [[user:password@]host:port]',
    'Run migration for a single table.')
  .usage('[options]')
  .description('Runs migration and relation builder with the given options')
  .action(function(options) {
    require('./convert')(options);
  });

program
  .command('migrate')
  .alias('mig')
  .option('-s, --sync', 'Run migration in synchrone mode.')
  .option('-t, --table [table]', 'Run migration for a single table.')
  .option('-d, --drop', 'Drop mongodb collections if they exist.')
  .option('-q, --quiet', 'No output except of errors.')
  .option('-l, --log-level [level]', 'Define a log level [level].',
    'info, debug, verbose, silly')
  .option('-L, --log-path [path]', 'Specify a log path (default: cwd).')
  .option('-mongo, --mongo-host [[user:password@]host:port]',
    'Run migration for a single table.')
  .option('-mysql, --mysql-host [[user:password@]host:port]',
    'Run migration for a single table.')
  .usage('[options]')
  .description('Runs migration only with the given options, no relations!')
  .action(function(options) {
    require('./migrate')(options);
  });

program
  .command('relation')
  .alias('rel')
  .option('-s, --sync', 'Run migration in synchrone mode.')
  .option('-t, --table [table]', 'Run migration for a single table.')
  .option('-q, --quiet', 'No output except of errors.')
  .option('-l, --log-level [level]', 'Define a log level [level].',
    'info, debug, verbose, silly')
  .option('-L, --log-path [path]', 'Specify a log path (default: cwd).')
  .option('-mongo, --mongo-host [[user:password@]host:port]',
    'Run migration for a single table.')
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
