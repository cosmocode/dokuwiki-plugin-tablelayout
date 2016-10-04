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
                  initToolbar: false,
                  pickercounter: true,
                  createPicker: false,
                  pickerToggle: false
              },
              strict: true,
              undef: true,
              unused: true,
              plusplus: true,
              browser: true,
              devel: true,
              jquery: true,
              qunit: true
          },
	  all: ['script/*.js', '_jstest/*.js']
    },
    qunit: {
      all: ['_jstest/*.html']
    },
    watch: {
        jshint: {
            files: ['<%= jshint.all %>'],
            tasks: ['jshint']
        },
        qunit: {
            files: ['<%= jshint.all %>', '_jstest/*.html'],
            tasks: ['qunit']
        }
    }
});
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-qunit');
grunt.registerTask('default', ['jshint', 'qunit']);
};

