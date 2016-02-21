'use strict';

var dbConvert = require('../lib');
var config = require('./helpers/config.json');

describe('DBConvert start up', function() {

  it('should load the configuration', function(done) {
    dbConvert.load(config, function() {
      global.expect(dbConvert.config).to.not.be.undefined;
      global.expect(dbConvert.config).to.be.an('object');
      done();
    });
  });

  it('should initialize listeners', function(done) {
    dbConvert.initialize(function() {
      global.expect(dbConvert._processListeners).to.be.defined;
      global.expect(dbConvert._processListeners).to.be.an(
        'object');
      global.expect(Object.keys(dbConvert._processListeners).length)
        .to.be.equal(4);
      done();
    });
  });

  it('should establish db connections', function(done) {
    dbConvert.connect(function() {
      dbConvert.connections.fromHost.useCollection('test');
      global.expect(dbConvert.connections).to.not.be.undefined;
      global.expect(dbConvert.connections.toHost).to.not.be.undefined;
      global.expect(dbConvert.connections.fromHost).to.not.be.undefined;
      global.expect(dbConvert.connections.fromHost.collection).to.not
        .be.undefined;
      global.expect(dbConvert.connections.fromHost.collection).to.be
        .an('object');
      global.expect(dbConvert.connections).to.be.an('object');
      done();
    });
  });

  it('should shutdown db convert', function(done) {
    dbConvert.down(function() {
      global.expect(dbConvert.connections.fromHost.db)
        .to.be.undefined;
      global.expect(dbConvert._processListeners)
        .to.be.null;
      done();
    });
  });
});
