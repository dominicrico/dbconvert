'use strict';

var dbConvert = require('../lib');
var should = require('./helpers/chai').should;
var config, dbConv;

if (!process.env.TRAVIS_CI) {
  config = require('./helpers/config-local.json');
} else {
  config = require('./helpers/config.json');
}

describe('DBConvert rollback', function() {

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

  it('should migrate new data', function(done) {
    dbConv.convert(config, function() {
      done();
    });
  });

  it('should do a rollback', function(done) {
    dbConv.rollback(config, function() {
      var host = dbConv.connections.toHost;
      host.connect(function() {
        host.useCollection('mongoTable1').count(function(err,
          count) {
          (err === null).should.be.true;
          count.should.equal(0);
          done();
        });
      });
    });
  });

});
