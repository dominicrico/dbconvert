var loadAllGruntTasks = require('load-grunt-tasks');
var reporter = require('jshint-stylish');

module.exports = function(grunt) {

  'use strict';

  loadAllGruntTasks(grunt);

  grunt.initConfig({
    eslint: {
      options: {
        format: 'stylish'
      },
      all: {
        src: ['bin/*.js', 'lib/**/*.js']
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        reporter: reporter
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

    'mocha_istanbul': {
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
          root: './lib'
        }
      }
    }
  });

  grunt.loadNpmTasks('gruntify-eslint');

  grunt.registerTask('default', ['eslint', 'jshint', 'mochaTest',
    'mocha_istanbul'
  ]);

  grunt.registerTask('test', ['eslint', 'jshint', 'mochaTest']);

  grunt.registerTask('build', ['default']);

};
