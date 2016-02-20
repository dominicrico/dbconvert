'use strict';

var dbConvert = require('../lib');


describe('DBConvert start up', function() {

  it('should load the configuration', function(done) {
    dbConvert.load(function() {
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

});
