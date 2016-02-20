module.exports = function(grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      all: ['bin/*.js', 'lib/**/*.js']
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'mocha-lcov-reporter',
          require: ['test/helpers/chai.js', 'coverage/blanket']
        },
        src: ['test/**/*.spec.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage/coverage.lcov'
        },
        src: ['test/**/*.js']
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'mochaTest']);
};
