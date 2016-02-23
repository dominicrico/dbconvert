'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var loader = require('./load');

module.exports = function(configOverrides, dbConvert) {

  /**
   * Expose new instance of `Config`
   */

  return new Config();


  function Config() {

    this.load = loader(configOverrides, dbConvert);

    _.bindAll(this);

  }

};
