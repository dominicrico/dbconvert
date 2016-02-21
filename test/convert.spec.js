'use strict';

var dbConvert = require('../lib');
var config = require('./helpers/config.json');
var dbConv;

describe('DBConvert', function() {

  beforeEach(function(done) {
    this.timeout(500);
    dbConv = new dbConvert.DBconvert();
    setTimeout(function() {
      done();
    }, 400);
  });

  describe('start convert with config', function() {

    it('should start', function(done) {
      dbConv.convert(config, function() {
        global.expect(dbConv).to.be.an('object');
        global.expect(dbConv.config).to.be.an('object');
        global.expect(dbConv.config).to.be.defined;
        done();
      });
    });

  });

  describe('start convert without config', function() {

    it('should throw an error', function(done) {
      var fn = function() {
        dbConv.connect();
      };

      global.expect(fn).to.throw(Error,
        'No database connections configured!');
      done();
    });

  });

});
