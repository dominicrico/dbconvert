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
          reporter: 'spec',
          require: ['test/helpers/chai.js', 'coverage/blanket']
        },
        src: ['test/**/*.spec.js']
      }
    },

    mocha_istanbul: {
      coveralls: {
        src: 'test', // multiple folders also works
        options: {
          require: ['test/helpers/chai.js', 'coverage/blanket'],
          coverage: true,
          check: {
            lines: 50,
            statements: 50
          },
          root: './lib',
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'mochaTest', 'mocha_istanbul']);
};
