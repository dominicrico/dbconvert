'use strict';

var async = require('async');

module.exports = function(callback) {
  var dbConv = this;

  dbConv.log.info('Starting relation process...');

  async.eachSeries(dbConv.config.relation, function(relation, seriesCb) {
      if (dbConv.config.table && relation.table.split(':')[0] !== dbConv.config
        .table) {
        return seriesCb(null);
      }

      async.auto({
          init: function(cb) {
            var config, tables = relation.table.split(':');

            config = {
              tables: {
                tableFrom: tables[0],
                tableWith: tables[1]
              },
              fields: []
            };

            relation.fields.forEach(function(rel) {
              var fields = rel.split(':');
              config.fields.push({
                fieldFrom: fields[0],
                fieldWith: fields[1]
              });
            });

            cb(null, config);
          },
          relation: ['init', function(cb, config) {
            dbConv.log.verbose('Relating table `%s` with `%s`...',
              config.init.tables.tableFrom, config.init.tables.tableWith
            );

            dbConv.relater(config.init, cb);
          }]
        },
        function(err) {
          seriesCb(err);
        });
    },
    function(err) {
      dbConv.log.info('Relation process successfully completed.');
      return callback(err);
    });
};
