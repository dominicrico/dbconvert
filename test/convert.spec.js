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

describe('DBConvert', function() {

  describe('using mongo adapter', function() {

    describe('running `convert` with config', function() {

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

      it('should start converting', function(done) {
        dbConv.convert(config, function() {
          dbConv.should.be.an('object');
          dbConv.config.should.to.be.an('object');
          dbConv.config.should.be.defined;
          done();
        });
      });

    });

    describe('running `convert` without config', function() {

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
          dbConv.connect();
        };

        fn.should.throw(Error,
          'No database connections configured!');
        done();
      });

    });

  });

  describe('using mysql adapter', function() {

    describe('running `convert` with config', function() {

      before(function(done) {
        this.timeout(500);
        dbConv = new dbConvert.DBconvert();
        setTimeout(function() {
          configMysql._ = [];
          done();
        }, 400);
      });

      after(function(done) {
        dbConv = undefined;
        done();
      });

      it('should start converting', function(done) {
        dbConv.convert(configMysql, function() {
          dbConv.should.be.an('object');
          dbConv.config.should.to.be.an('object');
          dbConv.config.should.be.defined;
          done();
        });
      });

    });

    describe('running `convert` without config', function() {

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
          dbConv.connect();
        };

        fn.should.throw(Error,
          'No database connections configured!');
        done();
      });

    });

  });

});
