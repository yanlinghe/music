module.exports = (grunt) ->
  grunt.initConfig
    ptk: "<%= pkg.name %>_<%= pkg.project_version %>"
    pub_fol: "../public/"
    pkg: grunt.file.readJSON("package.json")
    # jasmine:
    #   compile:
    #     src: []
    #     options:
    #       keepRunner: true
    #       host: "http://localhost:3000/"
    #       vendor: 'lib/jquery-1.10.2.min.js'
    #       specs: 'test/specs.js'

    jscrambler:
      main:
        options:
          deleteProject: true
          keys:
            accessKey: 'B41F47B5A76E9A92AEFF558E139AE091CF0D4C01',
            secretKey: '83A7BBC8194E104A02B931EFD96C25960C624E29'
          # params:
          #   domain_lock: "polarr.herokuapp.com;polarr.co"
        files: [
          '<%= pub_fol %>js/<%= ptk %>_build.js': "js/<%= ptk %>_build.js"
        ]

    jsObfuscate:
      compile:
        options:
          concurrency: 2
          keepLinefeeds: false
          keepIndentations: false
          encodeStrings: true
          encodeNumbers: true
          moveStrings: true
          replaceNames: true
          variableExclusions: [ '^_get_', '^_set_', '^_mtd_' ]
        files:
          "<%= pub_fol %>js/<%= ptk %>_build.obs.js": "<%= pub_fol %>js/<%= ptk %>_build.js"
    cssmin:
      combine:
        files:
          '<%= pub_fol %>css/bundle.min.css': [
              "css/<%= ptk %>.css"
              "css/third_party/nprogress.css"
              "css/third_party/topcoat-desktop-dark.css"
              "css/third_party/font-awesome.min.css"
              "css/third_party/shepherd-theme-arrows.css"
              "css/third_party/vex-theme-wireframe.css"
              "css/third_party/vex.css"
              "css/third_party/hint.css"
              "css/third_party/perfect-scrollbar.css"
              "css/third_party/spinner.css"
              "css/third_party/jqvmap.css"
          ]
    uglify:
      options:
        banner: '''
/*!
        Minimized for <%= ptk %> <%= grunt.template.today('yyyy-mm-dd') %> Production.
*/\n
                    '''
        compress:
          global_defs:
            "DEBUG": false
          dead_code: true
          drop_console: true
        beautify: false
      production:
        files:
          "js/<%= ptk %>_app.min.js": "js/<%= ptk %>_app.js"
          "js/<%= ptk %>_templates.min.js": "js/<%= ptk %>_templates.js"
          "js/<%= ptk %>_ready.min.js": "js/<%= ptk %>_ready.js"
          "js/<%= ptk %>_init.min.js": "js/<%= ptk %>_init.js"
      production_test:
        files:
          "js/<%= ptk %>_app.min.js": "js/<%= ptk %>_app.js"
      bundle_lib:
        files:
          '<%= pub_fol %>js/lib/bundle.js': '<%= pub_fol %>js/lib/bundle.js'
      bundle_raw:
        files:
          '<%= pub_fol %>js/raw/bundle.js': 'src/raw/bundle.js'


    # htmlbuild:
    #   compile:
    #     src: "src/html/pages/*.html"
    #     dest: ""
    #     options:
    #       beautify: true,
    #       relative: true,
    #       sections:
    #         views: 'src/html/views/*.html'
    #         templates: 'src/html/templates/*.html'
    #         layout:
    #           header: 'src/html/header/header.html'
    #           footer: 'src/html/footer/footer.html'
    #           meta: 'src/html/meta/meta.html'
    coffee:
      # test:
      #   options:
      #     bare:true
      #   files:
      #     "test/specs.js": "test/specs.coffee"
      compile:
        options:
          bare:true
        files:
          "js/<%= ptk %>_app.js": "src/coffeescript/app/*.coffee"
          "js/<%= ptk %>_ready.js": "src/coffeescript/ready/*.coffee"
          "js/<%= ptk %>_init.js": "src/coffeescript/init/*.coffee"
      compile_test:
        options:
          bare:true
        files:
          "js/<%= ptk %>_app.js": ["src/*/*.coffee","src/*.coffee"]

    anonymous:
      dist:
        files:
          "<%= pub_fol %>js/<%= ptk %>_build.js": ["<%= pub_fol %>js/<%= ptk %>_build.js"]

    concat:
      concat_js_protect:
        options:
          banner:  '''
/*!

        Polarr.co Copyright 2014. All rights reserved.

        No part of the materials including graphics, logos, designs, codes,
        available in this Web site may be copied, photocopied, reproduced, translated or
        reduced to any electronic medium or machine-readable form, in whole or in part,
        without specific permission. Distribution for commercial purposes is prohibited.

              ```.......``                                :o
   `.........------.`                             +d
  `.........---------.    h/ooooss/    .oysssy/   +d   -ssooss:h. -doso`oyss/
 `.........------:----`   mh.    `sh  /d-    `oh` +d  +h.    `om- :m+   sm`
 ...-.......----::---:.   m-       m: h+       m: +d  d:       m- :m.   sy
 `----.....------:----`   ms      /d` +h`     /d` +d  oy`     /m- :m`   sy
  .----....-----:----.    moso+/oyo`   :ys+/oyo`  +h   /yo+/os+d- :m`   ss
   `-:::------------`     m:  ..`         ..`             ..`
     `.-::-......``       y-


        Built for <%= ptk %> <%= grunt.template.today('yyyy-mm-dd') %> Production.

*/\n
                    '''
        files:
          "<%= pub_fol %>js/<%= ptk %>_build.js": ["<%= pub_fol %>js/<%= ptk %>_build.js"]
          "<%= pub_fol %>js/lib/bundle.js": ["<%= pub_fol %>js/lib/bundle.js"]
      concat_js_prod:
        options:
          banner:  '''
/*!

        Polarr.co Copyright 2014. All rights reserved.

        No part of the materials including graphics, logos, designs, codes,
        available in this Web site may be copied, photocopied, reproduced, translated or
        reduced to any electronic medium or machine-readable form, in whole or in part,
        without specific permission. Distribution for commercial purposes is prohibited.

              ```.......``                                :o
   `.........------.`                             +d
  `.........---------.    h/ooooss/    .oysssy/   +d   -ssooss:h. -doso`oyss/
 `.........------:----`   mh.    `sh  /d-    `oh` +d  +h.    `om- :m+   sm`
 ...-.......----::---:.   m-       m: h+       m: +d  d:       m- :m.   sy
 `----.....------:----`   ms      /d` +h`     /d` +d  oy`     /m- :m`   sy
  .----....-----:----.    moso+/oyo`   :ys+/oyo`  +h   /yo+/os+d- :m`   ss
   `-:::------------`     m:  ..`         ..`             ..`
     `.-::-......``       y-


        Built for <%= ptk %> <%= grunt.template.today('yyyy-mm-dd') %> Production.

*/\n
                    '''
        files:
          '<%= pub_fol %>js/<%= ptk %>_build.js': ["js/<%= ptk %>_templates.min.js","js/<%= ptk %>_init.min.js","js/<%= ptk %>_app.min.js","js/<%= ptk %>_ready.min.js"]
          'js/<%= ptk %>_build.js': ["js/<%= ptk %>_templates.min.js","js/<%= ptk %>_init.min.js","js/<%= ptk %>_app.min.js","js/<%= ptk %>_ready.min.js"]

      concat_js_dev:
        options:
          banner:  '''
/*!

        Polarr.co Copyright 2014. All rights reserved.

        No part of the materials including graphics, logos, designs, codes,
        available in this Web site may be copied, photocopied, reproduced, translated or
        reduced to any electronic medium or machine-readable form, in whole or in part,
        without specific permission. Distribution for commercial purposes is prohibited.

              ```.......``                                :o
   `.........------.`                             +d
  `.........---------.    h/ooooss/    .oysssy/   +d   -ssooss:h. -doso`oyss/
 `.........------:----`   mh.    `sh  /d-    `oh` +d  +h.    `om- :m+   sm`
 ...-.......----::---:.   m-       m: h+       m: +d  d:       m- :m.   sy
 `----.....------:----`   ms      /d` +h`     /d` +d  oy`     /m- :m`   sy
  .----....-----:----.    moso+/oyo`   :ys+/oyo`  +h   /yo+/os+d- :m`   ss
   `-:::------------`     m:  ..`         ..`             ..`
     `.-::-......``       y-


        Built for <%= ptk %> <%= grunt.template.today('yyyy-mm-dd') %> Development.

*/\n
                    '''
        files:
          '<%= pub_fol %>js/<%= ptk %>_build.js': ["js/<%= ptk %>_templates.js","js/<%= ptk %>_init.js","js/<%= ptk %>_app.js","js/<%= ptk %>_ready.js"]
      concat_sass:
        # options:
        #   banner: "$parameter: value\n"
        files:
          "src/sass/concat.sass" : ["src/sass/app.sass","src/sass/modules/*.sass"]
      concat_lib:
        options:
          separator: ';' # important to get bundle to work
        files:
          '<%= pub_fol %>js/lib/bundle.js': [
              "src/lib/jquery.min.js"
              "src/lib/jade.runtime.js"
              "src/lib/three.min.js"
              "src/lib/shaders/CopyShader.js"
              "src/lib/postprocessing/EffectComposer.js"
              "src/lib/postprocessing/RenderPass.js"
              "src/lib/postprocessing/MaskPass.js"
              "src/lib/postprocessing/ShaderPass.js"
              "src/lib/nprogress.js"
              "src/lib/filesaver.js"
              "src/lib/keypress.js"
              "src/lib/davis.js"
              "src/lib/shepherd.js"
              "src/lib/StackBlur.js"
              "src/lib/third_party/spline_editor.js"
              "src/lib/tinycolor.js"
              "src/lib/perfect-scrollbar.js"
              "src/lib/jquery.sortable.js"
              "src/lib/fabric.js"
              "src/lib/iscroll.js"
              "src/lib/jquery.vmap.js"
              "src/lib/dcraw_bundle.js"
          ]
      # concat_jade_mixins:
        # options:
        #   banner: "$parameter: value\n"
        # files:
        #   "src/jade_backend/mixin_concat/mixins.jade" : ["src/jade_backend/mixins/*.jade"]
    sass:
      compile:
        options:
          style: "compressed"
        files:
          "css/<%= ptk %>.css": "src/sass/concat.sass"
    jade:
      compile_client:
        options:
          client: true
          compileDebug: false
          namespace: "<%= pkg.name %>_templates"
        files:
          "js/<%= ptk %>_templates.js": "src/jade/*.jade"
    #   compile_backend:
    #     options:
    #       client: false
    #       compileDebug: false
    #       pretty: true
    #     files: grunt.file.expandMapping(['*.jade'], '', {
    #         cwd: 'src/jade_backend'
    #         rename: (destBase, destPath)->
    #             return destBase + destPath.replace(/\.jade$/, '.html');
    #       })
        # files:
        #   "": "src/jade_backend/*.jade"
    watch:
      test:
        files: ["src/*/*.coffee","src/*.coffee"]
        tasks: ["coffee:compile_test","uglify:production_test"]
      scripts:
        files: ["src/coffeescript/**/*.coffee"]
        tasks: ["coffee:compile","concat:concat_js_dev"]
      styles:
        files: ["src/sass/*.sass","src/sass/modules/*.sass"]
        tasks: ["concat:concat_sass","sass:compile","cssmin:combine"]
      templates:
        files: "src/jade/*.jade"
        tasks: ["jade:compile_client","concat:concat_js_dev"]
      libs:
        files: ["src/lib/**/*.js"]
        tasks: ["concat:concat_lib"]
      # html:
      #   files: ["src/jade_backend/*.jade","src/jade_backend/layout/*.jade"]
      #   tasks: ["jade:compile_backend"]
      # jade_mixins:
      #   files: "src/jade_backend/mixins/*.jade"
      #   tasks: ["concat:concat_jade_mixins","jade:compile_backend"]
      # htmls:
      #   files: "src/html/**/*.html"
      #   tasks: ["htmlbuild:compile"]

  grunt.loadNpmTasks "grunt-anonymous"
  grunt.loadNpmTasks "grunt-contrib-cssmin"
  grunt.loadNpmTasks "grunt-contrib-concat" # use for concat sass files
  grunt.loadNpmTasks "grunt-contrib-sass"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks 'js-obfuscator'
  # grunt.loadNpmTasks "grunt-contrib-jasmine"
  # grunt.loadNpmTasks "grunt-html-build"
  grunt.registerTask "default", ["watch"]
  grunt.registerTask "bundle_lib", ["concat:concat_lib"]
  grunt.registerTask "bundle_raw", ["uglify:bundle_raw"]
  grunt.registerTask "ugly", ["concat:concat_lib","uglify:bundle_lib","uglify:production","concat:concat_js_prod","anonymous"]
  grunt.registerTask "protect", ["concat:concat_lib","uglify:bundle_lib","uglify:production","concat:concat_js_prod","jscrambler:main","concat:concat_js_protect","anonymous"]
  grunt.registerTask "obs", ["jsObfuscate:compile"]
  grunt.registerTask "dev", ["coffee:compile","jade:compile_client","concat:concat_sass","sass:compile","cssmin:combine","concat:concat_lib","concat:concat_js_dev"]
  # grunt.registerTask "test", ["coffee:test","jasmine"]