'use strict';

var dbConvert = require('../lib');
var config = require('./helpers/config.json');
config._ = ['rel'];
var dbConv;

describe('DBConvert', function() {

  beforeEach(function(done) {
    this.timeout(500);
    dbConv = new dbConvert.DBconvert();
    setTimeout(function() {
      done();
    }, 400);
  });

  describe('relate only', function() {

    it('should start the relation process', function(done) {
      dbConv.relate(config, function() {
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
        dbConv.relate();
      };

      global.expect(fn).to.throw(Error,
        'Cannot read property \'_\' of undefined');
      done();
    });

  });

});
