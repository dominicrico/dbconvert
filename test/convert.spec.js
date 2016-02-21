'use strict';

var dbConvert = require('../lib');
var config = require('./helpers/config.json');
var dbConv;


describe('DBConvert running convert', function() {

  before(function(done) {
    dbConv = new dbConvert.DBconvert();
    done();
  });

  it('should start the convert process', function(done) {
    dbConv.convert(config, function() {
      done();
    });
  });

});
