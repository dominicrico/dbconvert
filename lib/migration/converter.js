'use strict';

/*eslint camelcase: 0*/

var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;
var converter;

module.exports = function(entry, map, cb) {
  var report = [],
    identifier = Object.keys(entry),
    convEntry = {};
  identifier.forEach(function(key) {
    map.fields.forEach(function(row) {
      if (row.hasOwnProperty(key)) {
        if (row.type && typeof converter[row.type] === 'function') {
          //convert to given type
          convEntry[row[key]] = converter[row.type](entry[key],
            report);
        } else if (row.convertFn) {
          //use the user specified convert function
          convEntry[row[key]] = converter.convertFn(row.convertFn,
            entry[key], report);
        } else {
          //if no type is present convert to string
          convEntry[row[key]] = converter.string(entry[key], report);
        }
      } else if (key.search(/(_id|id)\b/) !== -1) {
        // using string function here because of BSON Objects
        if (entry[key] instanceof ObjectID) {
          convEntry.id_old = entry[key].toString();
        } else {
          convEntry.id_old = entry[key];
        }
      }
    });
  });

  if (report && report.length < 1) {
    report = null;
  }

  return cb(report, convEntry);
};

converter = {
  string: function(data, report) {
    var converted;
    try {
      if (typeof data !== 'object') {
        converted = data.toString();
      } else {
        converted = JSON.stringify(data);
      }
    } catch (e) {
      report.push({
        entry: data,
        error: e.message
      });
      converted = data;
    } finally {
      return converted;
    }
  },
  integer: function(data, report) {
    var converted;
    try {
      converted = parseInt(data, 10);

      if (_.isNaN(converted)) {
        converted = data;
        report.push({
          entry: data,
          error: 'Convert to number result in NaN.'
        });
      }
    } catch (e) {
      report.push({
        entry: data,
        error: e.message
      });
      converted = data;
    } finally {
      return converted;
    }
  },
  timestamp: function(data, report) {
    var converted;
    try {
      converted = new Date(data).getTime();

      if (_.isNaN(converted) && data.toString().length === 13) {
        converted = data;
        report.push({
          entry: data,
          error: 'Convert to timestamp result in NaN.'
        });
      } else if (data.toString().length < 13 || converted.toString().length <
        13) {
        converted = (converted * Math.pow(10, (
          13 - converted.toString().length)));
      }

    } catch (e) {
      report.push({
        entry: data,
        error: e.message
      });
      converted = data;
    } finally {
      return new Date(converted);
    }
  },
  json: function(data, report) {
    var converted;
    try {
      converted = JSON.parse(JSON.stringify(data));
    } catch (e) {
      converted = data;
      report.push({
        entry: data,
        error: e.message
      });
    } finally {
      return converted;
    }
  },
  array: function(data, report) {
    var converted;
    try {
      converted = data.toString().replace(/\s/g, '').split(',').map(
        function(i) {
          var num = parseInt(i, 10);
          if (!_.isNaN(num)) {
            return num;
          }
          return i;
        });
    } catch (e) {
      report.push({
        entry: data,
        error: e.message
      });
      converted = data;
    } finally {
      return converted;
    }
  },
  objectId: function(data) {
    if (data instanceof ObjectID) {
      return data;
    }

  },
  boolean: function(data) {
    if (data === '1' || data === 1 || data === 'true' || data === true) {
      return true;
    }

    return false;
  },
  convertFn: function(fn, data, report) {
    var converted;
    try {
      converted = fn(data);
    } catch (e) {
      report.push({
        entry: data,
        error: e.message
      });
      converted = data;
    } finally {
      return converted;
    }
  }
};
