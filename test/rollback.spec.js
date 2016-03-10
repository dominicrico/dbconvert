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
  config._ = ['rb']
};
if (configMysql._) {
  configMysql._['rb']
};

describe('DBConvert', function() {

  describe('using mongo adapter', function() {

    describe('running rollback', function() {

      before(function(done) {
        this.timeout(500);
        dbConv = new dbConvert.DBconvert();
        setTimeout(function() {
          config._ = ['rb'];
          done();
        }, 400);
      });

      after(function(done) {
        dbConv = undefined;
        done();
      });

      it('should migrate new data', function(done) {
        this.timeout(5000);
        dbConv.convert(config, function() {
          done();
        });
      });

      it('should do a rollback', function(done) {
        this.timeout(10000);
        dbConv.rollback(config, function() {
          var host = dbConv.connections.toHost;
          host.connect(function() {
            host.useCollection('mongoTable1').count(
              function(err,
                count) {
                (err === null).should.be.true;
                count.should.equal(15);
                done();
              });
          });
        });
      });

    });

  });

  describe('using mysql adapter', function() {

    describe('running rollback', function() {

      before(function(done) {
        this.timeout(500);
        dbConv = new dbConvert.DBconvert();
        setTimeout(function() {
          configMysql._ = ['rb'];
          done();
        }, 400);
      });

      after(function(done) {
        dbConv = undefined;
        done();
      });

      it('should migrate new data', function(done) {
        this.timeout(5000);
        dbConv.convert(configMysql, function() {
          done();
        });
      });

      it('should do a rollback', function(done) {
        this.timeout(10000);
        dbConv.rollback(config, function() {
          var host = dbConv.connections.toHost;
          host.connect(function() {
            host.useCollection('mongoTable1').count(
              function(err,
                count) {
                (err === null).should.be.true;
                count.should.equal(15);
                done();
              });
          });
        });
      });

    });

  });

});
