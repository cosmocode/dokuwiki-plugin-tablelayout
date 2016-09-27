module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), // the package file to use

    jshint: {
	  options: {
              curly: true,
              forin: true,
              freeze: true,
              globals: {
                  DOKU_BASE: false,
                  JSINFO: false,
                  LANG: false,
                  initToolbar: false
              },
              strict: true,
              undef: true,
              unused: true,
              plusplus: true,
              browser: true,
              devel: true,
              jquery: true,
          },
	  all: ['script.js']
    },
    watch: {
      files: ['script.js'],
      tasks: ['jshint']
    }
});
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.registerTask('default', ['jshint']);
};

