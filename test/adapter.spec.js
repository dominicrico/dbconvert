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

  describe('throw exception on', function() {

  });

});
