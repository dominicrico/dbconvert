'use strict';

var dbConvert = require('../lib');
var config = require('./helpers/config.json');
config._ = ['mig'];
var dbConv;


describe('DBConvert running migrate', function() {

  before(function(done) {
    dbConv = new dbConvert.DBconvert();
    done();
  });

  it('should start the migration process', function(done) {
    dbConv.migrate(config, function() {
      done();
    });
  });

});
