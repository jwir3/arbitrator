module.exports = function(grunt) {
  grunt.initConfig({
    secret: grunt.file.readJSON('secret.json'),
    pkg: grunt.file.readJSON("package.json"),

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
    environments: {
      alpha: {
        options: {
          host: '<%= secret.alpha.host %>',
          username: '<%= secret.alpha.username %>',
          privateKey: '<%= grunt.file.read(secret.alpha.path_to_private_key) %>',
          deploy_path: '<%= secret.alpha.deploy_path %>',
          local_path: 'dist',
          current_symlink: 'current',
          tag: '<%= pkg.version %>-ALPHA',
          debug: true,
          releases_to_keep: 3
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-rework');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-ssh-deploy');

  grunt.registerTask('default', ['clean', 'browserify', 'rework', 'copy']);
  grunt.registerTask('deployAlpha', ['default', 'ssh_deploy:alpha']);
}
