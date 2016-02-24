'use strict';

var dbConvert = require('../lib');
var should = require('./helpers/chai').should;
var config, configMysql, dbConv;

if (!process.env.TRAVIS_CI) {
  config = require('./helpers/config-local.json');
  configMysql = require('./helpers/config-mysql.json');
} else {
  config = require('./helpers/config-mongo.json');
  configMysql = require('./helpers/config-mysql.json');
}

if (config._) {
  config._ = ['rel']
};
if (configMysql._) {
  configMysql._['rel']
};

describe('DBConvert', function() {

  describe('using mongo adapter', function() {});

  describe('using mysql adapter', function() {});

  describe('relate only with config', function() {

    before(function(done) {
      this.timeout(500);
      dbConv = new dbConvert.DBconvert();
      setTimeout(function() {
        config._ = ['rel'];
        done();
      }, 400);
    });

    after(function(done) {
      dbConv = undefined;
      done();
    });

    it('should start the relation process', function(done) {
      dbConv.relate(config, function() {
        dbConv.should.be.an('object');
        dbConv.config.should.be.an('object');
        dbConv.config.should.be.defined;
        done();
      });
    });

  });

  describe('relate only without config', function() {

    before(function(done) {
      this.timeout(500);
      dbConv = new dbConvert.DBconvert();
      setTimeout(function() {
        done();
      }, 400);
    });

    after(function(done) {
      dbConv = undefined;
      done();
    });

    it('should throw an error', function(done) {
      var fn = function() {
        dbConv.relate();
      };

      fn.should.throw(Error,
        'Cannot read property \'_\' of undefined');
      done();
    });

  });

});
