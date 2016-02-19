'use strict';

/**
 * Module dependencies.
 */

var mongo = require('mongodb').MongoClient;
var util = require('util');
var async = require('async');
var _ = require('lodash');

/**
 * Expose `Mongodb`.
 */

module.exports = MongoDB;

/**
 * Initialize a new MongoDB Adapter with the given `config`
 *
 * @param {Object} config
 * @api private
 */

function MongoDB(config, cb) {
  this.config = config;
  this.db = null;

  this.connect(cb);

  this.connect = _.bind(this.connect, this);
  this.insert = _.bind(this.insert, this);
  this.useCollection = _.bind(this.useCollection, this);
  this.drop = _.bind(this.drop, this);
  this.close = _.bind(this.close, this);
}

/**
 * Connect to the database.
 *
 * @api private
 */

MongoDB.prototype.connect = function(callback) {
  var connectionStr, self = this;
  if (this.config.user && this.config.password) {
    connectionStr = util.format('mongodb://%s:%s@%s:%d/%s',
      this.config.user,
      this.config.password,
      this.config.host,
      this.config.port,
      this.config.database);
  } else {
    connectionStr = util.format('mongodb://%s:%d/%s',
      this.config.host,
      this.config.port,
      this.config.database);
  }

  mongo.connect(connectionStr, function(err, db) {
    self.db = db;
    self.collection = null;
    callback(err);
  });
};

MongoDB.prototype.close = function(callback) {
  this.db.close(function(err) {
    callback(err);
  });
};

MongoDB.prototype.useCollection = function(collection) {
  this.collection = this.db.collection(collection);
};

/**
 * Insert statement
 *
 * @api private
 */

MongoDB.prototype.insert = function(data, callback) {
  this.collection.insert(data, callback);
};

/**
 * Remove a migration from the database
 * Called when a migration goes 'down'
 *
 * @api private
 */

MongoDB.prototype.drop = function(data, callback) {
  this.collection.drop(data, callback);
};
