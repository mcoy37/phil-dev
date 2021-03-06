/*! =========================================================================
 * Grunt Tasks for AngularJS web apps v0.1.0
 * Copyright 2014 (c) Pongstr Ordillo. MIT License.
 * ========================================================================= */

module.exports = function(grunt) {

  // Project Configuration

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    site: {
      app:  'app',
      bower: 'bower_components',
      dist_dir: 'dist',
      src: 'src'
    },
    banner: '/*! ========================================================================\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> \n' +
            ' * =========================================================================\n' +
            ' * <%= pkg.description %> \n'+
            ' * Authored by <%= pkg.author %> [<%= pkg.email %>] \n' +
            ' * ========================================================================= */\n',

    // Copy assets that don't need processing
    // ======================================
    copy: {
      fonts: {
        files: [
          { // Bootstrap Glyphicons
            expand: true,
            flatten: true,
            src: ['<%= site.bower %>/bootstrap/dist/fonts/*'],
            dest: '<%= site.app %>/assets/fonts/bootstrap/',
            filter: 'isFile'
          },
          { // Font-Awesome Glyphs
            expand: true,
            flatten: true,
            src: ['<%= site.bower %>/font-awesome/fonts/*'],
            dest: '<%= site.app %>/assets/fonts/font-awesome/',
            filter: 'isFile'
          }
        ]
      },

      javascript: {
        files: [
          { // Copy jQuery library
            expand: true,
            flatten: true,
            src: [
              '<%= site.bower %>/jquery/dist/jquery.js',
              '<%= site.bower %>/jquery/dist/jquery.min.js',
              '<%= site.bower %>/jquery/dist/jquery.min.map'
            ],
            dest: '<%= site.app %>/assets/js/lib/jquery/',
            filter: 'isFile'
          },
          { // Copy Bootstrap
            expand: true,
            flatten: true,
            src: ['<%= site.bower %>/bootstrap/dist/js/*'],
            dest: '<%= site.app %>/assets/js/lib/bootstrap/',
            filter: 'isFile'
          }
        ]
      },

      lessfiles: {
        files: [
          { // Copy Bootstrap Less files
            expand: true,
            cwd: '<%= site.bower %>/bootstrap/less/',
            src: ['**'],
            dest: '<%= site.src %>/less/bootstrap',
            filter: 'isFile'
          },
          { // Font-awesome less stylesheets
            expand: true,
            flatten: true,
            src: ['<%= site.bower %>/font-awesome/less/*'],
            dest: '<%= site.src %>/less/font-awesome',
            filter: 'isFile'
          }
        ]
      }
    },

    // Compile Less stylesheets
    // =====================================
    less: {
      development: {
        options: {
          strictMath: true,
          sourceMap: false
        },
        files: {
          '<%= site.app %>/assets/css/<%= pkg.name %>.css' : '<%= site.src %>/less/bootstrap.less',
          '<%= site.app %>/assets/css/font-awesome.css': '<%= site.src %>/less/font-awesome/font-awesome.less'
        }
      },
      production: {
        options: {
          strictMath: true,
          sourceMap: false,
          compress: true
        },
        files: {
          '<%= site.app %>/assets/css/<%= pkg.name %>.min.css' : '<%= site.src %>/less/bootstrap.less',
          '<%= site.app %>/assets/css/font-awesome.min.css': '<%= site.src %>/less/font-awesome/font-awesome.less'
        }
      }
    },

    // Compass
    compass: {
      dist: {
        options: {
          sassDir: '<%= site.src %>/scss',
          cssDir: '<%= site.app %>/assets/css',
          environment: 'production'
        }
      },
      dev: {
        options: {
          sassDir: '<%= site.src %>/scss',
          cssDir: '<%= site.app %>/assets/css',
        }
      }
    },

    // Watch Tasks
    // =====================================
    watch: {
      less: {
        files: ['<%= site.src %>/less/**/*.less'],
        tasks: ['less:development']
      },
      jshint: {
        files: [
          '<%= site.app %>/assets/js/app/*.js'
        ],
        tasks: ['jshint:express', 'jshint:app']
      }
    },

    // Optimise Image Assets
    // =====================================
    imagemin: {
      dynamic: {
        options: {
          pngquant: true,
          optimizationLevel: 3
        },
        files:[
          {
            expand: true,
            src: ['*.{png,jpg,gif}'],
            cwd: '<%= site.src %>/img/',
            dest: '<%= site.app %>/assets/img/'
          }
        ]
      }
    },

    // Add Banners for Application Build info
    // ======================================
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: [
            'dist/css/**',
            'dist/js/**',
            'Gruntfile.js'
          ]
        }
      }
    },

    // Lint gruntfile and js apps
    jshint: {
      grunt: {
        src: ['Gruntfile.js']
      },
      app: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: [
          '<%= site.app %>/assets/js/app/app.js'
        ]
      }
    }

  });

  // These grunt plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');


  // Update Frontend Packages
  grunt.registerTask('updatepkg', ['copy']);

  // Less CSS Tasks
  grunt.registerTask('watchless', ['watch:less']);
  grunt.registerTask('buildless', ['less']);

  // Compass SCSS Tasls
  grunt.registerTask('buildsass', ['compass']);

  // Javascript Tasks
  grunt.registerTask('lintjs', ['jshint']);
  grunt.registerTask('watchjs', ['watch:jshint']);

  // Optimise and Build images for production
  grunt.registerTask('buildimg', ['imagemin']);

  // Default Task Less
  grunt.registerTask('default', ['less', 'imagemin', 'jshint']);

  // Default Task Compas
  // grunt.registerTask('default', ['compass', 'imagemin', 'jshint']);

};