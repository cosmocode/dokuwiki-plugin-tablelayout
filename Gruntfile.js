module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), // the package file to use

    qunit: {
      all: ['_jstest/*.html']
    },
    eslint: {
      all: ['script/*.js', '_jstest/*.js']
    },
    watch: {
        qunit: {
            files: ['<%= jshint.all %>', '_jstest/*.html'],
            tasks: ['qunit']
        },
        linting: {
            files: ['<%= eslint.all %>'],
            tasks: ['eslint']
        }
    }
});
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-qunit');
grunt.loadNpmTasks('grunt-eslint');
grunt.registerTask('default', ['eslint', 'qunit']);
};

