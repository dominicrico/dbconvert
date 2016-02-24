**Note: DB Convert is currently under development and not ready for productional use!**

# DB Convert

[![Coverage Status](https://coveralls.io/repos/github/dominicrico/db-convert/badge.svg?branch=master)](https://coveralls.io/github/dominicrico/db-convert?branch=master) [![Build Status](https://travis-ci.org/dominicrico/db-convert.svg?branch=master)](https://travis-ci.org/dominicrico/db-convert) [![Code Climate](https://codeclimate.com/github/dominicrico/db-convert/badges/gpa.svg)](https://codeclimate.com/github/dominicrico/db-convert) [![Dependency Status](https://david-dm.org/dominicrico/db-convert.svg)](https://david-dm.org/dominicrico/db-convert) [![devDependency
Status](https://david-dm.org/dominicrico/db-convert/dev-status.svg)](https://david-dm.org/dominicrico/db-convert#info=devDependencies)

DB Convert helps to transfer one database to a different type of database, for example a MySQL database to a MongoDB. DB Convert allows to run a full conversion with relation building or just the single steps. DB Convert also have a rollback functionality. Usable as command line tool or in your code.

Available via NPM
- `npm install -g dbconvert`

## Quick Example

Bash with DB Convert as global package
```
dbconvert con
```

In your projection
```
var DbConvert = require('dbconvert');
var config = {
  //your config goes here
}

var dbc = new DbConvert().load(config);
dbc.convert();
```

## Usage

To run DB Convert you need at least to configure the `toHost` and the `fromHost`. This can be done in a `config.json` in the directory you want to run DB Convert or you insert the path to the file in the `--config` argument. If you want to remap your tables/collections or columns/fields you need a `mapping.js` with all the mapping information. Examples of the files can be found in the [example folder](https://github.com/dominicrico/db-convert/tree/master/example).  

#### Convert
```
dbconvert con [options] || dbconvert convert [options]
```
`convert` options
```
-h, --help                                           output usage information
--sync                                               Run migration in synchrone mode.
--table [table]                                      Run migration for a single table.
--drop                                               Drop collections/tables if they exist on destination host.
--quiet                                              No output except of errors.
--log [level]                                        Define a log level [level].
--logPath [path]                                     Specify a log path (default: cwd).
--fromHost [[protocol://][user:password@]host:port]  Connection string for the host to migrate from.
--toHost [[protocol://][user:password@]host:port]    Connection string for the host to migrate to.
--config [path]                                      path to your config.json
--mapping [path]                                     path to your mapping.js
--relation [path]                                    path to your relation.js
```

#### Migrate
```
dbconvert mig [options] || dbconvert migrate [options]
```
`migrate` options
```
-h, --help                                           output usage information
--sync                                               Run migration in synchrone mode.
--table [table]                                      Run migration for a single table.
--drop                                               Drop collections/tables if they exist.
--quiet                                              No output except of errors.
--log [level]                                        Define a log level [level].
--logPath [path]                                     Specify a log path (default: cwd).
--fromHost [[protocol://][user:password@]host:port]  Connection string for the host to migrate from.
--toHost [[user:password@]host:port]                 Connection string for the host to migrate to.
--config [path]                                      path to your config.json
```

#### Relations
```
dbconvert rel [options] || dbconvert relation [options]
```
`relation` options
```
-h, --help                                         output usage information
--sync                                             Run migration in synchrone mode.
--table [table]                                    Run migration for a single table.
--quiet                                            No output except of errors.
--log [level]                                      Define a log level [level].
--logPath [path]                                   Specify a log path (default: cwd).
--toHost [[protocol://][user:password@]host:port]  Connection string for the host to migrate to.
--config [path]                                    path to your config.json
```

#### Rollback
```
dbconvert rb [options] || dbconvert rollback [options]
```
`rollback` options
```
-h, --help                                                    output usage information
--table [table]                                               Run migration for a single table.
--quiet                                                       No output except of errors.
--log [level]                                                 Define a log level [level].
--logPath [path]                                              Specify a log path (default: cwd).
--toHost [[protocol://][user:password@]host:port[/database]]  Connection string for the host to migrate to.
--config [path]                                               path to your config.json
```

To show the help text
```
dbconvert help
```

## License

MIT License Copyright © 2016 Dominic Rico-Gomez

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)
