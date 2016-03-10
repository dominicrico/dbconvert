'use strict';

/**
 * Module dependencies.
 */

var mongo = require('mongodb').MongoClient;
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

  this.pk = config.pk || '_id';

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
  var self = this,
    hasAuth = false;

  mongo.connect(this.config.href, {
    'uri_decode_auth': hasAuth
  }, function(err, db) {
    self.db = db;
    self.collection = null;
    return (callback) ? callback(err) : true;
  });
};

MongoDB.prototype.close = function(callback) {
  var self = this;
  this.db.close(true, function(err) {
    self.db = undefined;
    self.collection = undefined;
    return (callback) ? callback(err) : true;
  });
};

MongoDB.prototype.useCollection = function(collection) {
  this.collection = this.db.collection(collection);
  return this.collection;
};

/**
 * Insert statement
 *
 * @api private
 */

MongoDB.prototype.insert = function(data, callback) {
  this.collection.insert(data, function(err, result) {
    return (callback) ? callback(err, result) : true;
  });
};

/**
 * Drop collection
 *
 * @api private
 */

MongoDB.prototype.drop = function(callback) {
  this.collection.drop(function(err) {
    return (callback) ? callback(err) : true;
  });
};

/**
 * Find all documents in a collection
 *
 * @api private
 */

MongoDB.prototype.findAll = function(callback) {
  this.collection.find({}).toArray().then(function(data) {
    return (callback) ? callback(data) : true;
  });
};

/**
 * Find one document in a collection by key = value
 *
 * @api private
 */

MongoDB.prototype.find = function(key, values, callback) {
  if (!(values instanceof Array) && typeof value === 'string') {
    values.split(/(?:\s+)?,(?:\s+)?/g);
  }

  var where = {};
  where[key] = {
    $in: values
  };

  this.collection.find(where).toArray().then(function(data) {
    return (callback) ? callback(data) : true;
  });
};

/**
 * Count all documents in a collection
 *
 * @api private
 */

MongoDB.prototype.count = function(callback) {
  this.collection.count().then(function(data) {
    return (callback) ? callback(data) : true;
  });
};

/**
 * Remove documents in a collection
 *
 * @api private
 */

MongoDB.prototype.delete = function(id, callback) {
  var del = {};
  del[this.pk] = id;
  this.collection.remove(del).then(function(data) {
    return (callback) ? callback(data) : true;
  });
};

/**
 * Update a document in a collection
 *
 * @api private
 */

MongoDB.prototype.update = function(finder, updateObj, callback) {
  this.collection.update(finder, {
    $set: updateObj
  }, {
    multi: true
  }).then(function(data) {
    return (callback) ? callback(data) : true;
  });
};

MongoDB.prototype.batchUpdate = function(stmts, callback) {
  var batch = this.collection.initializeUnorderedBulkOp();

  stmts.forEach(function(stmt) {
    batch.find(stmt.finder).update({
      $set: stmt.update
    });
  });

  batch.execute(function(err, result) {
    callback(err, result);
  });
};
