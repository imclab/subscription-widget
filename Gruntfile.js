/*global module:false*/
module.exports = function(grunt) {
  var widgetId = grunt.option('widgetId') || 'abc123';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    meta: {
      version: '1.0.0'
    },
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          waterfall: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: [
          'src/js/async-include.js',
          'src/js/waterfall-subscription-widget.js',
          'src/js/waterfall-subscription-widget.scout.js'
        ]
      },
      test: {
        options: {
          globals: {
            define: true,
            require: true,

            console: true,

            mocha: true,
            before: true,
            beforeEach: true,
            after: true,
            afterEach: true,
            describe: true,
            it: true,
            expect: true,
            sinon: true,
            '$': true,
            Q: true
          }
        },
        src: 'test/spec/**/*.js'
      }
    },

    'render': {
      'snippet': {
        target: '<%= build.root %>/snippet.html',
        source: './src/snippet.template',
        url: {
          path: '//waterfallmobile.com/widget/{{ widgetId }}/',
          file: 'waterfall-subscription-widget.scout.js'
        },
        widgetIdToken: '{{ widgetId }}'
      },

      'snippet-test': {
        target: '<%= build.testRoot %>/snippet.html',
        source: '<%= render.snippet.source %>',
        url: {
          path: '',
          file: '<%= render.snippet.url.file %>'
        },
        widgetIdToken: '<%= render.snippet.widgetIdToken %>'
      },

      'submit/snippet-test': {
        target: '<%= build.testRoot %>/submit/snippet.html',
        source: '<%= render.snippet.source %>',
        url: {
          path: 'submit/',
          file: '<%= render.snippet.url.file %>'
        },
        widgetIdToken: '<%= render.snippet.widgetIdToken %>'
      },

      'scout': {
        target: '<%= build.root %>/waterfall-subscription-widget.scout.js',
        source: './src/js/async-include.js',
        url: {
          path: '//waterfallmobile.com/widget/',
          file: 'waterfall-subscription-widget.<%= meta.version %>.js'
        }
      },

      'scout-test': {
        target: '<%= build.testRoot %>/waterfall-subscription-widget.scout.js',
        source: '<%= render.scout.source %>',
        url: {
          path: '',
          file: '<%= render.scout.url.file %>'
        }
      },

      'scout-test-submit': {
        target: '<%= build.testRoot %>/submit/' +
          'waterfall-subscription-widget.scout.js',
        source: '<%= render.scout.source %>',
        url: {
          path: 'submit/',
          file: '<%= render.scout.url.file %>'
        }
      },

      'subscribe-frame': {
        target: '<%= build.root %>/subscribe-frame.html',
        source: './src/subscribe-frame.html'
      },

      'subscribe-frame-test': {
        target: '<%= build.testRoot %>/subscribe-frame.html',
        source: '<%= render["subscribe-frame"].source %>'
      },

      'subscribe-frame-test-submit': {
        target: '<%= build.testRoot %>/submit/subscribe-frame.html',
        source: '<%= build.testRoot %>/../subscribe-frame-submit.html'
      },

      'test/inject': {
        target: '<%= build.testRoot %>/test-inject.html',
        source: '<%= build.testRoot %>/../target.template.html',
        markup: {
          head: '',
          body: '' +
            '<%= grunt.file.read("test/assets/inject-markup.html") %>' +
            '<%= grunt.file.read("test/assets/snippet.html") %>'
        }
      },

      'test/validate': {
        target: '<%= build.testRoot %>/test-validate.html',
        source: '<%= build.testRoot %>/../target.template.html',
        markup: {
          head: '',
          body: '' +
            '<div class="waterfall-subscription-widget"></div>' + 
            '<%= grunt.file.read("test/assets/snippet.html") %>'
        }
      },

      'test/submit': {
        target: '<%= build.testRoot %>/test-submit.html',
        source: '<%= build.testRoot %>/../target.template.html',
        markup: {
          head: '',
          body: '' +
            '<div class="waterfall-subscription-widget" ' +
              'data-waterfall-widgetid=123 ' +
              'data-waterfall-subscribe-frame-url="submit/subscribe-frame.html"' +
              '>' +
            '</div>' +
            '<%= grunt.file.read("test/assets/submit/snippet.html") %>'
        }
      },

      'test/demo': {
        target: '<%= build.testRoot %>/demo.html',
        source: '<%= build.testRoot %>/../target.template.html',
        markup: {
          head: '',
          body: '' +
            '<div class="waterfall-subscription-widget"' +
              'data-waterfall-widgetid=' + widgetId +
              '>' +
            '</div>' +
            '<%= grunt.file.read("test/assets/snippet.html") %>'
        }
      }
    },

    requirejs: {
      'waterfall-subscription-widget.js': {
        options: {
          name: 'waterfall-subscription-widget',
          logLevel: 1,

          baseUrl: 'src/js',
          out: 'release/waterfall-subscription-widget.<%= meta.version %>.js',

          paths: {
            templates: '../../build/templates',
            css: '../../build/css',
            hogan: '../../lib/hogan.template'
          },

          almond: true,
          wrap: false,
          //generateSourceMaps: true,
          //preserveLicenseComments: false
          optimize: 'uglify2'
        }
      },
      'test/assets/waterfall-subscription-widget.js': {
        options: {
          name: 'waterfall-subscription-widget',
          logLevel: 1,

          baseUrl: 'src/js',
          out: '<%= build.testRoot %>/' +
            'waterfall-subscription-widget.<%= meta.version %>.js',

          paths: {
            templates: '../../build/test/templates',
            css: '../../build/css',
            hogan: '../../lib/hogan.template'
          },

          almond: true,
          wrap: true,
          //generateSourceMaps: true,
          //preserveLicenseComments: false
          optimize: 'uglify2'
        }
      },
      'test/assets/submit/waterfall-subscription-widget.js': {
        options: {
          name: 'waterfall-subscription-widget',
          logLevel: 1,

          baseUrl: 'src/js',
          out: '<%= build.testRoot %>/submit/' +
            'waterfall-subscription-widget.<%= meta.version %>.js',

          paths: {
            templates: '../../build/test-submit/templates',
            css: '../../build/css',
            hogan: '../../lib/hogan.template'
          },

          almond: true,
          wrap: true,
          //generateSourceMaps: true,
          //preserveLicenseComments: false
          optimize: 'uglify2'
        }
      }
    },

    less: {
      'subscription-widget.css': {
        options: {
          yuicompress: true
        },
        files: {
          'build/css/subscription-widget.css':
            'src/less/subscription-widget.less'
        }
      }
    },

    htmlmin: {
      'subscription-widget.template.html': {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          './build/templates/subscription-widget.template.html':
            '<%= build.scratchRoot %>/templates/' +
            'subscription-widget.template.dev.html'
        }
      },
      'test/subscription-widget.template.html': {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          './build/test/templates/subscription-widget.template.html':
            '<%= build.scratchRoot %>/test/templates/' +
            'subscription-widget.template.dev.html'
        }
      },
      'test-submit/subscription-widget.template.html': {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          './build/test-submit/templates/subscription-widget.template.html':
            '<%= build.scratchRoot %>/test-submit/templates/' +
            'subscription-widget.template.dev.html'
        }
      }
    },

    hogan: {
      widget: {
        template: 'src/widget.mustache',
        output: '<%= build.scratchRoot %>/templates/widget.js',
        binderName: 'amd'
      },
      'widget-test': {
        template: 'src/widget.mustache',
        output: '<%= build.scratchRoot %>/test/templates/widget.js',
        binderName: 'amd'
      },
      'widget-test-submit': {
        template: 'src/widget.mustache',
        output: '<%= build.scratchRoot %>/test-submit/templates/widget.js',
        binderName: 'amd'
      }
    },

    // FIXME: this doesn't really work. use constants defined above
    build: {
      root: './release',
      testRoot: './test/assets',
      scratchRoot: './build'
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-hogan');

  grunt.registerMultiTask('render', 'Render a static asset from a template.',
    function renderTask() {
      grunt.config.requires('meta.version');

      grunt.file.write(this.data.target,
        grunt.template.process(grunt.file.read(this.data.source), {
          data: grunt.util._.extend({
            version: grunt.config.get('meta.version')
          }, this.data)
        }));
    });

  grunt.registerTask('clean', function () {
    var buildDir = grunt.config.get('build.scratchRoot');
    if (grunt.file.exists(buildDir)) {
      grunt.file['delete'](buildDir);
    }
  });

  grunt.registerTask('build', [
    'clean',    // blow away build
    'less',     // compile less to css
    'render',   // render snippet and scout
    //'htmlmin',  // minify widget markup
    'hogan',    // compile widget template
    'requirejs' // build widget script
  ]);

  // Default task.
  grunt.registerTask('default', ['jshint', 'build']);
};
