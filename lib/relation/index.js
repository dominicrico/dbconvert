'use strict';

module.exports = function(callback) {
  var dbConv = this;

  dbConv.log.info('Starting relation process...');
  dbConv.log.info('Relation process successfully completed.');
  return callback(null);

};
