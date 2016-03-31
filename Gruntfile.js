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

    exec: {
      loadFixtures: 'node ./test/helpers/loadFixtures.js'
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
            branches: 50,
            lines: 50,
            statements: 50,
            functions: 50
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

  grunt.registerTask('test', ['eslint', 'jshint', 'exec', 'mochaTest']);

  grunt.registerTask('build', ['default']);

};
