#!/usr/bin/env node

'use strict';

module.exports = function(args) {
  var dbc = require('../lib/db-convert');

  dbc = new dbc();

  dbc.initialize(args);
};
