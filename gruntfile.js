module.exports = function(grunt) {
  grunt.initConfig({
    secret: grunt.file.readJSON('secret.json'),
    pkg: grunt.file.readJSON("package.json"),

    clean: ['public', '.sass-cache'],
    browserify: {
      'public/script/index.js': ['build/script/index.js']
    },
    copy: {
      images: {
        src: 'images/**',
        dest: 'public/',
        expand: true
      },
      html: {
        src: 'html/**',
        dest: 'public/',
        expand: true
      },
      assets: {
        src: 'assets/**',
        dest: 'public/',
        expand: true
      },
      script: {
        src: 'script/**',
        dest: 'build/',
        expand: true,
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
          local_path: 'public',
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
    },

    includes: {
      files: {
        src: ['*.html'], // Source files
        dest: 'public', // Destination directory
        flatten: true,
        cwd: '.',
        options: {
          silent: true
        }
      }
    },

    replace: {
      alpha: {
        options: {
          patterns: [
            {
              match: 'googleClientId',
              replacement: '<%= secret.alpha.googleClientId %>'
            },
            {
              match: 'googleAPIKey',
              replacement: '<%= secret.alpha.googleAPIKey %>'
            }
          ]
        },

        files: [
          {
            expand: true,
            flatten: true,
            src: ['script/config.js'],
            dest: 'build/script/'
          }
        ]
      },

      release: {
        options: {
          patterns: [
            {
              match: 'googleClientId',
              replacement: '<%= secret.release.googleClientId %>'
            },
            {
              match: 'googleAPIKey',
              replacement: '<%= secret.release.googleAPIKey %>'
            }
          ]
        },

        files: [
          {
            expand: true,
            flatten: true,
            src: ['script/config.js'],
            dest: 'build/script/'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-rework');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-ssh-deploy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('default', ['clean', 'includes', 'copy']);
  grunt.registerTask('deployAlpha', ['default', 'replace:alpha', 'browserify', 'sass', 'ssh_deploy:alpha']);
  grunt.registerTask('deployRelease', ['default', 'replace:release', 'browserify', 'sass', 'ssh_deploy:release']);
}
