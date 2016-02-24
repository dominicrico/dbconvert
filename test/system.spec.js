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

describe('DBConvert system', function() {

  describe('using mongo adapter', function() {

    describe('normal startup', function() {
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

      it('should load the configuration', function(done) {
        dbConv.load(config, function() {
          dbConv.config.should.not.be.undefined;
          dbConv.config.should.be.an('object');
          done();
        });
      });

      it('should initialize listeners', function(done) {
        dbConv.initialize(function() {
          dbConv._processListeners.should.be.defined;
          dbConv._processListeners.should.be.an('object');
          var listeners = Object.keys(dbConv._processListeners)
            .length;
          listeners.should.equal(4);
          Object.keys(dbConv._processListeners).forEach(
            function(
              v) {
              dbConv._processListeners[v].should.be.a(
                'function');
            });
          done();
        });
      });

      it('should establish db connections', function(done) {
        dbConv.connect(function() {
          dbConv.connections.fromHost.useCollection('test');
          dbConv.connections.should.not.be.undefined;
          dbConv.connections.toHost.should.not.be.undefined;
          dbConv.connections.fromHost.should.not.be.undefined;
          dbConv.connections.fromHost.collection.should.not
            .be.undefined;
          dbConv.connections.fromHost.collection.should.be.an(
            'object');
          dbConv.connections.should.be.an('object');
          done();
        });
      });

      it('should shutdown db convert cleanly', function(done) {
        dbConv.down(function() {
          dbConv.connections.fromHost.should.have.property(
            'db').undefined;
          dbConv.connections.toHost.should.have.property(
            'db').undefined;
          dbConv.should.have.property('_processListeners').null;
          done();
        });
      });
    });

    describe('custom startup', function() {

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

      it('it should use custom log path', function(done) {
        config.logPath = './test.log';

        dbConv.load(config, function() {
          dbConv.config.should.not.be.undefined;
          dbConv.config.should.be.an('object');
          dbConv.config.should.have.property('logPath').defined;
          done();
        });
      });

    });

  });

  describe('using mysql adapter', function() {

    describe('normal startup', function() {
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

      it('should load the configuration', function(done) {
        dbConv.load(configMysql, function() {
          dbConv.config.should.not.be.undefined;
          dbConv.config.should.be.an('object');
          done();
        });
      });

      it('should initialize listeners', function(done) {
        dbConv.initialize(function() {
          dbConv._processListeners.should.be.defined;
          dbConv._processListeners.should.be.an('object');
          var listeners = Object.keys(dbConv._processListeners)
            .length;
          listeners.should.equal(4);
          Object.keys(dbConv._processListeners).forEach(
            function(
              v) {
              dbConv._processListeners[v].should.be.a(
                'function');
            });
          done();
        });
      });

      it('should establish db connections', function(done) {
        dbConv.connect(function() {
          dbConv.connections.fromHost.useCollection('test');
          dbConv.connections.should.not.be.undefined;
          dbConv.connections.toHost.should.not.be.undefined;
          dbConv.connections.fromHost.should.not.be.undefined;
          dbConv.connections.fromHost.collection.should.not
            .be.undefined;
          dbConv.connections.fromHost.collection.should.be.an(
            'object');
          dbConv.connections.should.be.an('object');
          done();
        });
      });

      it('should shutdown db convert cleanly', function(done) {
        dbConv.down(function() {
          dbConv.connections.fromHost.should.have.property(
            'db').undefined;
          dbConv.connections.toHost.should.have.property(
            'db').undefined;
          dbConv.should.have.property('_processListeners').null;
          done();
        });
      });
    });

    describe('custom startup', function() {

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

      it('it should use custom log path', function(done) {
        configMysql.logPath = './test.log';

        dbConv.load(configMysql, function() {
          dbConv.config.should.not.be.undefined;
          dbConv.config.should.be.an('object');
          dbConv.config.should.have.property('logPath').defined;
          done();
        });
      });

    });

  });

});
