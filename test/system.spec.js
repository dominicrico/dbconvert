'use strict';

var dbConvert = require('../lib');
var config = require('./helpers/config.json');
var dbConv;

before(function(done) {
  dbConv = new dbConvert.DBconvert();
  done();
});

describe('DBConvert system', function() {

  it('should load the configuration', function(done) {
    dbConv.load(config, function() {
      global.expect(dbConv.config).to.not.be.undefined;
      global.expect(dbConv.config).to.be.an('object');
      done();
    });
  });

  it('should initialize listeners', function(done) {
    dbConv.initialize(function() {
      global.expect(dbConv._processListeners).to.be.defined;
      global.expect(dbConv._processListeners).to.be.an(
        'object');
      global.expect(Object.keys(dbConv._processListeners).length)
        .to.be.equal(4);
      done();
    });
  });

  it('should establish db connections', function(done) {
    dbConv.connect(function() {
      dbConv.connections.fromHost.useCollection('test');
      global.expect(dbConv.connections).to.not.be.undefined;
      global.expect(dbConv.connections.toHost).to.not.be.undefined;
      global.expect(dbConv.connections.fromHost).to.not.be.undefined;
      global.expect(dbConv.connections.fromHost.collection).to.not
        .be.undefined;
      global.expect(dbConv.connections.fromHost.collection).to.be
        .an('object');
      global.expect(dbConv.connections).to.be.an('object');
      done();
    });
  });

  it('should shutdown db convert cleanly', function(done) {
    dbConv.down(function() {
      global.expect(dbConv.connections.fromHost.db)
        .to.be.undefined;
      global.expect(dbConv._processListeners)
        .to.be.null;
      done();
    });
  });
});
