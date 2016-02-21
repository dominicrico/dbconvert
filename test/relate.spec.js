'use strict';

var dbConvert = require('../lib');
var config = require('./helpers/config.json');
config._ = ['rel'];
var dbConv;


describe('DBConvert running relate', function() {

  before(function(done) {
    dbConv = new dbConvert.DBconvert();
    done();
  });

  it('should start the relation process', function(done) {
    dbConv.relate(config, function() {
      done();
    });
  });

});
