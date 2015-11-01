module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['dist/'],
    browserify: {
      'dist/script/index.js': ['script/index.js']
    },
    rework: {
      'dist/style/arbitrator.css': ['style/arbitrator.css'],
      options: {
        vendors: ['-moz-', '-webkit-']
      }
    },
    copy: {
      images: {
        src: 'img/**',
        dest: 'dist/',
        expand: true
      },
      html: {
        src: '*.html',
        dest: 'dist/',
        expand: false
      }
    },
    scp: {

    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-rework');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['clean', 'browserify', 'rework', 'copy']);
}
