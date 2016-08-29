'use strict';

/*eslint camelcase: 0*/

var async = require('async');
var _ = require('lodash');

module.exports = function(config, cb) {
  var dbConv = this,
    hosts = dbConv.connections,
    fields = config.fields,
    tables = config.tables;
  console.log(fields);
  //tasks;

  async.auto({
      from: function(callback) {
        var async_data = {
          fromRows: [],
          fromValues: []
        };
        hosts.toHost.useCollection(tables.tableFrom);
        hosts.toHost.findAll(function(data) {
          if (data && data.length > 0) {
            data.forEach(function(row) {
              fields.forEach(function(field) {
                if (row.hasOwnProperty(field.fieldFrom)) {
                  async_data.fromRows.push(row);
                  async_data.fromValues.push({
                    field: field.fieldWith,
                    search: row[field.fieldFrom],
                    replace: row[hosts.toHost.pk],
                    type: field.type
                  });
                }
              });
            });
          }

          callback(null, async_data);
        });
      },
      to: ['from', function(callback, async_data) {
        hosts.toHost.useCollection(tables.tableWith);
        var tasks = [],
          data = _.uniq(async_data.from.fromValues);
        if (data.length > 0) {
          dbConv.log.info(
            'Found %s entries in `%s` to relate. This may take a while...',
            data.length,
            tables.tableFrom
          );

          data.forEach(function(values) {
            var finder = {},
              update = {};

            if (!values.type || values.type === null) {
              finder[values.field] = values.search;
              update[values.field] = values.replace;
            } else if (values.type === 'array') {
              finder[values.field] = values.search;
              update[hosts.toHost.searchInArray(values.field)] =
                values.replace;
            }

            tasks.push({
              finder: finder,
              update: update
            });
          });

          if (tables.tableFrom === 'categoryentry') {
            console.log(tasks)
          }

          hosts.toHost.batchUpdate(tasks, callback);
        } else {
          dbConv.log.info('Nothing to relate from `%s` to `%s`.',
            tables.tableFrom, tables.tableWith);
          return callback(null);
        }
      }]
    },
    function() {
      cb(null);
    });
};
