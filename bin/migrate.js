#!/usr/bin/env node

module.exports = function(args) {
  var m2m = require('../lib/m2m.js');

  m2m = new m2m();

  m2m.initialize(args);
};
