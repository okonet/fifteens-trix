"use strict"
lrSnippet = require("grunt-contrib-livereload/lib/utils").livereloadSnippet
mountFolder = (connect, dir) ->
  connect.static require("path").resolve(dir)

module.exports = (grunt) ->

  # load all grunt tasks
  require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks

  # configurable paths
  yeomanConfig =
    app: "app"
    dist: "dist"

  grunt.initConfig
    yeoman: yeomanConfig
    watch:
      coffee:
        files: ["<%= yeoman.app %>/scripts/**/*.coffee"]
        tasks: ["coffee:dist"]

      coffeeTest:
        files: ["test/spec/*.coffee"]
        tasks: ["coffee:test"]

      compass:
        files: ["<%= yeoman.app %>/styles/*.{scss,sass}"]
        tasks: ["compass"]

      livereload:
        files: ["<%= yeoman.app %>/*.html", "{.tmp,<%= yeoman.app %>}/styles/*.css", "{.tmp,<%= yeoman.app %>}/scripts/**/*.js", "<%= yeoman.app %>/images/*.{png,jpg,jpeg}"]
        tasks: ["livereload"]

    connect:
      options:
        port: 9000
        hostname: ""

      livereload:
        options:
          middleware: (connect) ->
            [lrSnippet, mountFolder(connect, ".tmp"), mountFolder(connect, "app")]

      test:
        options:
          middleware: (connect) ->
            [mountFolder(connect, ".tmp"), mountFolder(connect, "test")]

      dist:
        options:
          middleware: (connect) ->
            [mountFolder(connect, "dist")]

    clean:
      dist: [".tmp", "<%= yeoman.dist %>/*"]
      server: ".tmp"

    coffee:
      dist:
        files: [
          expand: yes
          cwd: "<%= yeoman.app %>/scripts/"
          src: "**/*.coffee"
          dest: ".tmp/scripts"
          ext: '.js'
        ]

      test:
        files: [
          expand: true
          cwd: ".tmp/spec"
          src: "*.coffee"
          dest: "test/spec"
        ]

    compass:
      options:
        sassDir: "<%= yeoman.app %>/styles"
        cssDir: ".tmp/styles"
        imagesDir: "<%= yeoman.app %>/images"
        javascriptsDir: "<%= yeoman.app %>/scripts"
        fontsDir: "<%= yeoman.app %>/styles/fonts"
        importPath: "app/components"
        relativeAssets: yes

      dist: {}
      server:
        options:
          debugInfo: true

    uglify:
      dist:
        files:
          "<%= yeoman.dist %>/scripts/main.js": [".tmp/scripts/*.js", "<%= yeoman.app %>/scripts/*.js"]

    useminPrepare:
      html: "<%= yeoman.app %>/index.html"
      options:
        dest: "<%= yeoman.dist %>"

    usemin:
      html: ["<%= yeoman.dist %>/*.html"]
      css: ["<%= yeoman.dist %>/styles/*.css"]
      options:
        dirs: ["<%= yeoman.dist %>"]

    imagemin:
      dist:
        files: [
          expand: true
          cwd: "<%= yeoman.app %>/images"
          src: "*.{png,jpg,jpeg}"
          dest: "<%= yeoman.dist %>/images"
        ]

    cssmin:
      dist:
        files:
          "<%= yeoman.dist %>/styles/main.css": [".tmp/styles/*.css", "<%= yeoman.app %>/styles/*.css"]

    htmlmin:
      dist:
        options: {}

        #removeCommentsFromCDATA: true,
        #                    // https://github.com/yeoman/grunt-usemin/issues/44
        #                    //collapseWhitespace: true,
        #                    collapseBooleanAttributes: true,
        #                    removeAttributeQuotes: true,
        #                    removeRedundantAttributes: true,
        #                    useShortDoctype: true,
        #                    removeEmptyAttributes: true,
        #                    removeOptionalTags: true
        files: [
          expand: true
          cwd: "<%= yeoman.app %>"
          src: "*.html"
          dest: "<%= yeoman.dist %>"
        ]

    copy:
      dist:
        files: [
          expand: true
          dot: true
          cwd: "<%= yeoman.app %>"
          dest: "<%= yeoman.dist %>"
          src: ["*.{ico,txt}", ".htaccess"]
        ]

  grunt.renameTask "regarde", "watch"

  grunt.registerTask "server", (target) ->
    return grunt.task.run(["connect:dist:keepalive"])  if target is "dist"
    grunt.task.run ["clean:server", "coffee:dist", "compass:server", "livereload-start", "connect:livereload", "watch"]

  grunt.registerTask "test", ["clean:server", "coffee", "compass", "connect:test", "mocha"]
  grunt.registerTask "build", ["clean:dist", "jshint", "test", "coffee", "compass:dist", "useminPrepare", "imagemin", "cssmin", "htmlmin", "concat", "uglify", "copy", "usemin"]
  grunt.registerTask "default", ["build"]
