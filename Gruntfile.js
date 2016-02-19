module.exports = function(grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      all: ['bin/*.js', 'lib/**/*.js', 'test/**/*.js']
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'coverage/blanket'
        },
        src: ['test/**/*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage/coverage.html'
        },
        src: ['test/**/*.js']
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'mochaTest']);
};
