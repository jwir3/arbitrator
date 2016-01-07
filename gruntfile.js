module.exports = function(grunt) {
  grunt.initConfig({
    secret: grunt.file.readJSON('secret.json'),
    pkg: grunt.file.readJSON("package.json"),

    clean: ['public', '.sass-cache'],
    browserify: {
      'public/script/index.js': ['script/index.js']
    },
    rework: {
      'public/style/arbitrator.css': ['style/arbitrator.css'],
      options: {
        vendors: ['-moz-', '-webkit-']
      }
    },
    copy: {
      images: {
        src: 'img/**',
        dest: 'public/',
        expand: true
      },
      html: {
        src: '*.html',
        dest: 'public/',
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
          local_path: 'public',
          current_symlink: 'current',
          tag: '<%= pkg.version %>-ALPHA',
          debug: true,
          releases_to_keep: 3
        }
      },

      release: {
        options: {
          host: '<%= secret.release.host %>',
          username: '<%= secret.release.username %>',
          privateKey: '<%= grunt.file.read(secret.release.path_to_private_key) %>',
          deploy_path: '<%= secret.release.deploy_path %>',
          local_path: 'dist',
          current_symlink: 'current',
          tag: '<%= pkg.version %>-BETA',
          debug: true,
          releases_to_keep: 3
        }
      }
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'style',
          src: ['*.scss'],
          dest: 'public/style',
          ext: '.css'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-rework');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-ssh-deploy');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['clean', 'browserify', 'rework', 'sass', 'copy']);
  grunt.registerTask('deployAlpha', ['default', 'ssh_deploy:alpha']);
  grunt.registerTask('deployRelease', ['default', 'ssh_deploy:release']);
}
