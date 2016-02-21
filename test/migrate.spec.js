'use strict';

var dbConvert = require('../lib');
var config = require('./helpers/config.json');
config._ = ['mig'];
var dbConv;



describe('DBConvert', function() {

  beforeEach(function(done) {
    this.timeout(500);
    dbConv = new dbConvert.DBconvert();
    setTimeout(function() {
      done();
    }, 400);
  });

  describe('migration only with config', function() {

    it('should start the migration process', function(done) {
      config.logPath = 'test.log';
      dbConv.migrate(config, function() {
        global.expect(dbConv).to.be.an('object');
        global.expect(dbConv.config).to.be.an('object');
        global.expect(dbConv.config).to.be.defined;
        done();
      });
    });

  });

  describe('migration only without config', function() {

    it('should throw an error', function(done) {
      var fn = function() {
        dbConv.migrate();
      };

      global.expect(fn).to.throw(Error,
        'Cannot read property \'_\' of undefined');
      done();
    });

  });

});
