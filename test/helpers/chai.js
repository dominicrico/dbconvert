var chai = require('chai');

chai.config.includeStack = true;

module.exports.expect = chai.expect;
module.exports.should = chai.should();
module.exports.AssertionError = chai.AssertionError;
module.exports.Assertion = chai.Assertion;
module.exports.assert = chai.assert;
