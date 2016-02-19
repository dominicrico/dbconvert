/*global chalk, mappings, __filename */
var path = require('path');
var table = path.basename(__filename, path.extname(__filename));

module.exports = function(rows, con, coll, cb) {
  'use strict';

  var i = 0,
    map = mappings[table];

  if (mappings[table] instanceof Array) {
    map = mappings[table][coll];
  }

  process.stdout.write(chalk.blue.bold('➜ Processing data...\n'));

  rows.forEach(function(row) {
    i++;
    var field, proc = Math.round((100 / rows.length) * i);

    for (field in row) {
      if (row.hasOwnProperty(field)) {

        /* CONVERT FIELD DATA HERE!

        EXAMPLE:
        if (field === 'date') row[field] = new Date(parseInt(row[field] + '000'));

        */

        if (field === 'id') {
          Object.defineProperty(row, 'mysql_id',
            Object.getOwnPropertyDescriptor(row, field));
        } else {
          /* If mysql column has same name as mongodb field do nothing */
          if (field === map.column_mapping[field]) {
            continue;
          }
          /* If mysql column is not used anymore drop it */
          else if (!map.column_mapping[field]) {
            delete row[field];
          }
          /* If mysql column has different name as mongodb field rename it */
          else if (field !== map.column_mapping[field]) {
            Object.defineProperty(row, map.column_mapping[field],
              Object.getOwnPropertyDescriptor(row, field));
            delete row[field];
          }
        }
      }
    }

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(chalk.blue.bold('➜ ' + proc + '% complete...'));
  });

  process.stdout.write('\n');
  cb(null, rows);
};
