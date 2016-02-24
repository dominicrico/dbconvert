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
    fields = [],
    values = [],
    createStmt = createTable(this.config.mappings, this.collection, true),
    insertStmt;

  data.forEach(function(row) {
    fields = fields.concat(Object.keys(row));
  });

  fields = _.uniq(fields);

  data.forEach(function(row) {
    var rowVal = [];

    _.each(row, function(value) {
      if (typeof value === 'object') {
        value = JSON.stringifiy(value);
      }
      rowVal.push(value);
    });

    if (rowVal.length !== fields.length) {
      console.log(rowVal.length, fields.length);
      var count = fields.length - rowVal.length;
      console.log(count);
      _.times(count, rowVal.push(null));
    }

    values.push(rowVal);
  });

  insertStmt = util.format('INSERT INTO `%s` (%s) VALUES ?', this.collection,
    fields);

  console.log(self.db.format(insertStmt, [values]));

  this.db.query(createStmt, function(err1) {
    self.db.query(self.db.format(insertStmt, [values]), function(
      err, result) {
      console.log(err1, err);
      return (callback) ? callback(err, result) : true;
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
    //var res = [];

    if (err) {
      throw Error(err);
    }

    // data.forEach(function(row) {
    //   res.push(JSON.parse(JSON.stringify(row)));
    // });

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
  this.db.query(query, function(err, data) {

    if (err) {
      throw Error(err);
    } else {
      data.result.ok = true;
    }

    return (callback) ? callback(data) : true;
  });
};

function createTable(mapping, collection, ifNotExists) {
  var fields = [];

  if (mapping) {
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
  } else if (collection === '_dbConvertRollback_') {
    fields = ['ids varchar(255)',
      'date timestamp',
      'tablename varchar(255)'
    ];
  }

  fields.push('id int NOT NULL AUTO_INCREMENT PRIMARY KEY');

  ifNotExists = (ifNotExists) ? 'IF NOT EXISTS' : '';

  return util.format('CREATE TABLE %s `%s` (%s)', ifNotExists,
    collection,
    fields.join(', '));
}
