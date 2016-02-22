'use strict';

var dbConvert = require('../lib');
var should = require('./helpers/chai').should;
var config, dbConv;

if (!process.env.TRAVIS_CI) {
  config = require('./helpers/config-local.json');
} else {
  config = require('./helpers/config.json');
}

config._ = [];

describe('DBConvert', function() {

  describe('build in adapter', function() {

    before(function(done) {
      this.timeout(500);
      dbConv = new dbConvert.DBconvert();
      setTimeout(function() {
        config._ = [];
        done();
      }, 400);
    });

    after(function(done) {
      dbConv = undefined;
      done();
    });

    it('should do ...', function(done) {

      //TODO write tests fpr build in adapters

      done();
    });
  });

});
