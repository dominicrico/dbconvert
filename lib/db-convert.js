'use strict';

var _ = require('lodash');
var winston = require('winston');
var dbConvertLoad = require('./load');

/**
 * Construct a db-convert instance.
 *
 * @constructor
 */

function DBconvert() {
  this.load = dbConvertLoad(this);

  this.log = winston;

  this.load = _.bind(this.load, this);
  this.convert = _.bind(this.convert, this);
  this.migrate = _.bind(this.migrate, this);
  this.relate = _.bind(this.relate, this);
  this.initialize = _.bind(this.initialize, this);
  this.connect = _.bind(this.connect, this);
}

/**
 * Public Methods
 *
 */

DBconvert.prototype.initialize = function(cb) {
  var dbConvert = this,
    listeners = {
      sigusr2: function() {
        process.kill(process.pid, 'SIGUSR2');
      },
      sigint: function() {
        dbConvert.down(process.exit);
      },
      sigterm: function() {
        dbConvert.down(process.exit);
      },
      exit: function() {
        if (!dbConvert._exiting) {
          dbConvert.down();
        }
      }
    };

  process.once('SIGUSR2', listeners.sigusr2);

  process.on('SIGINT', listeners.sigint);
  process.on('SIGTERM', listeners.sigterm);
  process.on('exit', listeners.exit);

  process.on('uncaughtException', function(err) {
    dbConvert.log.debug(err.stack);
    dbConvert.log.error(err.message);
    dbConvert.down();
  });

  dbConvert._processListeners = listeners;

  cb(null, dbConvert);
};

DBconvert.prototype.connect = require('./connect');

DBconvert.prototype.convert = require('./convert');

DBconvert.prototype.migrate = require('./migrate');

DBconvert.prototype.relate = require('./relate');

DBconvert.prototype.down = require('./down');

module.exports = DBconvert;
