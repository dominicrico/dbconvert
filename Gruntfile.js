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
        src: 'test',
        options: {
          require: ['test/helpers/chai.js', 'coverage/blanket'],
          quiet: true,
          check: {
            branches: 55,
            lines: 80,
            statements: 80,
            functions: 80
          },
          root: './lib',
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'mochaTest', 'mocha_istanbul']);

  grunt.registerTask('test', ['jshint', 'mochaTest']);

  grunt.registerTask('build', ['default']);

};
