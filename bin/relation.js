#!/usr/bin/env node

module.exports = function(args) {
  var dbc = require('../lib/db-convert');

  dbc = new dbc();

  dbc.initialize(args);
};
