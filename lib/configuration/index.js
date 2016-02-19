'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');

module.exports = function(configOverrides, dbConvert) {

  /**
   * Expose new instance of `Config`
   */

  return new Config();


  function Config() {

    this.load = require('./load')(configOverrides, dbConvert);

    _.bindAll(this);

  }

};
