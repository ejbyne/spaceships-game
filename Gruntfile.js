module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // configure plugins
    jasmine_node: {
      options: {
        forceExit: true,
      },
      all: ['spec/']
      },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['**/*.js'],
      tasks: ['jshint']
    },
    mocha_casperjs: {
      options: {
      },
      files: {
        src: ['test/**/*']
      }
    }
  });

  // load plugins
  [
    'grunt-jasmine-node',
    'grunt-contrib-jshint',
    'grunt-contrib-watch',
    'grunt-mocha-casperjs'
  ].forEach(function(task) {
    grunt.loadNpmTasks(task);
  });

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['jasmine_node', 'jshint', 'mocha_casperjs']);

};