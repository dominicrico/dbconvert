/*global chalk, mappings, __filename */
var path = require('path');
var table = path.basename(__filename, path.extname(__filename));

module.exports = function (rows, con, coll, cb) {
  'use strict';

  var i = 0, map = mappings[table];

  if (mappings[table] instanceof Array) {
    map = mappings[table][coll];
  }

  process.stdout.write(chalk.blue.bold('➜ Processing data...\n'));

  rows.forEach(function (row) {
    i++;
    var field, proc = Math.round((100 / rows.length) * i);

    for (field in row) {
      if (row.hasOwnProperty(field)) {
        if (field === 'related_faqs') {
          var values = row[field].split(' ');
          row[field] = [];
          if (values && values.length > 0) {
            values.forEach(function(v,i){
              if (v !== '') row[field].push(parseInt(v));
            });
          }
        }

        if (field === map.column_mapping[field]) continue;
        else if (!map.column_mapping[field]) delete row[field];
        else if (field !== map.column_mapping[field]) {
          Object.defineProperty(row, map.column_mapping[field],
            Object.getOwnPropertyDescriptor(row, field));
          delete row[field];
        }
      }
    }

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    if (proc < 100) {
      process.stdout.write(chalk.blue.bold('➜ ' + proc + '% complete...'));
    } else {
      process.stdout.write(chalk.blue.bold('✔ ' + proc + '% complete!'));
    }
  });

  process.stdout.write('\n');
  cb(null, rows);
};
