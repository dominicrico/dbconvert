'use strict';

/**
 * Module dependencies.
 */

var mysql = require('mysql');
var util = require('util');
var _ = require('lodash');
var async = require('async');

/**
 * Expose `MySql`.
 */

module.exports = MySql;

/**
 * Initialize a new MySql Adapter with the given `config`
 *
 * @param {Object} config
 * @api private
 */

function MySql(config, cb) {
  this.config = config;
  this.db = null;

  this.pk = config.pk || 'id';

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

MySql.prototype.connect = function(callback) {
  var connectionStr, self = this;

  if (this.config.user && this.config.password) {
    connectionStr = util.format('mysql://%s:%s@%s:%d/%s',
      this.config.user,
      this.config.password,
      this.config.host,
      this.config.port,
      this.config.database);
  } else {
    connectionStr = util.format('mysql://%s:%d/%s',
      this.config.host,
      this.config.port,
      this.config.database);
  }

  try {
    self.db = mysql.createConnection(connectionStr);
    self.db.connect();
    self.collection = null;
  } catch (e) {
    return (callback) ? callback(e) : true;
  } finally {
    return (callback) ? callback(null) : true;
  }
};

MySql.prototype.close = function(callback) {
  var self = this;
  this.db.end(function(err) {
    self.db = undefined;
    self.collection = undefined;
    return (callback) ? callback(err) : true;
  });
};

MySql.prototype.useCollection = function(collection) {
  this.collection = collection;
  return this.collection;
};

/**
 * Insert statement
 *
 * @api private
 */

MySql.prototype.insert = function(data, callback) {
  var self = this,
    stmts = [],
    createStmt = createTable(this.config.mappings, this.collection, true),
    insertStmt = util.format('INSERT INTO `%s` SET ?', this.collection);

  if (!data.length) {
    data = [data];
  }

  _.each(data, function(row) {
    _.each(row, function(val, key) {
      if (_.isPlainObject(val)) {
        row[key] = JSON.stringify(val);
      } else if (_.isArray(val)) {
        row[key] = val.join(',');
      }
    });

    stmts.push(function(cb) {
      self.db.query(insertStmt, row, function(err,
        res) {
        cb(err, res);
      });
    });

  });

  this.db.query(createStmt, function() {
    async.parallel(stmts, function(err, result) {
      var res = {
        insertedIds: [],
        ok: 1
      };

      _.each(result, function(val) {
        res.insertedIds.push(val.insertId);
      });

      if (err) {
        res.ok = 0;
      }

      callback(err, res);
    });
  });
};

/**
 * Drop collection
 *
 * @api private
 */

MySql.prototype.drop = function(callback) {
  var query = util.format('DROP TABLE `%s`', this.collection);

  this.db.query(query, function(
    err, data) {
    if (err) {
      //surprese this err...
      err = null;
    }
    return (callback) ? callback(data) : true;
  });
};

/**
 * Find all documents in a collection
 *
 * @api private
 */

MySql.prototype.findAll = function(callback) {
  var query = util.format('SELECT * FROM `%s`', this.collection);

  this.db.query(query, function(err, data) {

    if (err) {
      throw Error(err);
    }

    return (callback) ? callback(data) : true;
  });
};

/**
 * Count all documents in a collection
 *
 * @api private
 */

MySql.prototype.count = function(callback) {
  var query = util.format('SELECT COUNT(*) FROM `%s`', this.collection);

  this.db.query(query, function(err, data) {
    if (err) {
      throw Error(err);
    }
    return (callback) ? callback(data) : true;
  });
};

/**
 * Remove documents in a collection
 *
 * @api private
 */

MySql.prototype.delete = function(id, callback) {
  var query = util.format('DELETE FROM `%s` WHERE %s = %s', this.collection,
    this.pk, id);

  this.db.query(query, function(err) {
    var result = {
      result: {}
    };

    if (err) {
      throw Error(err);
    } else {
      result.result.ok = true;
    }

    return (callback) ? callback(result) : true;
  });
};

function createTable(mapping, collection, ifNotExists) {
  var fields = [];

  if (collection !== '_dbConvertRollback_') {
    mapping.forEach(function(table) {
      if (table.table.split(':')[1] === collection) {
        fields.push('id_old varchar(255)');
        table.fields.forEach(function(field) {
          var name = Object.keys(field)[0];
          switch (field.type) {
            case 'string':
            case 'array':
            case 'json':
              fields.push(field[name] + ' varchar(255)');
              break;
            case 'integer':
              fields.push(field[name] + ' int');
              break;
            case 'timestamp':
              fields.push(field[name] + ' timestamp');
              break;
            default:
              fields.push(field[name] + ' varchar(255)');
          }
        });
      }
    });
  } else {
    fields = ['ids varchar(255)',
      'createdAt timestamp',
      'tablename varchar(255)'
    ];
  }

  fields.push('id int NOT NULL AUTO_INCREMENT PRIMARY KEY');

  ifNotExists = (ifNotExists) ? 'IF NOT EXISTS' : '';

  return util.format('CREATE TABLE %s `%s` (%s)', ifNotExists,
    collection,
    fields.join(', '));
}
