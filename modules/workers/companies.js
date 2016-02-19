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

        if (map.column_mapping[field] && map.column_mapping[field].indexOf(
            '&&') !== -1) {
          var mapArr = map.column_mapping[field].split('&&');

          mapArr.forEach(function(override, idx) {
            Object.defineProperty(row, override,
              Object.getOwnPropertyDescriptor(row, field));
          });

          delete row[field];
        } else {
          if (field === 'canlogin' || field === 'visible' || field ===
            'anbieterprofilplus' || field === 'newsletter') row[field] =
            (
              row[field] !== 0) ? true : false;

          if (field === 'profiletype') {
            if (row[field] === 'firma') row[field] = 'company';
            else if (row[field] === 'trainer') row[field] = 'trainer';
            else if (row[field] === 'oefi') row[field] = 'public';
          }

          if (field === 'salutation') row[field] = (row[field].toLowerCase() !==
            'herr') ? 'female' : 'male';

          if (field === 'contacts') {
            var values = row[field].split(' ');
            row[field] = [];
            if (values && values.length > 0) {
              values.forEach(function(v, i) {
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
